import { Request, Response } from "express"

class PaymentController {
  getEmails = async (_req: Request, res: Response) => {
    res.send({})
  }

  sendEmail = async (req: Request, res: Response) => {
    res.send({})
  }
}

export const paymentController = new PaymentController()
