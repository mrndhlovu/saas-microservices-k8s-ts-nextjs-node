import { Request, Response } from "express"

import Payment from "../models/Payment"
import { natsService, paymentService, stripeService } from "../services"
import Order, { IOrderDocument } from "../models/Order"
import { AccountStatus } from "@tusksui/shared"
import { IOrderDetails } from "../types"
import { PaymentCreatedPublisher } from "../events/publishers/payment-created"

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

  getOrderById = async (req: Request, res: Response) => {
    res.send(req.order)
  }

  createOrder = async (req: Request, res: Response) => {
    const order = new Order({
      ...req.body,
      ownerId: req.currentUserJwt.userId,
      status: AccountStatus.Created,
    })

    await order.save()

    res.status(201).send(order)
  }

  createSubscription = async (req: Request, res: Response) => {
    const data = req.body as IOrderDetails

    const subscription = await stripeService.createSubscription(data)

    if (subscription.status === AccountStatus.Active) {
      const order = new Order({
        expiresAt: new Date(subscription.expiresAt).getUTCDate(),
        startAt: new Date(subscription.startAt).getUTCDate(),
        isPaid: true,
        ownerId: req.currentUserJwt.userId!,
        customerId: data.customerId!,
        productId: data.productId!,
      })

      new Payment({
        stripeId: subscription.productId,
        orderId: order._id,
      })

      new PaymentCreatedPublisher(natsService.client).publish({
        expiresAt: new Date(subscription.expiresAt).getUTCDate(),
        startAt: new Date(subscription.startAt).getUTCDate(),
        ownerId: req.currentUserJwt.userId!,
        customerId: data.customerId!,
        productId: data.productId!,
        orderId: order._id,
        status: AccountStatus.Active,
        plan: subscription.plan,
        isTrial: subscription.isTrial,
      })
    }

    res.status(201).send(subscription)
  }

  getStripeProductsPriceList = async (_req: Request, res: Response) => {
    const list = await stripeService.getPriceList()

    res.status(200).send(list)
  }

  updateOrder = async (req: Request, res: Response) => {
    const updatedRecord = await paymentService.findOrderByIdAndUpdate(
      req.body,
      req.order!._id
    )

    await updatedRecord!.save()

    if (updatedRecord!.isPaid) {
      const payment = new Payment({
        stripeId: req.body.stripeId,
        orderId: updatedRecord?._id,
      })

      await payment.save()
    }

    res.status(201).send(updatedRecord)
  }

  deleteOrder = async (req: Request, res: Response) => {
    await req.order!.delete()
    res.status(200).send({})
  }
}

export const paymentController = new PaymentController()
