import isEmail from "validator/lib/isEmail"
import bcrypt from "bcryptjs"
import { BadRequestError } from "@tusksui/shared"
import { allowedOrigins } from "../utils/constants"
import { CorsOptions } from "cors"
import { User } from "../models/User"

export class AuthService {
  static findUserByCredentials = async (
    identifier: string,
    password: string
  ) => {
    const user = await (isEmail(identifier.trim())
      ? AuthService.findUserOnlyByEmail(identifier.trim())
      : AuthService.findUserOnlyByUsername(identifier.trim()))

    let isMatch: boolean
    if (!user)
      throw new BadRequestError("Login error: check your login credentials.")

    isMatch = await bcrypt.compare(password.trim(), user.password)
    if (!isMatch)
      throw new BadRequestError("Login error: check your login credentials.")

    return user
  }

  static findUserOnlyByEmail = async (email: string) => {
    const user = await User.findOne({ email })
    return user
  }

  static findUserOnlyByUsername = async (username: string) => {
    const user = await User.findOne({ username })
    return user
  }

  static findUserOnlyById = async (userId: string) => {
    const user = await User.findById(userId)
    return user
  }

  static validatedUpdateFields(
    targetFields: string[],
    editableFields: string[]
  ) {
    return targetFields.every((field: string) => editableFields.includes(field))
  }

  static getCorsOptions(): CorsOptions {
    return {
      origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin!) !== -1) {
          callback(null, true)
        } else {
          callback(new Error("Not allowed by cors"))
        }
      },
      optionsSuccessStatus: 200,
    }
  }
}
