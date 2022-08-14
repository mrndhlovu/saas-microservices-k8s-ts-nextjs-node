import { Response, NextFunction, Request } from "express"
import { body, oneOf, check } from "express-validator"
import {
  BadRequestError,
  errorService,
  IJwtAccessTokens,
  IJwtAuthToken,
  NotAuthorisedError,
} from "@tusksui/shared"
import { AuthService } from "../services/auth"
import { IUserDocument } from "../models/User"
import { allowedOrigins } from "../utils/constants"
import { TokenService, PasswordManager } from "../services"
import isEmail from "validator/lib/isEmail"
import jwt from "jsonwebtoken"
import { getSignatureKey } from "../helpers"

declare global {
  namespace Express {
    interface Request {
      currentUser?: IUserDocument
      bearerToken?: string
      session?: {
        jwt: IJwtAccessTokens
        httpOnly?: boolean
        domain?: string
        sameSite?: boolean
        signed?: boolean
      } | null
    }
  }
}

export class AuthMiddleWare {
  static checkRequiredSignUpFields = [
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

  static checkRequiredLoginFields = [
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

  static checkDuplicateEmail = async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    const existingUser = await AuthService.findUserOnlyByEmail(req.body.email)

    if (existingUser) {
      throw new BadRequestError(
        `Account linked to the email ${req.body.email} already exists.`
      )
    }

    next()
  }

  static checkIsAuthenticated = errorService.catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const authorization = req?.get("authorization")!?.replace("Bearer ", "")
      const authorizationToken =
        authorization !== "" ? authorization : undefined

      const jwtSignatureKey = getSignatureKey(req.path)

      if (req?.currentUserJwt?.userId) {
        next()
      }

      const sessionJwtToken =
        authorizationToken?.trim() || req?.session!.jwt?.access

      if (!sessionJwtToken) {
        req.session = null
        throw new NotAuthorisedError("Authorization credentials are missing.")
      }

      const currentUserJwt = TokenService.getVerifiedJwtValue(
        sessionJwtToken,
        jwtSignatureKey
      )

      req.currentUserJwt = currentUserJwt

      if (authorizationToken) {
        req.session!.jwt = { access: authorizationToken }
      }

      next()
    }
  )

  static findCurrentUser = errorService.catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const currentUser = await AuthService.findUserOnlyByEmail(
        req?.currentUserJwt?.email
      )

      const isVerifyEmailPath = req.path === "/verify-otp"

      if (!currentUser) {
        throw new BadRequestError(`Authentication failed`)
      }

      if (!currentUser.isVerified && !isVerifyEmailPath) {
        throw new BadRequestError(
          `Please verify account via an email sent to: ${currentUser.email}`
        )
      }

      req.currentUser = currentUser

      next()
    }
  )

  static findPendingMfaUser = errorService.catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      next()
    }
  )

  static findRequiredRefreshJwt = errorService.catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      if (!req.session || !req.session.jwt?.refresh) {
        throw new NotAuthorisedError("Authorization credentials are missing.")
      }

      try {
        const currentUserJwt = jwt.verify(
          req.session.jwt.refresh,
          process.env.JWT_ACCESS_TOKEN_SIGNATURE!
        )

        req.currentUserJwt = currentUserJwt as IJwtAuthToken
      } catch (error) {
        throw new NotAuthorisedError("Session expired.")
      }
      next()
    }
  )

  static validateParamAuthToken = errorService.catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const token = req.params.token
      let path

      if (!token) {
        throw new NotAuthorisedError("Authorization credentials are missing.")
      }

      if (req.path.indexOf("/pause-account") > -1) {
        path = "/pause-account"
      }

      const jwtSignatureKey = getSignatureKey(path || req.path)
      const currentUserJwt = TokenService.getVerifiedJwtValue(
        token,
        jwtSignatureKey
      )

      req.currentUserJwt = currentUserJwt as IJwtAuthToken

      next()
    }
  )

  // static async check2FactorAuth(
  //   req: Request,
  //   res: Response,
  //   existingUser: IUserDocument
  // ) {
  //   const tokenToSign: IJwtAuthToken = {
  //     userId: existingUser._id.toHexString(),
  //     email: existingUser.email,
  //     username: existingUser?.username,
  //     mfa: {
  //       enabled: existingUser.multiFactorAuth,
  //       validated: false,
  //     },
  //   }

  //   existingUser.tokens = {
  //     ...(await TokenService.getAuthTokens(tokenToSign, {
  //       accessExpiresAt: "3m",
  //       refreshExpiresAt: "3m",
  //     })),
  //   }

  //   TokenService.generateCookies(req, existingUser.tokens)

  //   await existingUser.save()
  //   return res.send({ multiFactorAuth: true })
  // }

  static validateUser = errorService.catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const { identifier, password } = req.body
      const isRestoreAccountPath = req.path === "/restore-account"
      const existingUser = isEmail(identifier)
        ? await AuthService.findUserOnlyByEmail(identifier)
        : await AuthService.findUserOnlyByUsername(identifier)

      if (!existingUser) {
        throw new BadRequestError("User not found.")
      }

      // if (existingUser.multiFactorAuth) {
      //   AuthMiddleWare.check2FactorAuth(req, res, existingUser)
      // }

      const passwordsMatch = await PasswordManager.compare(
        existingUser.password!,
        password
      )

      if (!passwordsMatch) {
        throw new NotAuthorisedError("Invalid credentials")
      }

      if (!isRestoreAccountPath && existingUser.status !== "active") {
        throw new NotAuthorisedError(
          `Access denied: account status is ${existingUser.status}`
        )
      }
      // new SendEmailPublisher(natsService.client).publish({
      //   html: `Your six digit verification code is:<div>Code: <h3>${authToken}</h3></div>`,
      //   email: updatedUser.email,
      //   subject: "Six digit verification code.",
      //   from: "kandhlovuie@gmail.com",
      // })

      req.currentUser = existingUser
      next()
    }
  )

  static credentials(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin

    if (allowedOrigins.includes(origin!)) {
      res.setHeader("Access-Control-Allow-Origin", origin!)
    }
    next()
  }
}
