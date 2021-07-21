import { Request, Response } from "express"

import {
  User,
  authService,
  IUserDocument,
  BadRequestError,
} from "@tuskui/shared"

import { editableUserFields } from "../utils/constants"

declare global {
  namespace Express {
    interface Request {
      user: IUserDocument
    }
  }
}

class AuthController {
  signUpUser = async (req: Request, res: Response) => {
    let user = new User({ ...req.body })
    user = await authService.getAuthTokens(user)

    authService.generateAuthCookies(req, user.tokens)

    res.status(201).send(user)
  }

  getUserInfo = async (req: Request, res: Response) => {
    res.status(200).send(req.user)
  }

  loginUser = async (req: Request, res: Response) => {
    const { identifier, password } = req.body

    const user = await authService.findUserByCredentials(identifier, password)

    await authService.getAuthTokens(user)

    authService.generateAuthCookies(req, user.tokens)

    res.send(user)
  }

  logoutUser = async (req: Request, res: Response) => {
    req.user.updateOne({ $set: { tokens: { access: "", refresh: "" } } })
    req.session = null

    await req.user.save()

    res.send({})
  }

  updateUser = async (req: Request, res: Response) => {
    const targetFields = Object.keys(req.body)

    const hasValidFields = authService.validatedUpdateFields(
      targetFields,
      editableUserFields
    )

    if (!hasValidFields) throw new BadRequestError("Field is not editable.")

    const updatedRecord = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { ...req.body } },
      { new: true }
    )

    if (!updatedRecord) throw new BadRequestError("Failed to updated record.")

    await updatedRecord.save()

    res.send(updatedRecord)
  }

  deleteUser = async (req: Request, res: Response) => {
    await req.user.delete()

    res.status(200).send({ message: "Account deleted", success: true })
  }

  getRefreshToken = async (req: Request, res: Response) => {
    const tokens = await authService.getAuthTokens(req.user)

    res.status(200).send(tokens)
  }
}

const authController = new AuthController()

export { authController }
