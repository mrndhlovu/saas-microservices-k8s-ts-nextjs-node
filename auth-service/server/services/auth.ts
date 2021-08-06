import isEmail from "validator/lib/isEmail"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { IJwtAuthToken } from "@tusksui/shared"

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

  findUserByJwt = async (decodedJWT: IJwtAuthToken) => {
    const user = await User.findOne({
      email: decodedJWT.email,
      _id: decodedJWT.userId,
    })

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

  getAuthTokens = async (tokenToSign: IJwtAuthToken) => {
    const { JWT_TOKEN_SIGNATURE, JWT_REFRESH_TOKEN_SIGNATURE } = process.env

    const accessTokenExpiresIn: string = "1h"
    const refreshTokenExpiresIn: string = "1h"

    const accessToken = jwt.sign(tokenToSign, JWT_TOKEN_SIGNATURE!, {
      expiresIn: accessTokenExpiresIn,
    })

    const refreshToken = jwt.sign(tokenToSign, JWT_REFRESH_TOKEN_SIGNATURE!, {
      expiresIn: refreshTokenExpiresIn,
    })

    const tokens: IJwtAccessTokens = {
      access: accessToken,
      refresh: refreshToken,
    }

    return tokens
  }
}

export const authService = new AuthService()
