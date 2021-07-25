import { NextFunction, Request, Response } from "express"
import { check, oneOf, validationResult } from "express-validator"

import { ListDocument } from "../models/List"
import { CustomRequestError, errorService } from "@tuskui/shared"
import { allowedListUpdateFields } from "../utils/constants"

const { catchAsyncError } = errorService

declare global {
  namespace Express {
    interface Request {
      list: ListDocument | null | undefined
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
        throw new CustomRequestError(errors.array())
      }

      next()
    }
  )
}

export const listMiddleware = new ListMiddleware()
