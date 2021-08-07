import { NextFunction, Request, Response } from "express"
import { check, oneOf, validationResult } from "express-validator"

import {
  BadRequestError,
  CustomRequestError,
  errorService,
} from "@tusksui/shared"

import { IAccountDocument } from "../models/Account"
import { allowedAccountUpdateFields } from "../utils/constants"
import { accountService } from "../services/account"

const { catchAsyncError } = errorService

declare global {
  namespace Express {
    interface Request {
      account: IAccountDocument | null | undefined
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

  checkAccountPlan = catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const account = await accountService.findAccountById(
        req.currentUserJwt.accountId!
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
