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

  findCurrentUser = errorService.catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const currentUser = await authService.findUserByJwt(req.currentUserJwt)

      if (!currentUser) {
        throw new BadRequestError(`Authentication failed`)
      }

      if (!currentUser.account.isVerified) {
        throw new BadRequestError(
          `Please verify account sent to: ${currentUser.email}`
        )
      }

      req.currentUser = currentUser

      next()
    }
  )

  findPendingMfaUser = errorService.catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const { isValid, user } = await authService.verifyMfaToken(
        req.body?.code,
        req.currentUserJwt
      )

      if (!isValid) {
        throw new BadRequestError(`Token validation failed`)
      }

      if (!user.account.isVerified) {
        throw new BadRequestError(
          `Please verify account sent to: ${user.email}`
        )
      }

      req.currentUser = user

      next()
    }
  )

  checkMultiFactorAuth = errorService.catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const existingUser = await authService.findUserByCredentials(
        req.body.identifier,
        req.body.password
      )

      if (!existingUser) {
        throw new BadRequestError(`Authentication failed`)
      }

      if (existingUser.multiFactorAuth) {
        const tokenToSign: IJwtAuthToken = {
          userId: existingUser._id.toHexString(),
          email: existingUser.email,
          mfa: {
            enabled: existingUser.multiFactorAuth,
            validated: false,
          },
        }

        existingUser.tokens = {
          ...(await authService.getAuthTokens(tokenToSign, {
            accessExpiresAt: "3m",
            refreshExpiresAt: "3m",
          })),
        }

        authService.generateAuthCookies(req, existingUser.tokens)

        await existingUser.save()

        // new SendEmailPublisher(natsService.client).publish({
        //   html: `Your six digit verification code is:<div>Code: <h3>${authToken}</h3></div>`,
        //   email: updatedUser.email,
        //   subject: "Six digit verification code.",
        //   from: "kandhlovuie@gmail.com",
        // })

        return res.send({ multiFactorAuth: true })
      }

      next()
    }
  )
}

export const authMiddleware = new AuthMiddleWare()
