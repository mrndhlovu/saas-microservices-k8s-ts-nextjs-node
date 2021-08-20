import Stripe from "stripe"
import { compareAsc, format } from "date-fns"

import { IAccountUpdatedEvent } from "@tusksui/shared"

import { INewSubscription, IOrderDetails } from "../types"
import Order, { IOrderDocument } from "../models/Order"

class StripeService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2020-08-27",
  })

  async getOrCreateStripeCustomer(
    email: string,
    options?: { [key: string]: string }
  ) {
    const existingCustomer = await this.stripe.customers.list({
      email,
      limit: 1,
    })

    if (existingCustomer?.data?.[0]) {
      return existingCustomer.data?.[0]
    }

    const customer = await this.stripe.customers.create({
      email,
      metadata: { ...options },
    })

    return customer
  }

  async createDefaultStripeCustomerSubscription(
    user: IAccountUpdatedEvent["data"]
  ) {
    const customer = await this.getOrCreateStripeCustomer(user.email!, {
      authId: user.id,
    })
    console.log(
      "🚀 ~ file: stripe.ts ~ line 41 ~ StripeService ~ customer",
      customer
    )

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
    console.log(
      "🚀 ~ file: stripe.ts ~ line 64 ~ StripeService ~ deleteCustomer ~ response",
      response
    )

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

  async getBillingHistory(customerId: string) {
    const invoices = await this.stripe.invoices.list({
      limit: 10,
      customer: customerId,
    })

    const filteredInvoiceData = invoices?.data.map(invoice => ({
      periodEnd: format(new Date(invoice.period_end), "yyyy/MM/dd"),
      periodStart: format(new Date(invoice.period_start), "yyyy/MM/dd"),
      invoiceId: invoice.id,
      description: invoice.lines.data[0].description,
      billingMethod: invoice.lines.data[0].plan?.interval,
      amountPaid: invoice.total! / 100,
      isPaid: invoice.status === "paid",
      invoicePdf: invoice.invoice_pdf,
      currency: invoice.currency,
      plan: invoice.lines.data[0].metadata?.plan,
    }))

    return filteredInvoiceData || []
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
      metadata: { plan: data.plan! },
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
