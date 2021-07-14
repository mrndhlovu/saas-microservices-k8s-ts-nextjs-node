import { Response } from "express"
import jwt, { VerifyErrors } from "jsonwebtoken"
import { ObjectId } from "mongodb"
import bcrypt from "bcrypt"

import User, { IAccessTokens, IUserDocument } from "../models/User"
import { IJwtToken, JWTSignKeyOption } from "../types"

class AuthService {
  private getSigningKey = (type?: JWTSignKeyOption) => {
    const { REFRESH_TOKEN_SIGNATURE, TOKEN_SIGNATURE } = process.env

    switch (type) {
      case "refresh":
        return REFRESH_TOKEN_SIGNATURE!

      default:
        return TOKEN_SIGNATURE!
    }
  }

  private decodedJwtCallback = (err: VerifyErrors, payload: IJwtToken) => {
    if (err) throw new Error("Access token failed validation.")

    return payload
  }

  decodeJwtToken(token: string, type?: JWTSignKeyOption) {
    const decodedJWT = <any>(
      jwt.verify(
        token,
        this.getSigningKey(type),
        this.decodedJwtCallback as any
      )
    )

    return decodedJWT as any
  }

  generateRequestCookies = async (res: Response, tokens: IAccessTokens) => {
    const options = {
      maxAge: 15,
      httpOnly: false,
    }

    const cookieString = `access_token:${tokens.access}|refresh_token:${tokens.refresh}`

    res.cookie("token", cookieString, options)
  }

  generateTokens = (userId: ObjectId) => {
    const accessTokenExpiresIn: string = "15m"
    const refreshTokenExpiresIn: string = "12h"

    const accessToken = jwt.sign(
      { _id: userId.toString() },
      this.getSigningKey(),
      {
        expiresIn: accessTokenExpiresIn,
      }
    )

    const tokenToSign = <IJwtToken>{ _id: userId.toString() }

    const refreshToken = jwt.sign(tokenToSign, this.getSigningKey("refresh"), {
      expiresIn: refreshTokenExpiresIn,
    })

    return { access: accessToken, refresh: refreshToken }
  }

  getAuthTokens = async (user: IUserDocument) => {
    user.tokens = this.generateTokens(user._id)

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
