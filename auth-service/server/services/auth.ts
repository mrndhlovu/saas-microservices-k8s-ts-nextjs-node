import { Request } from "express"
import isEmail from "validator/lib/isEmail"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import {
  BadRequestError,
  IJwtAuthToken,
  IJwtAccessTokens,
} from "@tusksui/shared"

import { IJwtTokensExpiryTimes } from "../types"
import { IUserDocument, User } from "../models/User"
import { mfaService } from "./mfa"

class AuthService {
  findUserByCredentials = async (identifier: string, password: string) => {
    const user = await (isEmail(identifier)
      ? this.findUserOnlyByEmail(identifier)
      : this.findUserOnlyByUsername(identifier))

    let isMatch: boolean
    if (!user)
      throw new BadRequestError("Login error: check your login credentials.")

    isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      throw new BadRequestError("Login error: check your login credentials.")

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

  verifyMfaToken = async <T extends string, Y extends IJwtAuthToken>(
    mfaToken: T,
    authJwt: Y
  ): Promise<{ isValid: boolean; user: IUserDocument }> => {
    const user = await this.findUserByJwt(authJwt)

    if (!user) throw new BadRequestError("User not found")

    const isValid = mfaService.validatedToken(mfaToken)

    return { isValid, user }
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

  generateAuthCookies = (req: Request, tokens: IJwtAccessTokens) => {
    req.session = null

    return (req.session = {
      jwt: tokens,
    })
  }

  encryptUserPassword = async (
    user: IUserDocument,
    password: string,
    salt: number,
    next: any
  ) => {
    const handleCallback = (err?: Error, hash?: string) => {
      if (err || !hash) throw new BadRequestError("Failed to encrypt password")
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

  getAuthTokens = async <
    T extends IJwtAuthToken,
    Y extends IJwtTokensExpiryTimes
  >(
    tokenToSign: T,
    options?: Y
  ) => {
    const { JWT_TOKEN_SIGNATURE, JWT_REFRESH_TOKEN_SIGNATURE } = process.env

    if (options?.isRefreshingToken) {
      var accessTokenExpiresIn: string = options?.accessExpiresAt || "3h"
      var refreshTokenExpiresIn: string = "1h"
    } else {
      var accessTokenExpiresIn: string = options?.accessExpiresAt || "2h"
      var refreshTokenExpiresIn: string = options?.refreshExpiresAt || "5h"
    }

    const accessToken = jwt.sign(tokenToSign, JWT_TOKEN_SIGNATURE!, {
      expiresIn: accessTokenExpiresIn,
    })

    const refreshToken = options?.isRefreshingToken
      ? undefined
      : jwt.sign(tokenToSign, JWT_REFRESH_TOKEN_SIGNATURE!, {
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
