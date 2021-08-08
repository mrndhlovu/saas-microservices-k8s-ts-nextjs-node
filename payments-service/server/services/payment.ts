import Order from "../models/Order"
import Payment from "../models/Payment"

class PaymentService {
  findOrderById = async (orderId: string) => {
    const order = await Order.findOne({ _id: orderId })
    return order
  }

  findOrderByOwnerId = async (ownerId: string) => {
    const order = await Order.findOne({ ownerId })
    return order
  }

  findPaymentsByOrderId = async (orderId: string) => {
    const order = await Payment.find({ orderId: orderId })
    return order
  }

  findPaymentById = async (paymentId: string) => {
    const order = await Payment.findOne({ _id: paymentId })
    return order
  }

  validateEditableFields = <T>(allowedFields: T[], updates: T[]) => {
    return updates.every((update: T) => allowedFields.includes(update))
  }

  getEventData(payment: any) {
    const filterFields = ["_v"]

    Object.keys(payment).map(key => {
      if (filterFields.includes(key)) {
        delete payment.__v
      }

      if (key === "_id") {
        payment.id = payment._id
        delete payment._id
      }
    })

    return payment
  }
}

export const paymentService = new PaymentService()
