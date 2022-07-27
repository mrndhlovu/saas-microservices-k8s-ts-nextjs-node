import isEmail from "validator/lib/isEmail"
import bcrypt from "bcryptjs"
import { BadRequestError } from "@tusksui/shared"
import { allowedOrigins } from "../utils/constants"
import { CorsOptions } from "cors"
import { User } from "../models/User"
import { Token } from "../models/Token"
import { PasswordManager } from "./password"
import { totp } from "otplib"
import { TokenType } from "../types"

export class AuthService {
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

    isMatch = await bcrypt.compare(password.trim(), user.password!)
    if (!isMatch)
      throw new BadRequestError("Login error: check your login credentials.")

    return user
  }

  static getCorsOptions(): CorsOptions {
    return {
      origin: (origin, callback) => {
        console.log({ origin })

        if (allowedOrigins.indexOf(origin!) !== -1) {
          callback(null, true)
        } else {
          callback(null, true)

          // callback(new Error("Not allowed by cors"))
        }
      },
      optionsSuccessStatus: 200,
    }
  }

  static async generateOtp(userId: string) {
    const generatedNumber = totp.generate(process.env.JWT_TOKEN_SIGNATURE!)
    const expiresAt = PasswordManager.addMinutesToDate(new Date(), 5)

    const hashedOtp = await PasswordManager.encrypt(generatedNumber)
    const token = new Token({
      tokenType: "otp",
      token: hashedOtp,
      expiresAt,
      userId,
    })

    await token.save()
    return generatedNumber
  }

  static async getTokenByUserId(userId: string, tokenType: TokenType) {
    const token = await Token.findOne({ userId, tokenType, valid: true })

    return token
  }

  static async verifyOtp(submittedNumber: string, userId: string) {
    const storedOtpToken = await Token.findOne({
      userId,
      tokenType: "otp",
      valid: true,
    })

    if (!storedOtpToken)
      throw new BadRequestError("Pass code did not match or may have expired")

    const tokenExpired = new Date() > new Date(storedOtpToken?.expiresAt!)

    if (tokenExpired) {
      storedOtpToken.valid = false
      await storedOtpToken.save()
      throw new BadRequestError("Pass code has expired")
    }

    const codesMatch = PasswordManager.compare(
      storedOtpToken.token,
      submittedNumber
    )

    if (!codesMatch) throw new BadRequestError("Pass code did not match")

    storedOtpToken.valid = true
    await storedOtpToken.save()

    return codesMatch
  }
}
