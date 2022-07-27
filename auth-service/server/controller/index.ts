import { Request, Response } from "express"
import {
  ACCOUNT_TYPE,
  BadRequestError,
  IJwtAccessTokens,
  IJwtAuthToken,
  NotAuthorisedError,
  permissionManager,
} from "@tusksui/shared"
import { AuthService } from "../services/auth"
import {
  BASE_URL,
  DEFAULT_EMAIL,
  editableUserFields,
  DID_NOT_UPDATE_PASSWORD_ENDPOINT,
  RESTORE_ACCOUNT_ENDPOINT,
  LOGIN_ENDPOINT,
} from "../utils/constants"
import { natsService } from "../services/nats"
import { IUserDocument, User } from "../models/User"
import {
  UserDeletedPublisher,
  UserVerifiedPublisher,
} from "../events/publishers"
import { mfaService, CookieService } from "../services"
import { SendEmailPublisher } from "../events/publishers/send-email"

declare global {
  namespace Express {
    interface Request {
      currentUser?: IUserDocument
      session:
        | {
            jwt: IJwtAccessTokens
          }
        | null
        | undefined
    }
  }
}

class AuthController {
  signUpUser = async (req: Request, res: Response) => {
    let user = new User({ ...req.body })

    user.permissionFlag = permissionManager.updatePermission(
      permissionManager.permissions.TRIAL,
      ACCOUNT_TYPE.STANDARD
    )

    const tokenToSign: IJwtAuthToken = {
      userId: user._id.toHexString(),
      email: user.email,
      username: user?.username,
    }

    const tokens = await CookieService.getAuthTokens(tokenToSign, {
      accessExpiresAt: "10m",
    })

    await user.save()
    const otp = await AuthService.generateOtp(user._id)

    const email = {
      email: user.email!,
      body: `
      <p>To complete your sign up, and as an additional security measure, 
      you are requested to enter the one-time password (OTP) provided 
      in this email.<p>
      <p>Copy the One Time Pin below.</p>
      <br>The OTP code is: <strong>${otp}</strong>
      <p><a href="${BASE_URL}/auth/verify?token=${tokens.access}" rel="noreferrer" target="_blank">Verify your code here.</a></p>`,
      subject: "Email verification to activate your account.",
      from: DEFAULT_EMAIL,
    }

    await new SendEmailPublisher(natsService.client).publish(email)

    res.status(201).send(user)
  }

  getCurrentUser = async (req: Request, res: Response) => {
    res.status(200).send(req.currentUser)
  }

  loginUser = async (req: Request, res: Response) => {
    const user = req.currentUser!

    const tokenToSign: IJwtAuthToken = {
      userId: user._id.toHexString(),
      email: user.email,
      username: user?.username,
    }

    const tokens = await CookieService.getAuthTokens(tokenToSign, {
      accessExpiresAt: "1h",
      refreshExpiresAt: "1d",
    })
    CookieService.generateCookies(req, tokens)

    await user.save()

    res.status(200).send(user)
  }

  confirmAction = async (req: Request, res: Response) => {
    const user = req.currentUser!
    if (!user) throw new BadRequestError("User not found.")
    res.status(200).send({ success: true })
  }

  getQrCode = async (req: Request, res: Response) => {
    const qrCodeImage = await mfaService.generateQrCode(req.currentUser!.email!)

    res.status(200).send({ qrCodeImage })
  }

  logoutUser = async (req: Request, res: Response) => {
    await req.currentUser!.save()
    CookieService.invalidateRefreshToken(req.currentUser!)

    req.session = null
    res.send({})
  }

  verifyOtp = async (req: Request, res: Response) => {
    if (!req.body.verificationCode)
      throw new BadRequestError("verificationCode is required")

    const user = req.currentUser
    if (!user) throw new BadRequestError("User not found.")

    const isValid = await AuthService.verifyOtp(
      req.body.verificationCode,
      user._id
    )

    user.isVerified = isValid
    user.status = "active"
    user.save()

    new UserVerifiedPublisher(natsService.client).publish({
      id: user._id,
      email: user.email,
      verified: user.isVerified,
    })

    res.send({ user })
  }

