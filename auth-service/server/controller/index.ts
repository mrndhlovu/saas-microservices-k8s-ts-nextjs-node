import { Request, Response } from "express"
import {
  BadRequestError,
  HTTPStatusCode,
  IJwtAccessTokens,
  IJwtAuthToken,
  NotAuthorisedError,
  NotFoundError,
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
  AddBoardMemberPublisher,
} from "../events/publishers"
import { mfaService, TokenService } from "../services"
import { SendEmailPublisher } from "../events/publishers/send-email"
import isEmail from "validator/lib/isEmail"

declare global {
  namespace Express {
    interface Request {
      currentUser?: IUserDocument
      bearerToken?: string
      session?: {
        jwt: IJwtAccessTokens
        httpOnly?: boolean
        domain?: string
        sameSite?: boolean
        signed?: boolean
      } | null
    }
  }
}

class AuthController {
  signUpUser = async (req: Request, res: Response) => {
    let user = new User({ ...req.body })

    user.permissionFlag = permissionManager.permissions.STANDARD

    const tokenToSign: IJwtAuthToken = {
      email: user.email,
      username: user?.username,
      boardInviteId: req?.body.boardInviteId,
    }

    const [otp, otpHash] = await AuthService.generateOtp()
    const accessToken = await TokenService.generateToken(tokenToSign, {
      expiresIn: "5m",
      type: "otp",
    })
    AuthService.addUserToken(user, `${otpHash}:${accessToken}`)

    await user.save()

    const email = {
      email: user.email!,
      body: `
      <p>To complete your sign up, and as an additional security measure, 
      you are requested to enter the one-time password (OTP) provided 
      in this email.<p>
      <p>Copy the One Time Pin below.</p>
      <br>The OTP code is: <strong>${otp}</strong>
      <p><a href="${BASE_URL}/auth/verify?token=${accessToken}" rel="noreferrer" target="_blank">Verify your code here.</a></p>`,
      subject: "Email verification to activate your account.",
      from: DEFAULT_EMAIL,
    }

    await new SendEmailPublisher(natsService.client).publish(email)

    res.status(201).send({})
  }

  getCurrentUser = async (req: Request, res: Response) => {
    if (req?.currentUser!.status !== "active") {
      req.session = null
      throw new NotAuthorisedError("This account is not active.")
    }
    res.status(200).send(req.currentUser)
  }

  loginUser = async (req: Request, res: Response) => {
    const user = req.currentUser!
    AuthService.removeUserToken(user, req.session?.jwt?.access!)

    const tokenToSign: IJwtAuthToken = {
      email: user.email,
      userId: user.id,
      username: user?.username,
    }

    const tokens = await TokenService.getAuthTokens(tokenToSign, {
      accessExpiresAt: "30m",
      refreshExpiresAt: "12h",
    })
    AuthService.addUserToken(user, `${tokens.access}:${tokens.refresh}`)
    TokenService.generateCookies(req, {
      tokens,
      httpOnly: true,
    })

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
    AuthService.removeUserToken(req.currentUser!, req.session?.jwt?.access!)
    await req.currentUser!.save()

    req.session = null
    res.status(200).send({ success: true })
  }

  logoutAllSessions = async (req: Request, res: Response) => {
    req.currentUser!.authTokens = []
    await req.currentUser!.save()

    req.session = null
    res.status(200).send({ success: true })
  }

  verifyOtp = async (req: Request, res: Response) => {
    if (!req.body.verificationCode)
      throw new BadRequestError("verificationCode is required")

    const user = req.currentUser

    if (!user) throw new BadRequestError("User not found.")

    const isValid = await AuthService.verifyOtp(
      req.body.verificationCode,
      req.session?.jwt.access!,
      user.email,
      req.path
    )

    user.isVerified = isValid
    user.status = "active"

    AuthService.removeUserToken(user, req.session?.jwt?.access!)

    await user.save()
    new UserVerifiedPublisher(natsService.client).publish({
      id: user._id,
      email: user.email,
      verified: user.isVerified,
    })

    req.session = null
    res.send({ success: true })
  }

