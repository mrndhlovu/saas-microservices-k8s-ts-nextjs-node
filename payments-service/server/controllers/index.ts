import { Request, Response } from "express"

import Payment from "../models/Payment"
import { stripeService } from "../services"
import { IOrderDocument } from "../models/Order"

declare global {
  namespace Express {
    interface Request {
      order: IOrderDocument | null | undefined
    }
  }
}

class PaymentController {
  getPayments = async (_req: Request, res: Response) => {
    const payments = await Payment.find({})

    res.send(payments)
  }

  getPaymentById = async (req: Request, res: Response) => {
    res.send({})
  }

  createCharge = async (req: Request, res: Response) => {
    await stripeService.charge(req.body)

    res.status(201).send({})
  }

  deletePayment = async (req: Request, res: Response) => {
    res.status(200).send({})
  }
}

export const paymentController = new PaymentController()
