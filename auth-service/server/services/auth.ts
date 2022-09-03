import isEmail from "validator/lib/isEmail"
import bcrypt from "bcryptjs"
import {
  BadRequestError,
  IPermissionType,
  NotFoundError,
  permissionManager,
} from "@tusksui/shared"
import { allowedOrigins } from "../utils/constants"
import { CorsOptions } from "cors"
import { User, IUserDocument } from "../models/User"
import { totp } from "otplib"
import { TokenService } from "./token"
import { PasswordManager } from "./password"
import { getSignatureKey } from "../helpers"
import { IBoardMember } from "../types"

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

  static async generateOtp() {
    const generatedNumber = totp.generate(
      process.env.JWT_ACCESS_TOKEN_SIGNATURE!
    )

    const hashedOtp = await PasswordManager.encrypt(generatedNumber)
    return [generatedNumber, hashedOtp]
  }

  static async verifyOtp(
    submittedNumber: string,
    accessToken: string,
    email: string,
    path: string
  ) {
    const user = await AuthService.findUserOnlyByEmail(email)

    if (!user) throw new NotFoundError("User not found")

    const savedAccessTokenCode = user?.authTokens!.find(
      token => token.indexOf(accessToken) > -1
    ) as string

    if (!savedAccessTokenCode) {
      throw new NotFoundError("Credentials not found")
    }
    const [otpHash, token] = savedAccessTokenCode?.split(":")
    const signatureKey = getSignatureKey(path)

    const isValidToken = TokenService.validateToken(signatureKey, token)

    if (!isValidToken) {
      throw new BadRequestError("Access token expired")
    }

    const isValidCode = await PasswordManager.compare(otpHash, submittedNumber)

    if (!isValidToken) {
      throw new BadRequestError("Pass code did not match or may have expired")
    }

    return isValidCode && isValidToken
  }

  static addUserToken(user: IUserDocument, token: string) {
    user.authTokens?.push(token)
  }

  static removeUserToken(user: IUserDocument, token: string) {
    const tokens = user?.authTokens!.filter(
      tokenString => tokenString.indexOf(token) === -1
    )

    user.authTokens = tokens
  }

  static async getBoardMembers(
    memberIds: string[],
    boardId: string
  ): Promise<IBoardMember[]> {
    const ids = memberIds?.map(memberId => memberId?.split(":")?.[0])

    const members: IUserDocument[] = await User.find({
      _id: { $in: ids },
      boardIds: { $in: [boardId] },
    })

    const getRole = (id: string) => {
      const [, permissionFlag] = id?.split(":")
      const role = Object.keys(permissionManager.permissions).find(
        key =>
          permissionManager.permissions[key as IPermissionType] ===
          +permissionFlag
      )

      return role
    }

    const data = members!.map(member => ({
      id: member.id,
      username: member.username,
      firstName: member.firstName,
      lastName: member.lastName,
      profileImage: member?.avatar,
      initials: member?.initials,
      role: getRole(memberIds.find(id => id.indexOf(member.id) > -1)!),
    }))

    return data
  }
}
