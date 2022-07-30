import jwt from "jsonwebtoken"
import {
  BadRequestError,
  IJwtAccessTokens,
  IJwtAuthToken,
  NotAuthorisedError,
} from "@tusksui/shared"
import {
  IAuthTokenOptions,
  IGenerateTokenOptions,
  IGenerateCookieOptions,
  SignatureOptions,
} from "../types"
import { User } from "../models/User"
import { Request } from "express"

export class TokenService {
  private static SIGNATURES: SignatureOptions = {
    access: process.env.JWT_ACCESS_TOKEN_SIGNATURE!,
    refresh: process.env.JWT_REFRESH_TOKEN_SIGNATURE!,
    otp: process.env.JWT_OTP_TOKEN_SIGNATURE!,
  }

  static generateCookies = (
    req: Request,
    { tokens, httpOnly }: IGenerateCookieOptions
  ) => {
    req.session = null

    return (req.session = {
      jwt: tokens,
      httpOnly,
    })
  }

  static getVerifiedJwtValue(
    token: string,
    signatureKey: keyof SignatureOptions
  ) {
    try {
      const currentUserJwt = jwt.verify(
        token,
        TokenService.SIGNATURES[signatureKey]
      ) as IJwtAuthToken

      return currentUserJwt
    } catch (error) {
      throw new NotAuthorisedError("SESSION EXPIRED")
    }
  }

  static validateToken(signatureKey: keyof SignatureOptions, token: string) {
    try {
      if (!token) throw new BadRequestError("ACCESS TOKEN IS REQUIRED")
      if (jwt.verify(token, TokenService.SIGNATURES[signatureKey])) return true
    } catch (error) {
      return false
    }
  }

  static generateToken = async (
    data: IJwtAuthToken,
    options: IGenerateTokenOptions
  ) => {
    const token = jwt.sign(data, TokenService.SIGNATURES[options.type]!, {
      expiresIn: options?.expiresIn,
    })

    return token as keyof Pick<IJwtAccessTokens, "access" | "refresh" | "mfa">
  }

  static getAuthTokens = async (
    tokenToSign: IJwtAuthToken,
    options?: IAuthTokenOptions
  ): Promise<{ access: string; refresh: string }> => {
    const accessToken = await TokenService.generateToken(tokenToSign, {
      expiresIn: options?.accessExpiresAt || "2d",
      type: "access",
    })
    const refreshToken = await TokenService.generateToken(tokenToSign, {
      expiresIn: options?.refreshExpiresAt || "7d",
      type: "refresh",
    })

    return {
      access: accessToken,
      refresh: refreshToken,
    }
  }

  static findUserByJwt = async (decodedJWT: IJwtAuthToken) => {
    const user = await User.findOne({
      email: decodedJWT.email,
      _id: decodedJWT.userId,
    })

    return user
  }
}
