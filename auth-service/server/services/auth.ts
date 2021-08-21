import { Request } from "express"
import isEmail from "validator/lib/isEmail"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import {
  BadRequestError,
  IJwtAuthToken,
  IJwtAccessTokens,
} from "@tusksui/shared"

import { IAuthTokenOptions } from "../types"
import { IUserDocument, User } from "../models/User"
import { mfaService } from "./mfa"
import { RefreshToken } from "../models/RefreshToken"

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

  findUserOnlyById = async (userId: string) => {
    const user = await User.findById(userId)
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

  findUserByRefreshJwt = async (tokenId: string) => {
    const token = await this.findRefreshTokenOnlyById(tokenId)

    if (!token) {
      throw new BadRequestError("Token may have expired.")
    }
    const user = await this.findUserOnlyById(token.userId)

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

  async findRefreshTokenOnlyById(refreshTokenId: string) {
    const token = await RefreshToken.findById(refreshTokenId)
    return token
  }

  async generateRefreshToken(
    tokenToSign: IJwtAuthToken,
    expiresIn: string,
    currentRefreshTokenId?: string
  ) {
    let existingToken =
      currentRefreshTokenId &&
      (await this.findRefreshTokenOnlyById(currentRefreshTokenId!))

    if (existingToken && !existingToken.used) {
      const tokenIsValid = this.isTokenValid(
        existingToken.token,
        process.env.JWT_REFRESH_TOKEN_SIGNATURE!
      )

      if (tokenIsValid) {
        existingToken.used = true
        existingToken.save()
        return existingToken._id
      }
    }

    if (existingToken && existingToken.used && !existingToken.invalidated) {
      existingToken.invalidated = true
      existingToken.save()
      throw new BadRequestError("Refresh Token has been used.")
    }

    const token = jwt.sign(
      tokenToSign,
      process.env.JWT_REFRESH_TOKEN_SIGNATURE!,
      {
        expiresIn,
      }
    )

    const refreshToken = new RefreshToken({
      userId: tokenToSign.userId,
      token,
    })

    await refreshToken.save()

    return refreshToken?._id.toHexString()
  }

  isTokenValid(token?: string, signature?: string) {
    try {
      if (!token) throw new Error()
      if (jwt.verify(token, signature!)) return true
    } catch (error) {
      return false
    }
  }

  generateAccessToken(
    tokenToSign: IJwtAuthToken,
    expiresIn: string,
    currentAccessToken?: string
  ) {
    const isValidToken =
      currentAccessToken &&
      this.isTokenValid(currentAccessToken, process.env.JWT_TOKEN_SIGNATURE!)

    if (isValidToken) {
      return currentAccessToken!
    }

    const token = jwt.sign(tokenToSign, process.env.JWT_TOKEN_SIGNATURE!, {
      expiresIn,
    })

    return token
  }

  getAuthTokens = async (
    tokenToSign: IJwtAuthToken,
    options?: IAuthTokenOptions
  ) => {
    let accessTokenExpiresIn: string
    let refreshTokenExpiresIn: string

    if (options?.isRefreshingToken) {
      accessTokenExpiresIn = options?.accessExpiresAt || "2d"
      refreshTokenExpiresIn = options?.accessExpiresAt || "7d"
    } else {
      accessTokenExpiresIn = options?.accessExpiresAt || "10h"
      refreshTokenExpiresIn = options?.refreshExpiresAt || "1d"
    }

    const accessToken = this.generateAccessToken(
      tokenToSign,
      accessTokenExpiresIn,
      options?.accessToken
    )

    const refreshToken = await this.generateRefreshToken(
      tokenToSign,
      refreshTokenExpiresIn,
      options?.refreshTokenId
    )

    const tokens: IJwtAccessTokens = {
      access: accessToken,
      refresh: refreshToken,
    }

    return tokens
  }
}

export const authService = new AuthService()
