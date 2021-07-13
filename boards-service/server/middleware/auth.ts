import { Response, NextFunction, Request } from "express"

import { IRequestExtended } from "../types"
import { Services } from "../services"
import User from "../models/User"

const { catchAsyncError } = Services.error

class AuthMiddleWare {
  checkIsAuthenticated = catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const _req = req as IRequestExtended

      const decodedJWT = Services.auth.decodeJwtToken(_req.token)

      const user = await User.findOne({
        _id: decodedJWT._id,
        "tokens.access": _req.token,
      })

      if (!user) throw new Error("User not found.")

      _req.user = user

      next()
    }
  )

  validateRequiredAccessJwt = catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const _req = req as IRequestExtended
      const { authorization } = req.headers

      if (!authorization) {
        throw new Error("Authorization credentials are missing.")
      }

      const [bearer, accessToken] = authorization!.split(" ")
      if (bearer !== "Bearer" || !accessToken) {
        throw new Error("Authorization credentials are missing.")
      }
      _req.token = accessToken
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
      const _req = req as IRequestExtended

      const { refreshToken } = req.params || _req.cookies

      if (!refreshToken) throw new Error("Refresh token is required.")

      const decodedJWT = Services.auth.decodeJwtToken(refreshToken, "refresh")

      const user = await User.findOne({
        _id: decodedJWT._id,
        "tokens.refresh": refreshToken,
      })

      if (!user)
        throw new Error("Authorization credentials are wrong or have expired.")

      _req.token = refreshToken
      _req.user = user

      next()
    }
  )
}

export default new AuthMiddleWare()