  resendOtp = async (req: Request, res: Response) => {
    const user = await AuthService.findUserOnlyByEmail(req.body.email)
    if (!user) throw new BadRequestError("User not found")

    const existingOtpToken = await AuthService.getTokenByUserId(user._id, "otp")
    if (existingOtpToken) {
      existingOtpToken.valid = false
      existingOtpToken.save()
    }

    const otp = await AuthService.generateOtp(user._id)

    const tokenToSign: IJwtAuthToken = {
      userId: user._id,
      username: user.username,
      email: req.body.email,
    }
    const EXPIRES_IN = "5m"
    const token = CookieService.generateAccessToken(tokenToSign, EXPIRES_IN)

    const email = {
      email: user.email!,
      body: `
      <p>To complete your sign up, and as an additional security measure, 
      you are requested to enter the one-time password (OTP) provided 
      in this email.<p>
      <p>Copy the One Time Pin below.</p>
      <br>The OTP code is: <strong>${otp}</strong>
      <p><a href="${BASE_URL}/auth/verify?token=${token}" rel="noreferrer" target="_blank">Verify your code here.</a></p>`,
      subject: "Email verification to activate your account.",
      from: DEFAULT_EMAIL,
    }

    await new SendEmailPublisher(natsService.client).publish(email)

    res.send({ message: "Please check you email for your verification link" })
  }

  updatePassword = async (req: Request, res: Response) => {
    if (!req.body.password)
      throw new BadRequestError("password field is required")

    const user = await User.findById(req?.currentUser?._id)
    if (!user) throw new BadRequestError("Bad credentials")

    user.password = req.body.password
    user.save()
    req.session = null
    CookieService.invalidateRefreshToken(user)
    res.send(user)
  }

  updateUser = async (req: Request, res: Response) => {
    const updateFields = Object.keys(req.body)

    const hasValidFields = AuthService.validatedUpdateFields(
      updateFields,
      editableUserFields
    )

    if (!hasValidFields) throw new BadRequestError("Field is not editable.")

    const updatedRecord = await User.findOneAndUpdate(
      { _id: req?.currentUser?._id },
      { $set: { ...req.body } },
      { new: true }
    )

    if (!updatedRecord) throw new BadRequestError("Failed to updated record.")

    await updatedRecord.save()

    if (updateFields.includes("username")) {
      req.session = null
      CookieService.invalidateRefreshToken(updatedRecord)
    }

    res.send(updatedRecord)
  }

  deleteUser = async (req: Request, res: Response) => {
    const user = await CookieService.findUserByJwt(req.currentUserJwt)

    if (!user) throw new BadRequestError("User not found.")

    const userId = user._id.toHexString()
    const email = user.email
    const boardIds = user.boardIds

    await user.delete()

    if (user.isVerified) {
      new UserDeletedPublisher(natsService.client).publish({
        id: userId,
        boardIds,
        email,
      })
    }
    req.session = null
    CookieService.invalidateRefreshToken(user)
    res.status(200).send({})
  }

  handleForgotPassword = async (req: Request, res: Response) => {
    const user = await AuthService.findUserOnlyByEmail(req.body.email)
    if (!user) throw new BadRequestError("User not found.")

    const tokenToSign: IJwtAuthToken = {
      userId: user._id,
      username: user.username,
      email: req.body.email,
    }
    const EXPIRES_IN = "5m"
    const token = CookieService.generateAccessToken(tokenToSign, EXPIRES_IN)

    const email = {
      email: user.email!,
      body: `
      <p>Use the link below to reset your password.<p>
      <br>The OTP code is: <a href="${BASE_URL}/auth/verify?token=${token}" rel="noreferrer" target="_blank">RESET YOUR PASSWORD NOW!</a>`,
      subject: "Password recovery.",
      from: DEFAULT_EMAIL,
    }

    await new SendEmailPublisher(natsService.client).publish(email)

    const response = {
      message: "Please check you email for your reset password link.",
    }

    CookieService.invalidateRefreshToken(user)
    req.session = null

    res.status(200).send(response)
  }

  validateAccount = async (req: Request, res: Response) => {
    const user = req.currentUser
    if (!user) throw new BadRequestError("User not found.")
    if (!req.body.newPassword)
      throw new BadRequestError("Password field is required")

    user.password = req.body.newPassword
    user.save()
    req.session = null
    CookieService.invalidateRefreshToken(user)

    const tokenToSign: IJwtAuthToken = {
      userId: "",
      username: "",
      email: user.email,
    }
    const EXPIRES_IN = "365d"
    const token = CookieService.generateAccessToken(tokenToSign, EXPIRES_IN)

    const email = {
      email: user.email!,
      body: `
      <p>Your password was updated.</p
      ><p>If you did not make this change, click the link below:</p>
      <a rel="noreferrer" target="_blank" href="${DID_NOT_UPDATE_PASSWORD_ENDPOINT}/${token}">${DID_NOT_UPDATE_PASSWORD_ENDPOINT}</a>
      `,
      subject: "Password updated.",
      from: DEFAULT_EMAIL,
    }
    await new SendEmailPublisher(natsService.client).publish(email)

    res.status(200).send({ ok: !!user })
  }

