import { Response, NextFunction, Request } from "express"
import { validationResult, body } from "express-validator"

import services from "../services"
import User from "../models/User"
import { IObjectAuthTokenToSign } from "types"
import {
  CustomRequestError,
  BadRequestError,
  NotAuthorisedError,
} from "./error"

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
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ]

  checkRequiredLoginFields = [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ]

  checkIsAuthenticated = catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      if (!req.session) {
        throw new NotAuthorisedError("Authorization credentials are missing.")
      }

      const decodedJWT = services.auth.decodeJwtToken(
        req.session.jwt.access
      ) as IObjectAuthTokenToSign

      const user = await User.findOne({
        _id: decodedJWT.userId,
        email: decodedJWT.email,
        "tokens.access": req.session.jwt.access,
      })

      if (!user) throw new BadRequestError("User not found.")

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
      if (!req.session || !req.session.jwt) {
        throw new BadRequestError("Authorization credentials are missing.")
      }

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
      throw new BadRequestError(
        `Account linked to the email [ ${req.body.email} ] already exists.`
      )
    }

    next()
  }

  validateRequiredRefreshJwt = catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const { refreshToken } = req.params || req.cookies

      if (!refreshToken) throw new BadRequestError("Refresh token is required.")

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
        throw new BadRequestError(
          "Authorization credentials are wrong or have expired."
        )

      req.token = refreshToken
      req.user = user

      next()
    }
  )
}

export default new AuthMiddleWare()
