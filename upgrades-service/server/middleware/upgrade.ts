import { NextFunction, Request, Response } from "express"
import { check, oneOf, validationResult } from "express-validator"

import { CustomRequestError, errorService } from "@tuskui/shared"

import { UpgradeDocument } from "../models/Upgrade"
import { allowedUpgradeUpdateFields } from "../utils/constants"

const { catchAsyncError } = errorService

declare global {
  namespace Express {
    interface Request {
      upgrade: UpgradeDocument | null | undefined
    }
  }
}

class UpgradeMiddleware {
  checkRequiredBodyFields = [
    oneOf(
      allowedUpgradeUpdateFields.map((field: string) =>
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

export const upgradeMiddleware = new UpgradeMiddleware()
