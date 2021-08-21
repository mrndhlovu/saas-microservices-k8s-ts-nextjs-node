import { NextFunction, Request, Response } from "express"
import { check, oneOf, validationResult } from "express-validator"

import { IListDocument } from "../models/List"
import { RequestValidationError, errorService } from "@tusksui/shared"
import { allowedListUpdateFields } from "../utils/constants"

const { catchAsyncError } = errorService

declare global {
  namespace Express {
    interface Request {
      list: IListDocument | null | undefined
    }
  }
}

class ListMiddleware {
  checkRequiredBodyFields = [
    oneOf(
      allowedListUpdateFields.map((field: string) =>
        check(field).exists().trim().withMessage(`${field} is required.`)
      )
    ),
  ]

  validateRequestBodyFields = catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array())
      }

      next()
    }
  )
}

export const listMiddleware = new ListMiddleware()
