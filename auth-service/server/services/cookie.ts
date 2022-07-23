import jwt from "jsonwebtoken"
import {
  BadRequestError,
  IJwtAccessTokens,
  IJwtAuthToken,
} from "@tusksui/shared"
import { IAuthTokenOptions } from "../types"
import { IUserDocument, User } from "../models/User"
import { mfaService } from "./mfa"
import { Request } from "express"
import { AuthService } from "./auth"
import { Token } from "../models/Token"

export class CookieService {
  static generateCookies = (req: Request, tokens: IJwtAccessTokens) => {
    req.session = null

    return (req.session = {
      jwt: tokens,
    })
  }

  static generateAccessToken(
    tokenToSign: IJwtAuthToken,
    expiresIn: string,
    currentAccessToken?: string
  ) {
    const isValidToken =
      currentAccessToken &&
      CookieService.isTokenValid(
        currentAccessToken,
        process.env.JWT_TOKEN_SIGNATURE!
      )

    if (isValidToken) {
      return currentAccessToken!
    }

    const token = jwt.sign(tokenToSign, process.env.JWT_TOKEN_SIGNATURE!, {
      expiresIn,
    })

    return token
  }

  static async generateRefreshToken(
    jwtAccessToken: IJwtAuthToken,
    expiresIn: string,
    currentRefreshTokenId?: string
  ) {
    let existingToken =
      currentRefreshTokenId &&
      (await CookieService.findRefreshTokenOnlyById(currentRefreshTokenId!))

    if (existingToken && !existingToken.invalidated) {
      const tokenIsValid = CookieService.isTokenValid(
        existingToken.token,
        process.env.JWT_REFRESH_TOKEN_SIGNATURE!
      )

      // if (tokenIsValid) {
      //   existingToken.used = true
      //   existingToken.save()
      //   return existingToken._id
      // }
    }

    // if (existingToken && existingToken.used && !existingToken.invalidated) {
    //   existingToken.invalidated = true
    //   existingToken.save()
    //   throw new BadRequestError("Refresh Token has been used.")
    // }

    const token = jwt.sign(
      jwtAccessToken,
      process.env.JWT_REFRESH_TOKEN_SIGNATURE!,
      {
        expiresIn,
      }
    )

    const refreshToken = new Token({
      userId: jwtAccessToken.userId,
      token,
      tokenType: "refresh",
    })

    await refreshToken.save()

    return refreshToken?._id.toHexString()
  }

  static isTokenValid(token?: string, signature?: string) {
    try {
      if (!token) throw new BadRequestError("token is required")
      if (jwt.verify(token, signature!)) return true
    } catch (error) {
      return false
    }
  }

  static verifyMfaToken = async <T extends string, Y extends IJwtAuthToken>(
    mfaToken: T,
    authJwt: Y
  ): Promise<{ isValid: boolean; user: IUserDocument }> => {
    const user = await CookieService.findUserByJwt(authJwt)

    if (!user) throw new BadRequestError("User not found")

    const isValid = mfaService.validatedToken(mfaToken)

    return { isValid, user }
  }

  static async invalidateRefreshToken(user: IUserDocument) {
    const refreshToken = await Token.findOne({
      userId: user._id,
      invalidated: false,
      type: "refresh",
    })

    if (refreshToken) {
      refreshToken.invalidated = true
      refreshToken?.save()
    }
  }

  static getAuthTokens = async (
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

    const accessToken = CookieService.generateAccessToken(
      tokenToSign,
      accessTokenExpiresIn,
      options?.accessToken
    )

    const refreshToken = await CookieService.generateRefreshToken(
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

  static findUserByJwt = async (decodedJWT: IJwtAuthToken) => {
    const user = await User.findOne({
      email: decodedJWT.email,
      _id: decodedJWT.userId,
    })

    return user
  }

  static async findRefreshTokenOnlyById(refreshTokenId: string) {
    const token = await Token.findById(refreshTokenId, { type: "refresh" })
    return token
  }

  static findUserByRefreshJwt = async (tokenId: string) => {
    const token = await CookieService.findRefreshTokenOnlyById(tokenId)

    if (!token) {
      throw new BadRequestError("Token may have expired.")
    }
    const user = await AuthService.findUserOnlyById(token.userId)

    return user
  }
}
