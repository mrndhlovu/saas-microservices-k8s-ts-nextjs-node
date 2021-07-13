import { Request, Response } from "express"

import { editableUserFields } from "../utils/constants"
import { IRequestExtended } from "../types"
import { Services } from "../services"
import User from "../models/User"

class AuthController {
  signUpUser = async (req: Request, res: Response) => {
    let user = new User({ ...req.body })
    user = await Services.auth.getAuthTokens(user)

    await Services.auth.generateRequestCookies(res, user.tokens)

    res.status(201).send(user)
  }

  getUserInfo = async (req: Request, res: Response) => {
    const _req = req as IRequestExtended

    if (!_req.user) throw new Error("User not found")

    res.status(200).send(_req.user.populate("refreshToken"))
  }

  loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await Services.auth.findUserByCredentials(email, password)
    await Services.auth.generateRequestCookies(res, user.tokens)

    await Services.auth.getAuthTokens(user)
    res.send(user)
  }

  logoutUser = async (req: Request, res: Response) => {
    const _req = req as IRequestExtended

    _req.user.updateOne({ $set: { tokens: { access: "", refresh: "" } } })

    await _req.user.save()

    res.send({ success: true, message: "Logout successfully" })
  }

  updateUser = async (req: Request, res: Response) => {
    const _req = req as IRequestExtended

    const targetFields = Object.keys(_req.body)

    const hasValidFields = Services.auth.validatedUpdateFields(
      targetFields,
      editableUserFields
    )

    if (!hasValidFields) throw new Error("Field is not editable.")

    _req.user.updateOne({ $set: { ...req.body } })

    await _req.user.save()

    res.send(_req.user)
  }

  deleteUser = async (req: Request, res: Response) => {
    const _req = req as IRequestExtended

    const user = await User.findById(_req.user._id)

    if (!user) throw new Error("User not found")

    await user.delete()

    res.status(200).send({ message: "Account deleted", success: true })
  }

  getRefreshToken = async (req: Request, res: Response) => {
    const _req = req as IRequestExtended

    const tokens = await Services.auth.getAuthTokens(_req.user)

    res.status(200).send(tokens)
  }
}

export default new AuthController()
