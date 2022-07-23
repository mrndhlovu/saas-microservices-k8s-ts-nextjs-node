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
import { DEFAULT_EMAIL, editableUserFields } from "../utils/constants"
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

    const tokens = await CookieService.getAuthTokens(tokenToSign)
    CookieService.generateCookies(req, tokens)

    await user.save()
    const otp = await AuthService.generateOtp(user._id)

    const email = {
      email: user.email!,
      body: `
      <p>To complete your sign up, and as an additional security measure, 
      you are requested to enter the one-time password (OTP) provided 
      in this email.<p><br>The OTP code is: <strong>${otp}</strong>`,
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

    const tokens = await CookieService.getAuthTokens(tokenToSign)
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

    const isVerified = await AuthService.verifyOtp(
      req.body.verificationCode,
      user._id
    )

    user.isVerified = isVerified
    user.save()

    new UserVerifiedPublisher(natsService.client).publish({
      id: user._id,
      email: user.email,
      verified: user.isVerified,
    })

    res.send({ user })
  }

  getVerificationEmail = async (req: Request, res: Response) => {
    const user = await AuthService.findUserOnlyByEmail(req.body.email)
    if (!user) throw new BadRequestError("Invalid credentials")
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

  forgotPassword = async (req: Request, res: Response) => {
    const user = await AuthService.findUserOnlyByEmail(req.body.email)
    if (!user) throw new BadRequestError("User not found.")

    const response = {
      message: "Please check you email for your reset password link.",
    }

    res.status(200).send(response)
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
    const user = await CookieService.findUserByRefreshJwt(
      req.session!.jwt?.refresh!
    )

    var refreshToken = await CookieService.findRefreshTokenOnlyById(
      req.session!.jwt?.refresh!
    )

    if (!user || refreshToken?.invalidated || !refreshToken) {
      req.session = null
      throw new NotAuthorisedError(
        "Authentication credentials may have expired."
      )
    }

    if (refreshToken.useCount > REFRESH_TOKEN_MAX_REUSE) {
      CookieService.invalidateRefreshToken(user)

      throw new NotAuthorisedError(
        "Authentication credentials may have expired."
      )
    }
    refreshToken.useCount = refreshToken.useCount + 1
    refreshToken.save()

    if (!user?.account.isVerified) {
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
    const expiresIn = "2d"
    user.tokens = {
      access: CookieService.generateAccessToken(tokenToSign, expiresIn),
      refresh: req.session?.jwt?.refresh,
    }

    CookieService.generateCookies(req, user.tokens)

    await user.save()

    res.status(200).send({ user })
  }
}

export const authController = new AuthController()
