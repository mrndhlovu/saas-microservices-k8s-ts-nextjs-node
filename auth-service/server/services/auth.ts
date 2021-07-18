import { Request } from "express"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"
import bcrypt from "bcrypt"

import User, { IAccessTokens, IUserDocument } from "../models/User"
import {
  IJwtRefreshTokens,
  IJwtAuthTokenToSign,
  JWTSignKeyOption,
} from "../types"

class AuthService {
  private getSigningKey = (type?: JWTSignKeyOption) => {
    const { JWT_REFRESH_TOKEN_SIGNATURE, JWT_TOKEN_SIGNATURE } = process.env

    switch (type) {
      case "refresh":
        return JWT_REFRESH_TOKEN_SIGNATURE!

      default:
        return JWT_TOKEN_SIGNATURE!
    }
  }

  decodeJwtToken(token: string, type?: JWTSignKeyOption) {
    const decodedJWT = jwt.verify(token!, this.getSigningKey(type))

    return decodedJWT as IJwtAuthTokenToSign
  }

  generateStoreCookies = (req: Request, tokens: IAccessTokens) => {
    req.session = {
      jwt: tokens,
    }
  }

  private generateTokens = (userId: ObjectId, email: string) => {
    const accessTokenExpiresIn: string = "15m"
    const refreshTokenExpiresIn: string = "12h"

    const tokenToSign = { userId: userId.toString(), email }

    const accessToken = jwt.sign(tokenToSign, this.getSigningKey(), {
      expiresIn: accessTokenExpiresIn,
    })

    const refreshToken = jwt.sign(tokenToSign, this.getSigningKey("refresh"), {
      expiresIn: refreshTokenExpiresIn,
    })

    const tokens: IJwtRefreshTokens = {
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

  findUserByCredentials = async (email: string, password: string) => {
    const user = await this.findUserOnlyByEmail(email)

    let isMatch: boolean
    if (!user) throw new Error("Login error: check your email or password.")

    isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error("Login error: check your email or password.")

    return user
  }

  findUserOnlyByEmail = async (email: string) => {
    const user = await User.findOne({ email })
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
}

export default new AuthService()
