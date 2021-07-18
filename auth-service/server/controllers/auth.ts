import { Request, Response } from "express"

import { editableUserFields } from "../utils/constants"
import services from "../services"
import User from "../models/User"

class AuthController {
  signUpUser = async (req: Request, res: Response) => {
    let user = new User({ ...req.body })
    user = await services.auth.getAuthTokens(user)

    await services.auth.generateRequestCookies(res, user.tokens)

    res.status(201).send(user)
  }

  getUserInfo = async (req: Request, res: Response) => {
    // if (!req.user) throw new Error("User not found")

    res.status(200).send("hello")
  }

  loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await services.auth.findUserByCredentials(email, password)
    await services.auth.generateRequestCookies(res, user.tokens)

    await services.auth.getAuthTokens(user)
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
    const user = await User.findById(req.user._id)

    if (!user) throw new Error("User not found")

    await user.delete()

    res.status(200).send({ message: "Account deleted", success: true })
  }

  getRefreshToken = async (req: Request, res: Response) => {
    const tokens = await services.auth.getAuthTokens(req.user)

    res.status(200).send(tokens)
  }
}

export default new AuthController()
