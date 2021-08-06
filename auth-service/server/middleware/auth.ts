import { Response, NextFunction, Request } from "express"
import { body, oneOf, check } from "express-validator"
import jwt from "jsonwebtoken"

import {
  BadRequestError,
  errorService,
  IJwtAccessTokens,
  IJwtAuthToken,
} from "@tusksui/shared"

import { authService } from "../services/auth"
import { IUserDocument } from "../models/User"

declare global {
  namespace Express {
    interface Request {
      currentUser: IUserDocument | null | undefined
      session:
        | {
            jwt: IJwtAccessTokens
          }
        | null
        | undefined
    }
  }
}

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
    oneOf([
      check("identifier").isEmail(),
      check("identifier")
        .not()
        .isEmpty()
        .isString()
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Username must be between 4 and 20 characters"),
    ]),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ]

  checkDuplicateEmail = async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    const existingUser = await authService.findUserOnlyByEmail(req.body.email)

    if (existingUser) {
      throw new BadRequestError(
        `Account linked to the email ${req.body.email} already exists.`
      )
    }

    next()
  }

  verifyCurrentUser = errorService.catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const currentUser = await authService.findUserByJwt(req.currentUserJwt)

      if (!currentUser) {
        next()
      }

      req.currentUser = currentUser

      next()
    }
  )

  findCurrentUser = errorService.catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const currentUser = await authService.findUserByJwt(req.currentUserJwt)

      if (!currentUser) {
        throw new BadRequestError(`Authentication failed`)
      }

      req.currentUser = currentUser

      next()
    }
  )

  generateAuthCookies = (req: Request, tokens: IJwtAccessTokens) => {
    return (req.session = {
      jwt: tokens,
    })
  }
}

export const authMiddleware = new AuthMiddleWare()
