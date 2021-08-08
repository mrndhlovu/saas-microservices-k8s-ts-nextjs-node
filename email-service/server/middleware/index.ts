import { NextFunction, Request, Response } from "express"
import { check, oneOf, validationResult } from "express-validator"

import { CustomRequestError, errorService } from "@tusksui/shared"

import { requiredEmailFields } from "../utils/constants"

const { catchAsyncError } = errorService

class EmailMiddleware {
  checkRequiredBodyFields = [
    oneOf(
      requiredEmailFields.map((field: string) =>
        check(field)
          .exists()
          .not()
          .isEmpty()
          .withMessage(`${field} is required.`)
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

export const emailMiddleware = new EmailMiddleware()