  enableMfa = async (req: Request, res: Response) => {
    res.status(200).send(req.currentUser)
  }

  verifyMfa = async (req: Request, res: Response) => {
    const tokenToSign: IJwtAuthToken = {
      userId: req.currentUser!._id.toHexString(),
      email: req.currentUser!.email,
      username: req.currentUser!.username,
      mfa: {
        validated: true,
        enabled: req.currentUser!.multiFactorAuth,
      },
    }

    const tokens = await CookieService.getAuthTokens(tokenToSign)
    req.currentUser!.multiFactorAuth = true
    CookieService.generateCookies(req, tokens)

    await req.currentUser!.save()

    res.status(200).send(req.currentUser)
  }

  connectMfa = async (req: Request, res: Response) => {
    const isConnected = mfaService.validatedToken(req.body.code)

    if (!isConnected) throw new BadRequestError("Validation failed")

    const tokenToSign: IJwtAuthToken = {
      userId: req.currentUser!._id.toHexString(),
      email: req.currentUser!.email,
      username: req.currentUser!.username,

      mfa: {
        validated: true,
        enabled: isConnected,
      },
    }

    req.currentUser!.tokens = await CookieService.getAuthTokens(tokenToSign)

    CookieService.generateCookies(req, req.currentUser!.tokens)

    mfaService.generate2StepRecoveryPassword(req.currentUser!)

    await req.currentUser!.save()

    res.status(200).send(req.currentUser)
  }

  refreshToken = async (req: Request, res: Response) => {
    const REFRESH_TOKEN_MAX_REUSE = 5
    const user = req.currentUser

    if (!user) throw new NotAuthorisedError("User not found.")

    var refreshToken = await CookieService.findRefreshTokenByUserId(user?._id)

    if (!user || !refreshToken?.valid || !refreshToken) {
      req.session = null
      throw new NotAuthorisedError(
        "Authentication credentials may have expired."
      )
    }

    refreshToken.save()

    if (!user?.isVerified) {
      CookieService.invalidateRefreshToken(user)
      throw new NotAuthorisedError(
        `Please verify account via link sent to: ${user.email}`
      )
    }

    const tokenToSign: IJwtAuthToken = {
      userId: user._id.toHexString(),
      email: user.email,
      username: user?.username,
    }
    const expiresIn = "3h"
    user.tokens = {
      access: CookieService.generateAccessToken(tokenToSign, expiresIn),
      refresh: req.session?.jwt?.refresh,
    }

    CookieService.generateCookies(req, user.tokens)

    await user.save()

    res.status(200).send({ user })
  }

  pauseAccount = async (req: Request, res: Response) => {
    const user = await AuthService.findUserOnlyByEmail(req.currentUserJwt.email)

    if (!user) throw new NotAuthorisedError("User not found.")
    user.status = "paused"
    await user.save()

    const email = {
      email: user.email!,
      body: `
      <p>Account paused.</p
      ><p>Please click the link below to restore you account:</p>
      <a rel="noreferrer" target="_blank" href="${RESTORE_ACCOUNT_ENDPOINT}">${BASE_URL}</a>
      `,
      subject: "Password updated.",
      from: DEFAULT_EMAIL,
    }
    await new SendEmailPublisher(natsService.client).publish(email)

    res.status(200).send({})
  }

  restoreAccount = async (req: Request, res: Response) => {
    const user = req.currentUser
    if (!user) throw new NotAuthorisedError("User not found.")

    user.status = "active"
    await user.save()

    const email = {
      email: user.email!,
      body: `
      <p>Account restored.</p
      ><p>You successfully restored your account, click the link below to login:</p>
      <a rel="noreferrer" target="_blank" href="${LOGIN_ENDPOINT}">${LOGIN_ENDPOINT}</a>
      `,
      subject: "Account restored.",
      from: DEFAULT_EMAIL,
    }
    await new SendEmailPublisher(natsService.client).publish(email)

    res.status(200).send({})
  }
}

export const authController = new AuthController()
