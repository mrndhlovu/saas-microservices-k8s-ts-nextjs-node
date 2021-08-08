import { NextFunction, Request, Response } from "express"
import { check, oneOf, validationResult } from "express-validator"

import {
  BadRequestError,
  CustomRequestError,
  errorService,
} from "@tusksui/shared"

import { IPaymentDocument } from "../models/Payment"
import { requiredPaymentFields } from "../utils/constants"
import { paymentService } from "../services/payment"
import { IOrderDetails } from "../types"
import { IOrderDocument } from "../models/Order"

const { catchAsyncError } = errorService

declare global {
  namespace Express {
    interface Request {
      payment: IPaymentDocument | null | undefined
      order: IOrderDocument | null | undefined
    }
  }
}

class PaymentMiddleware {
  checkRequiredBodyFields = [
    oneOf(
      requiredPaymentFields.map((field: string) =>
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

  validateOrderExists = catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const order = await paymentService.findOrderById(req.body.orderId)

      if (!order) throw new BadRequestError("Order not found")

      req.order = order

      next()
    }
  )
}

export const paymentMiddleware = new PaymentMiddleware()