  resendOtp = async (req: Request, res: Response) => {
    const user = await AuthService.findUserOnlyByEmail(req.body.email)
    if (!user) throw new BadRequestError("User not found")

    AuthService.removeUserToken(user, req.session?.jwt?.access!)

    if (!req.session?.jwt?.access) {
      user.authTokens = []
    }

    const [otp, otpHash] = await AuthService.generateOtp()

    const tokenToSign: IJwtAuthToken = {
      username: user.username,
      email: req.body.email,
    }
    const EXPIRES_IN = "5m"
    const accessToken = await TokenService.generateToken(tokenToSign, {
      expiresIn: EXPIRES_IN,
      type: "otp",
    })

    AuthService.addUserToken(user, `${otpHash}:${accessToken}`)
    TokenService.generateCookies(req, {
      tokens: { access: accessToken },
      httpOnly: true,
    })

    await user.save()

    const email = {
      email: user.email!,
      body: `
      <p>To complete your sign up, and as an additional security measure,
      you are requested to enter the one-time password (OTP) provided
      in this email.<p>
      <p>Copy the One Time Pin below.</p>
      <br>The OTP code is: <strong>${otp}</strong>
      <p><a href="${BASE_URL}/auth/verify?token=${accessToken}" rel="noreferrer" target="_blank">Verify your code here.</a></p>`,
      subject: "Email verification to activate your account.",
      from: DEFAULT_EMAIL,
    }

    await new SendEmailPublisher(natsService.client).publish(email)

    res.send({
      message: "Please check you email for your verification link",
    })
  }

  updatePassword = async (req: Request, res: Response) => {
    if (!req.body.password)
      throw new BadRequestError("password field is required")

    const user = req.currentUser
    if (!user) throw new BadRequestError("Bad credentials")

    user.password = req.body.password
    AuthService.removeUserToken(user, req.session?.jwt!?.access!)
    req.session = null

    const tokenToSign: IJwtAuthToken = {
      username: "",
      email: user.email,
    }

    const EXPIRES_IN = "365d"
    const token = await TokenService.generateToken(tokenToSign, {
      expiresIn: EXPIRES_IN,
      type: "otp",
    })

    AuthService.addUserToken(user, token)
    user.save()

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

    res.send({ success: true })
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
    }

