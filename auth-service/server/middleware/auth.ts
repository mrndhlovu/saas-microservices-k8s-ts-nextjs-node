import { Response, NextFunction, Request } from "express"
import { body, oneOf, check } from "express-validator"

import {
  BadRequestError,
  errorService,
  IJwtAccessTokens,
  IJwtAuthToken,
} from "@tusksui/shared"

import { authService } from "../services/auth"
import { IUserDocument } from "../models/User"
import { mfaService } from "../services"
import { natsService } from "../services/nats"
import { SendEmailPublisher } from "../events/publishers/send-email"

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
    body("email").isEmail().withMessage("Email provided is not valid."),
    body("username")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Username must be between 4 and 20 characters"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must have more that 8 characters"),
  ]

  checkRequiredLoginFields = [
    oneOf(
      [
        check("identifier").isEmail(),
        check("identifier")
          .not()
          .isEmpty()
          .isString()
          .trim()
          .isLength({ min: 4, max: 20 })
          .withMessage("Username must be between 4 and 20 characters"),
      ],
      "Email or username with more than 4 characters is required."
    ),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage(
        "Invalid login credentials. Please check your username, email or password"
      ),
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
        return next()
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

  checkMultiFactorAuth = errorService.catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const currentUser = await authService.findUserByCredentials(
        req.body.identifier,
        req.body.password
      )

      if (!currentUser) {
        throw new BadRequestError(`Authentication failed`)
      }

      if (currentUser.multiFactorAuth) {
        const authToken = mfaService.generateToken()

        new SendEmailPublisher(natsService.client).publish({
          html: `Your six digit verification code is:
          <div>Code: <h3>${authToken}</h3></div>`,
          email: currentUser.email,
          subject: "Six digit verification code.",
          from: "kandhlovuie@gmail.com",
        })

        return res.send({ multiFactorAuth: true })
      }

      next()
    }
  )
}

export const authMiddleware = new AuthMiddleWare()
