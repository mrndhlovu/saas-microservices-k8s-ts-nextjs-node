import Stripe from "stripe"

import { IAccountUpdatedEvent } from "@tusksui/shared"

import { CURRENCY_OPTIONS, IOrderDetails } from "../types"
import Order from "../models/Order"
import Payment from "../models/Payment"
import { response } from "express"

class StripeService {
  private apiKey = process.env.STRIPE_SECRET_KEY!.slice(
    1,
    process.env.STRIPE_SECRET_KEY!.length - 1
  ) // remove single quotes from api key

  private stripe = new Stripe(this.apiKey, {
    apiVersion: "2020-08-27",
  })

  async createDefaultStripeCustomerSubscription(
    user: IAccountUpdatedEvent["data"]
  ) {
    const customer = await this.stripe.customers.create({
      email: user.email,
      metadata: { authId: user.id },
    })

    const order = new Order({
      expiresAt: new Date("2199/01/01"),
      isPaid: true,
      ownerId: user.id,
      customerId: customer.id,
      amount: "0",
      source: "",
      currency: CURRENCY_OPTIONS.EURO,
    })

    await order.save()

    return customer
  }

  async deleteCustomer(customerId: string) {
    const response = await this.stripe.customers.del(customerId)

    return response
  }

  async find(email: string) {
    const response = await this.stripe.customers.list({ email, limit: 405 })
    return response.data
  }

  async charge(order: IOrderDetails) {
    const charge = await this.stripe.charges.create({
      currency: "eur",
      amount: +order.amount * 100,
      source: order.source,
    })

    const payment = new Payment({ orderId: order.ownerId, stripeId: charge.id })

    await payment.save()

    return { success: true }
  }
}

export const stripeService = new StripeService()