    res.send(updatedRecord)
  }

  deleteUser = async (req: Request, res: Response) => {
    const user = await AuthService.findUserOnlyByEmail(
      req.currentUserJwt?.email
    )

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
    // TokenService.invalidateRefreshToken(user)
    res.status(200).send({})
  }

  handleForgotPassword = async (req: Request, res: Response) => {
    const user = await AuthService.findUserOnlyByEmail(req.body.email)
    if (!user) throw new BadRequestError("User not found.")

    const tokenToSign: IJwtAuthToken = {
      username: user.username,
      email: req.body.email,
    }
    const EXPIRES_IN = "5m"
    const accessToken = await TokenService.generateToken(tokenToSign, {
      expiresIn: EXPIRES_IN,
      type: "otp",
    })

    AuthService.addUserToken(user, accessToken)

    await user.save()

    const email = {
      email: user.email!,
      body: `
      <p>Use the link below to reset your password.<p>
        <p>Click the link below to update password.</p>
      <br><a href="${BASE_URL}/auth/forgot-password?token=${accessToken}" rel="noreferrer" target="_blank">RESET YOUR PASSWORD NOW!</a>`,
      subject: "Password recovery.",
      from: DEFAULT_EMAIL,
    }

    await new SendEmailPublisher(natsService.client).publish(email)

    const response = {
      message: "Please check you email for your reset password link.",
    }

    req.session = null

    res.status(200).send(response)
  }

  validateAccount = async (req: Request, res: Response) => {
    const user = req.currentUser
    if (!user) throw new BadRequestError("User not found.")
    if (!req.body.newPassword) {
      throw new BadRequestError("Password field is required")
    }

    user.password = req.body.newPassword
    AuthService.removeUserToken(user, req.session?.jwt!?.access!)

    const tokenToSign: IJwtAuthToken = {
      username: "",
      email: user.email,
    }
    const EXPIRES_IN = "365d"
    const token = await TokenService.generateToken(tokenToSign, {
      expiresIn: EXPIRES_IN,
      type: "otp",
    })

    AuthService.addUserToken(user, token)
    await user.save()

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

    res.status(200).send({ success: true })
  }

  enableMfa = async (req: Request, res: Response) => {
    res.status(200).send(req.currentUser)
  }

  // verifyMfa = async (req: Request, res: Response) => {
  //   const tokenToSign: IJwtAuthToken = {
  //     userId: req.currentUser!._id.toHexString(),
  //     email: req.currentUser!.email,
  //     username: req.currentUser!.username,
  //     mfa: {
  //       validated: true,
  //       enabled: req.currentUser!.multiFactorAuth,
  //     },
  //   }

  //   const tokens = await TokenService.getAuthTokens(tokenToSign)
  //   req.currentUser!.multiFactorAuth = true
  //   TokenService.generateCookies(req, tokens)

  //   await req.currentUser!.save()

  //   res.status(200).send(req.currentUser)
  // }

  // connectMfa = async (req: Request, res: Response) => {
  //   const isConnected = mfaService.validatedToken(req.body.code)

  //   if (!isConnected) throw new BadRequestError("Validation failed")

  //   const tokenToSign: IJwtAuthToken = {
  //     userId: req.currentUser!._id.toHexString(),
  //     email: req.currentUser!.email,
  //     username: req.currentUser!.username,

  //     mfa: {
  //       validated: true,
  //       enabled: isConnected,
  //     },
  //   }

  //   req.currentUser!.tokens = await TokenService.getAuthTokens(tokenToSign)

  //   TokenService.generateCookies(req, req.currentUser!.tokens)

  //   mfaService.generate2StepRecoveryPassword(req.currentUser!)

  //   await req.currentUser!.save()

  //   res.status(200).send(req.currentUser)
  // }

  refreshToken = async (req: Request, res: Response) => {
    const user = req.currentUser

    if (!user) throw new NotAuthorisedError("User not found.")

    var refreshToken = req.session?.jwt.refresh

    if (!user || !refreshToken) {
      req.session = null
      throw new NotAuthorisedError(
        "Authentication credentials may have expired."
      )
    }

    AuthService.removeUserToken(user, refreshToken)

    if (!user?.isVerified) {
      throw new NotAuthorisedError(
        `Please verify account via link sent to: ${user.email}`
      )
    }

    const tokenToSign: IJwtAuthToken = {
      email: user.email,
      username: user?.username,
    }
    const tokens = await TokenService.getAuthTokens(tokenToSign, {
      accessExpiresAt: "30m",
      refreshExpiresAt: "12h",
    })
    AuthService.addUserToken(user, `${tokens.access}:${tokens.refresh}`)
    TokenService.generateCookies(req, {
      tokens,
      httpOnly: true,
    })

    await user.save()

    res.status(200).send({ user })
  }

  pauseAccount = async (req: Request, res: Response) => {
    const user = req.currentUser

    if (!user) throw new NotAuthorisedError("User not found.")
    user.status = "paused"
    await user.save()

    const email = {
      email: user.email!,
      body: `
      <p>Account paused.</p
      ><p>Please click the link below to restore you account:</p>
      <a rel="noreferrer" target="_blank" href="${RESTORE_ACCOUNT_ENDPOINT}">${RESTORE_ACCOUNT_ENDPOINT}</a>
      `,
      subject: "Account locked.",
      from: DEFAULT_EMAIL,
    }
    await new SendEmailPublisher(natsService.client).publish(email)

    res.status(200).send({ success: true })
  }

  verifyRecoveryEmail = async (req: Request, res: Response) => {
    if (!req?.body?.email) {
      throw new NotFoundError("Email field is required.")
    }

    const user = await AuthService.findUserOnlyByEmail(req.body.email)
    if (!user) throw new NotAuthorisedError("User not found.")

    const [otp, otpHash] = await AuthService.generateOtp()
    AuthService.removeUserToken(user, req.session?.jwt!?.access!)

    const tokenToSign: IJwtAuthToken = {
      username: "",
      email: user.email,
    }
    const EXPIRES_IN = "5m"
    const token = await TokenService.generateToken(tokenToSign, {
      expiresIn: EXPIRES_IN,
      type: "otp",
    })
    AuthService.addUserToken(user, `${otpHash}:${token}`)
    TokenService.generateCookies(req, {
      tokens: { access: token },
      httpOnly: true,
    })

    await user.save()

    const email = {
      email: user.email!,
      body: `
      <p>To complete your account recovery, and as an additional security measure, 
      you are requested to enter the one-time password (OTP) provided 
      in this email.<p>
      <p>Copy the One Time Pin below.</p>
      <br>The OTP code is: <strong>${otp}</strong>`,
      subject: "Account recovery.",
      from: DEFAULT_EMAIL,
    }
    await new SendEmailPublisher(natsService.client).publish(email)

    res.status(200).send({ success: true })
  }

  restoreAccount = async (req: Request, res: Response) => {
    const user = req.currentUser
    if (!user) throw new NotAuthorisedError("User not found.")

    const isValid = await AuthService.verifyOtp(
      req.body.verificationCode,
      req.session?.jwt.access!,
      user.email,
      req.path
    )

    if (!isValid) {
      req.session = null
      throw new NotAuthorisedError("Access token expired.")
    }

    user.isVerified = isValid
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

  inviteToBoard = async (req: Request, res: Response) => {
    const { identifier, boardId } = req.query

    let user = req.currentUser!

    const isValidEmail = isEmail(identifier as string)

    if (isValidEmail && identifier === user.email) {
      throw new BadRequestError(
        `User with email ${user.email} is already a board member.`
      )
    }

    if (!isValidEmail && identifier === user.username) {
      throw new BadRequestError(
        `User with username ${user.username} is already a board member.`
      )
    }

    const invitee = isValidEmail
      ? await AuthService.findUserOnlyByEmail(identifier as string)
      : await AuthService.findUserOnlyByUsername(identifier as string)

    if (!isValidEmail && !invitee) {
      throw new BadRequestError(
        `User with username: ${identifier} was not found.`
      )
    }

    if (invitee?.boardIds?.includes(boardId as string)) {
      throw new BadRequestError(`User already a board member.`)
    }

    const tokenToSign = {
      email: invitee?.email || (identifier as string),
      userId: user.id,
      username: "",
      boardId: boardId as string,
    }

    const tokens = await TokenService.getAuthTokens(tokenToSign, {
      accessExpiresAt: "2d",
    })

    if (invitee) {
      AuthService.addUserToken(invitee, `${tokens.access}`)
    }

    AuthService.addUserToken(user, `${tokens.access}`)

    const email = {
      email: invitee?.email || (identifier as string),
      body: `
      <p>${user?.email} invited you to access a board.<p>
      <p>Click the link below to accept the invite</p>
      <p><a href="https://tusks.dev/auth/accept-board-invite?token=${tokens.access}&boardInviteId=${boardId}" rel="noreferrer" target="_blank">Accept</a></p>`,
      subject: "You have be invited to access a board.",
      from: DEFAULT_EMAIL,
    }

    await new SendEmailPublisher(natsService.client).publish(email)
    res.status(HTTPStatusCode.NoContent).send()
  }

  async acceptBoardInvite(req: Request, res: Response) {
    const user = req.currentUser!

    if (!req?.query?.boardInviteId) {
      throw new BadRequestError("Board id is required")
    }

    user.boardIds.push(req?.query?.boardInviteId as string)
    await user?.save()

    await new AddBoardMemberPublisher(natsService.client).publish({
      memberId: user.id,
      boardInviteId: req?.query?.boardInviteId as string,
    })

    res.status(HTTPStatusCode.OK).send("OK")
  }

  async getBoardMembers(req: Request, res: Response) {
    const memberIds = (req.query?.memberIds as string).split("-")
    const ids = memberIds.map(memberId => memberId?.split(":")?.[0])

    const members = await User.find({ _id: { $in: ids } })

    const data = members.map(member => ({
      id: member.id,
      username: member.username,
      firstName: member.firstName,
      lastName: member.lastName,
      profileImage: member?.avatar,
      initials: member?.initials,
    }))

    res.status(HTTPStatusCode.OK).send(data)
  }
}

export const authController = new AuthController()
