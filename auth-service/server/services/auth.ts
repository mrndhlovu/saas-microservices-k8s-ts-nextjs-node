import { ObjectId } from "mongodb"
import isEmail from "validator/lib/isEmail"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { authUtils } from "@tuskui/shared"

import { IJwtAccessTokens } from "../types"
import { IUserDocument, User } from "../models/User"

class AuthService {
  findUserByCredentials = async (identifier: string, password: string) => {
    const user = await (isEmail(identifier)
      ? this.findUserOnlyByEmail(identifier)
      : this.findUserOnlyByUsername(identifier))

    let isMatch: boolean
    if (!user) throw new Error("Login error: check your login credentials.")

    isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error("Login error: check your login credentials.")

    return user
  }

  findUserOnlyByEmail = async (email: string) => {
    const user = await User.findOne({ email })
    return user
  }

  findUserOnlyByUsername = async (username: string) => {
    const user = await User.findOne({ username })
    return user
  }

  validatedUpdateFields(targetFields: string[], editableFields: string[]) {
    return targetFields.every((field: string) => editableFields.includes(field))
  }

  encryptUserPassword = async (
    user: IUserDocument,
    password: string,
    salt: number,
    next: any
  ) => {
    const handleCallback = (err?: Error, hash?: string) => {
      if (err || !hash) throw new Error("Failed to encrypt password")
      if (hash) {
        user.password = hash
        next()
      }
    }

    bcrypt.genSalt(salt, function (err, salt) {
      if (err) return handleCallback(err)

      bcrypt.hash(password, salt, function (err, hash) {
        if (err) return handleCallback(err, hash)

        handleCallback(err, hash)
      })
    })
  }

  private generateTokens = (userId: ObjectId, email: string) => {
    const accessTokenExpiresIn: string = "15m"
    const refreshTokenExpiresIn: string = "12h"

    const tokenToSign = { userId: userId.toString(), email }

    const accessToken = jwt.sign(tokenToSign, authUtils.getSigningKey(), {
      expiresIn: accessTokenExpiresIn,
    })

    const refreshToken = jwt.sign(
      tokenToSign,
      authUtils.getSigningKey("refresh"),
      {
        expiresIn: refreshTokenExpiresIn,
      }
    )

    const tokens: IJwtAccessTokens = {
      access: accessToken,
      refresh: refreshToken,
    }

    return tokens
  }

  getAuthTokens = async (user: IUserDocument) => {
    user.tokens = this.generateTokens(user._id, user.email)

    await user.save()

    return user
  }
}

export const authService = new AuthService()
