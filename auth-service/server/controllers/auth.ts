import { Request, Response } from "express"

import { BadRequestError } from "../middleware/error"
import { editableUserFields } from "../utils/constants"
import services from "../services"
import User from "../models/User"

class AuthController {
  signUpUser = async (req: Request, res: Response) => {
    let user = new User({ ...req.body })
    user = await services.auth.getAuthTokens(user)

    services.auth.generateStoreCookies(req, user.tokens)

    res.status(201).send(user)
  }

  getUserInfo = async (req: Request, res: Response) => {
    res.status(200).send(req.user)
  }

  loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await services.auth.findUserByCredentials(email, password)

    await services.auth.getAuthTokens(user)

    services.auth.generateStoreCookies(req, user.tokens)

    res.send(user)
  }

  logoutUser = async (req: Request, res: Response) => {
    req.user.updateOne({ $set: { tokens: { access: "", refresh: "" } } })

    await req.user.save()

    res.send({ success: true, message: "Logout successfully" })
  }

  updateUser = async (req: Request, res: Response) => {
    const targetFields = Object.keys(req.body)

    const hasValidFields = services.auth.validatedUpdateFields(
      targetFields,
      editableUserFields
    )

    if (!hasValidFields) throw new Error("Field is not editable.")

    req.user.updateOne({ $set: { ...req.body } })

    await req.user.save()

    res.send(req.user)
  }

  deleteUser = async (req: Request, res: Response) => {
    await req.user.delete()

    res.status(200).send({ message: "Account deleted", success: true })
  }

  getRefreshToken = async (req: Request, res: Response) => {
    const tokens = await services.auth.getAuthTokens(req.user)

    res.status(200).send(tokens)
  }
}

export default new AuthController()
