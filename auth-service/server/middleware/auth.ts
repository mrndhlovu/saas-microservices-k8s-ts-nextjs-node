import { Response, NextFunction, Request } from "express"

import Services from "../services"
import User from "../models/User"
import { IObjectAuthTokenToSign } from "types"

const { catchAsyncError } = Services.error

class AuthMiddleWare {
  checkIsAuthenticated = catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const decodedJWT = Services.auth.decodeJwtToken(
        req.token!
      ) as IObjectAuthTokenToSign

      const user = await User.findOne({
        _id: decodedJWT.userId,
        email: decodedJWT.email,
        "tokens.access": req.token,
      })

      if (!user) throw new Error("User not found.")

      req.user = user

      next()
    }
  )

  validateRequiredAccessJwt = catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const { authorization } = req.headers

      if (!authorization) {
        throw new Error("Authorization credentials are missing.")
      }

      const [bearer, accessToken] = authorization!.split(" ")
      if (bearer !== "Bearer" || !accessToken) {
        throw new Error("Authorization credentials are missing.")
      }
      req.token = accessToken
      next()
    }
  )

  checkSignUpType = catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const { authorization } = req.headers

      if (!authorization) {
        throw new Error("Authorization credentials are missing.")
      }

      const [bearer, accessToken] = authorization!.split(" ")
      if (bearer !== "Bearer" || !accessToken) {
        throw new Error("Authorization credentials are missing.")
      }
      req.token = accessToken
      next()
    }
  )

  checkDuplicateEmail = catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const existingUser = await Services.auth.findUserOnlyByEmail(
        req.body.email
      )

      if (existingUser) {
        throw new Error(
          `Account linked to the email [ ${req.body.email} ] already exists.`
        )
      }

      next()
    }
  )

  validateRequiredRefreshJwt = catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const { refreshToken } = req.params || req.cookies

      if (!refreshToken) throw new Error("Refresh token is required.")

      const decodedJWT = Services.auth.decodeJwtToken(
        refreshToken,
        "refresh"
      ) as IObjectAuthTokenToSign

      const user = await User.findOne({
        _id: decodedJWT.userId,
        email: decodedJWT.email,
        "tokens.refresh": refreshToken,
      })

      if (!user)
        throw new Error("Authorization credentials are wrong or have expired.")

      req.token = refreshToken
      req.user = user

      next()
    }
  )
}

export default new AuthMiddleWare()
