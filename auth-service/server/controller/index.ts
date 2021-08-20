import { Request, Response } from "express"

import {
  ACCOUNT_TYPE,
  BadRequestError,
  IJwtAccessTokens,
  IJwtAuthToken,
  permissionManager,
} from "@tusksui/shared"

import { authService } from "../services/auth"
import { editableUserFields } from "../utils/constants"
import { natsService } from "../services/nats"
import { IUserDocument, User } from "../models/User"
import {
  UserDeletedPublisher,
  UserCreatedPublisher,
} from "../events/publishers"
import { mfaService } from "../services"

declare global {
  namespace Express {
    interface Request {
      currentUser: IUserDocument | null | undefined
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
    }

    user.tokens = await authService.getAuthTokens(tokenToSign)
    authService.generateAuthCookies(req, user.tokens)

    await user.save()

    new UserCreatedPublisher(natsService.client).publish({
      id: user._id.toHexString(),
      username: user.username!,
      firstname: user.firstname!,
      lastname: user.lastname!,
      email: user.email!,
    })

    res.status(201).send(user)
  }

  getCurrentUser = async (req: Request, res: Response) => {
    res.status(200).send(req.currentUser)
  }

  loginUser = async (req: Request, res: Response) => {
    const { identifier, password } = req.body

    const user = await authService.findUserByCredentials(identifier, password)

    const tokenToSign: IJwtAuthToken = {
      userId: user._id.toHexString(),
      email: user.email,
    }

    user.tokens = await authService.getAuthTokens(tokenToSign, {
      accessToken: req.session?.jwt.access,
    })
    authService.generateAuthCookies(req, user.tokens)

    await user.save()

    res.status(200).send(user)
  }

  verifyCredentials = async (req: Request, res: Response) => {
    const { identifier, password } = req.body

    const user = await authService.findUserByCredentials(identifier, password)

    if (!user) throw new BadRequestError("User not found.")

    res.status(200).send({ success: true })
  }

  getQrCode = async (req: Request, res: Response) => {
    const qrCodeImage = await mfaService.generateQrCode(req.currentUser!.email!)

    res.status(200).send({ qrCodeImage })
  }

  logoutUser = async (req: Request, res: Response) => {
    req.currentUser!.updateOne({
      $set: { tokens: { access: "", refresh: "" } },
    })

    await req.currentUser!.save()

    req.session = null
    res.send({})
  }

  getVerificationEmail = async (req: Request, res: Response) => {
    const user = await authService.findUserOnlyByEmail(req.body.email)

    if (!user)
      throw new BadRequestError(
        `Account link to email ${req.body.email} not found.`
      )

    res.send({ message: "Please check you email for your verification link" })
  }

  updateUser = async (req: Request, res: Response) => {
    const updateFields = Object.keys(req.body)

    const hasValidFields = authService.validatedUpdateFields(
      updateFields,
      editableUserFields
    )

    if (!hasValidFields) throw new BadRequestError("Field is not editable.")

    const updatedRecord = await User.findOneAndUpdate(
      { _id: req.currentUser!._id },
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
    const user = await authService.findUserByJwt(req.currentUserJwt)

    if (!user) throw new BadRequestError("User not found.")

    const userId = user._id.toHexString()
    const email = user.email
    const boardIds = user.boardIds

    await user.delete()

    new UserDeletedPublisher(natsService.client).publish({
      id: userId,
      boardIds,
      email,
    })

    req.session = null

    res.status(200).send({})
  }

  enableMfa = async (req: Request, res: Response) => {
    res.status(200).send(req.currentUser)
  }

  verifyMfa = async (req: Request, res: Response) => {
    const tokenToSign: IJwtAuthToken = {
      userId: req.currentUser!._id.toHexString(),
      email: req.currentUser!.email,
      mfa: {
        validated: true,
        enabled: req.currentUser!.multiFactorAuth,
      },
    }

    req.currentUser!.tokens = await authService.getAuthTokens(tokenToSign)
    req.currentUser!.multiFactorAuth = true
    authService.generateAuthCookies(req, req.currentUser!.tokens)

    await req.currentUser!.save()

    res.status(200).send(req.currentUser)
  }

  connectMfa = async (req: Request, res: Response) => {
    const isConnected = mfaService.validatedToken(req.body.code)

    if (!isConnected) throw new BadRequestError("Validation failed")

    const tokenToSign: IJwtAuthToken = {
      userId: req.currentUser!._id.toHexString(),
      email: req.currentUser!.email,
      mfa: {
        validated: true,
        enabled: isConnected,
      },
    }

    req.currentUser!.tokens = await authService.getAuthTokens(tokenToSign)

    authService.generateAuthCookies(req, req.currentUser!.tokens)

    mfaService.generate2StepRecoveryPassword(req.currentUser!)

    await req.currentUser!.save()

    res.status(200).send(req.currentUser)
  }

  getRefreshToken = async (req: Request, res: Response) => {
    const user = await authService.findUserByRefreshJwt(
      req.session!.jwt.refresh!
    )

    if (!user) {
      req.session = null
      throw new BadRequestError("Authentication credentials may have expired.")
    }

    if (!user?.account.isVerified) {
      throw new BadRequestError(`Please verify account sent to: ${user.email}`)
    }

    const tokenToSign: IJwtAuthToken = {
      userId: user._id.toHexString(),
      email: user.email,
    }
    user.tokens = await authService.getAuthTokens(tokenToSign, {
      isRefreshingToken: true,
      refreshTokenId: req.session?.jwt.refresh,
      accessToken: req.session?.jwt.access,
    })

    authService.generateAuthCookies(req, user.tokens)

    await user.save()

    res.status(200).send(user)
  }
}

export const authController = new AuthController()
