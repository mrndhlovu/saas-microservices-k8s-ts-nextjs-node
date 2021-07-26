import { Request, Response } from "express"

import {
  ACCOUNT_TYPE,
  authUtils,
  BadRequestError,
  IJwtAuthToken,
  permissionManager,
} from "@tuskui/shared"

import { editableUserFields } from "../utils/constants"
import { authService } from "../services/auth"
import { IUserDocument, User } from "../models/User"
import { UserDeletedPublisher } from "../events/publishers"
import { natsService } from "../services/nats"

declare global {
  namespace Express {
    interface Request {
      currentUser?: IUserDocument
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

    const tokenToSign = { userId: user._id.toHexString(), email: user.email }

    user.tokens = await authService.getAuthTokens(tokenToSign)
    authUtils.generateAuthCookies(req, user.tokens)

    await user.save()

    res.status(201).send(user)
  }

  getUserInfo = async (req: Request, res: Response) => {
    if (!req.session || !req.session.jwt) {
      return res.status(200).send()
    }

    const userJwt = authUtils.decodeJwtToken(
      req.session!.jwt.access
    ) as IJwtAuthToken

    const currentUser = await authService.findUserByJwt(userJwt)

    if (!currentUser) {
      return res.status(200).send(null)
    }

    res.status(200).send(currentUser)
  }

  loginUser = async (req: Request, res: Response) => {
    const { identifier, password } = req.body

    const user = await authService.findUserByCredentials(identifier, password)
    const tokenToSign = { userId: user._id.toHexString(), email: user.email }

    user.tokens = await authService.getAuthTokens(tokenToSign)
    authUtils.generateAuthCookies(req, user.tokens)

    await user.save()

    authUtils.generateAuthCookies(req, user.tokens)

    res.status(200).send(user)
  }

  logoutUser = async (req: Request, res: Response) => {
    req.currentUser!.updateOne({
      $set: { tokens: { access: "", refresh: "" } },
    })

    await req.currentUser!.save()

    req.session = null
    res.send({})
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
    const user = req.currentUser!

    const userId = user._id.toHexString()
    const boardIds = user.boardIds

    await user.delete()

    new UserDeletedPublisher(natsService.client).publish({
      id: userId,
      boardIds,
    })

    res.status(200).send({})
  }

  getRefreshToken = async (req: Request, res: Response) => {
    const user = await authService.findUserByJwt(req.user)

    if (!user)
      throw new BadRequestError("Authentication credentials may have expired.")

    const tokenToSign = { userId: user._id.toHexString(), email: user.email }

    user.tokens = await authService.getAuthTokens(tokenToSign)
    authUtils.generateAuthCookies(req, user.tokens)

    await user.save()

    res.status(200).send({})
  }
}

export const authController = new AuthController()
