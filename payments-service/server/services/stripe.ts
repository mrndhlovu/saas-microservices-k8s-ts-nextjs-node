import Stripe from "stripe"

import { IAccountUpdatedEvent } from "@tusksui/shared"

import { INewSubscription, IOrderDetails } from "../types"
import Order from "../models/Order"

class StripeService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
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
    })

    await order.save()

    return customer
  }

  async deleteCustomer(customerId: string) {
    const response = await this.stripe.customers.del(customerId)

    return response
  }

  async updateStripeCustomer(
    customerId: string,
    updates: { [key: string]: any }
  ) {
    const customer = await this.stripe.customers.update(customerId, {
      ...updates,
    })

    return customer
  }

  async updateStripeCustomerPaymentMethod(pmId: string, customerId: string) {
    const pm = await this.stripe.paymentMethods.attach(pmId, {
      customer: customerId,
    })

    await this.updateStripeCustomer(customerId, {
      invoice_settings: {
        default_payment_method: pm.id,
      },
    })

    return pm
  }

  async getPriceList() {
    const products = await this.stripe.prices.list({
      limit: 10,
      active: true,
    })

    return products
  }

  async createSubscription(data: IOrderDetails) {
    await this.updateStripeCustomerPaymentMethod(
      data.paymentMethodId!,
      data.customerId!
    )

    const subscription = await this.stripe.subscriptions.create({
      customer: data.customerId!,
      items: [{ plan: data.priceId }],
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        plan: data.plan!,
      },
    })

    return {
      status: subscription.status,
      productId: subscription.id,
      startAt: subscription.current_period_start,
      expiresAt: subscription.current_period_end,
      isTrial:
        subscription.trial_start !== null ||
        subscription.trial_start !== undefined,
      plan: subscription.metadata?.plan,
    } as INewSubscription
  }
}

export const stripeService = new StripeService()
