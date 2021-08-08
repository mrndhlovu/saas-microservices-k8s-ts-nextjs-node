import { NextFunction, Request, Response } from "express"
import { check, oneOf, validationResult } from "express-validator"
import jwt from "jsonwebtoken"
import {
  BadRequestError,
  CustomRequestError,
  errorService,
  IJwtAuthToken,
} from "@tusksui/shared"

import { IAccountDocument } from "../models/Account"
import { allowedAccountUpdateFields } from "../utils/constants"
import { accountService } from "../services/account"
import { IVerificationJwt } from "../types"

const { catchAsyncError } = errorService

declare global {
  namespace Express {
    interface Request {
      account: IAccountDocument | null | undefined
      currentUserJwt: IJwtAuthToken
    }
  }
}

class AccountMiddleware {
  checkRequiredBodyFields = [
    oneOf(
      allowedAccountUpdateFields.map((field: string) =>
        check(field).exists().trim().withMessage(`${field} is required.`)
      )
    ),
  ]

  validateRequestBodyFields = catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        throw new CustomRequestError(errors.array())
      }

      next()
    }
  )

  validateVerificationJwt = catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const verificationJwt = jwt.verify(
        req.params.token,
        process.env.JWT_TOKEN_SIGNATURE!
      ) as IVerificationJwt

      const account = await accountService.findAccountOnlyByUseId(
        verificationJwt.userId
      )

      if (!account)
        throw new BadRequestError("Account with that userId was not found")

      accountService.validateAccountPlan(account)

      await account.save()

      req.account = account
      req.currentUserJwt = verificationJwt

      next()
    }
  )

  checkAccountPlan = catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const account = await accountService.findAccountOnlyByUseId(
        req.currentUserJwt.userId!
      )

      if (!account)
        throw new BadRequestError("Account with that userId was not found")

      accountService.validateAccountPlan(account)

      await account.save()

      req.account = account

      next()
    }
  )
}

export const accountMiddleware = new AccountMiddleware()
