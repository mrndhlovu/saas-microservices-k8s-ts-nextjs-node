import { Request, Response } from "express"

import {
  ACCOUNT_TYPE,
  BadRequestError,
  IJwtAuthToken,
  permissionManager,
} from "@tusksui/shared"

import { authMiddleware } from "../middleware/auth"
import { authService } from "../services/auth"
import { editableUserFields } from "../utils/constants"
import { natsService } from "../services/nats"
import { User } from "../models/User"
import {
  UserDeletedPublisher,
  UserCreatedPublisher,
} from "../events/publishers"

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
    authMiddleware.generateAuthCookies(req, user.tokens)

    await user.save()

    new UserCreatedPublisher(natsService.client).publish({
      id: user._id.toHexString(),
      username: user.username!,
      firstname: user.firstname!,
      lastname: user.lastname!,
    })

    res.status(201).send(user)
  }

  getCurrentUser = async (req: Request, res: Response) => {
    res.status(200).send(req.currentUser)
  }

  loginUser = async (req: Request, res: Response) => {
    const { identifier, password, accountId } = req.body

    const user = await authService.findUserByCredentials(identifier, password)

    const tokenToSign: IJwtAuthToken = {
      userId: user._id.toHexString(),
      email: user.email,
      accountId: user.account!.id,
    }

    user.tokens = await authService.getAuthTokens(tokenToSign)
    authMiddleware.generateAuthCookies(req, user.tokens)

    await user.save()

    authMiddleware.generateAuthCookies(req, user.tokens)

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
    const user = await authService.findUserByJwt(req.currentUserJwt)

    if (!user)
      throw new BadRequestError("Authentication credentials may have expired.")

    const tokenToSign: IJwtAuthToken = {
      userId: user._id.toHexString(),
      email: user.email,
      accountId: user.account!.id!,
    }
    user.tokens = await authService.getAuthTokens(tokenToSign)

    authMiddleware.generateAuthCookies(req, user.tokens)

    await user.save()

    res.status(200).send({})
  }
}

export const authController = new AuthController()
