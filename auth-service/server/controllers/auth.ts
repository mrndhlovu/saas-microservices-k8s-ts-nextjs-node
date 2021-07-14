import { Request, Response } from "express"

import { editableUserFields } from "../utils/constants"
import { Services } from "../services"
import User from "../models/User"

class AuthController extends Services {
  constructor() {
    super()
  }

  signUpUser = async (req: Request, res: Response) => {
    let user = new User({ ...req.body })
    user = await this.auth.getAuthTokens(user)

    await this.auth.generateRequestCookies(res, user.tokens)

    res.status(201).send(user)
  }

  getUserInfo = async (req: Request, res: Response) => {
    if (!req.user) throw new Error("User not found")

    res.status(200).send(req.user.populate("refreshToken"))
  }

  loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await this.auth.findUserByCredentials(email, password)
    await this.auth.generateRequestCookies(res, user.tokens)

    await this.auth.getAuthTokens(user)
    res.send(user)
  }

  logoutUser = async (req: Request, res: Response) => {
    req.user.updateOne({ $set: { tokens: { access: "", refresh: "" } } })

    await req.user.save()

    res.send({ success: true, message: "Logout successfully" })
  }

  updateUser = async (req: Request, res: Response) => {
    const targetFields = Object.keys(req.body)

    const hasValidFields = this.auth.validatedUpdateFields(
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
    const tokens = await this.auth.getAuthTokens(req.user)

    res.status(200).send(tokens)
  }
}

export default new AuthController()
