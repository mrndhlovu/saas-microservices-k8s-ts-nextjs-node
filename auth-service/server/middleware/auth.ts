import { Response, NextFunction, Request } from "express"
import { validationResult, body } from "express-validator"

import services from "../services"
import User from "../models/User"
import { IObjectAuthTokenToSign } from "types"
import { CustomRequestError, RequestQueryError } from "./error"

const { catchAsyncError } = services.error
class AuthMiddleWare {
  checkRequiredSignUpFields = [
    body("email").isEmail().withMessage("Email must be valid"),
    body("username")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Username must be between 4 and 20 characters"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ]

  checkIsAuthenticated = catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const decodedJWT = services.auth.decodeJwtToken(
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

  handleValidationResults = catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        throw new CustomRequestError(errors.array())
      }

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

  checkDuplicateEmail = async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    const existingUser = await services.auth.findUserOnlyByEmail(req.body.email)

    if (existingUser) {
      throw new RequestQueryError(
        `Account linked to the email [ ${req.body.email} ] already exists.`
      )
    }

    next()
  }

  validateRequiredRefreshJwt = catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const { refreshToken } = req.params || req.cookies

      if (!refreshToken) throw new Error("Refresh token is required.")

      const decodedJWT = services.auth.decodeJwtToken(
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
