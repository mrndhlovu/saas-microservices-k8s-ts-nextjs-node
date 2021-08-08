import { Message } from "node-nats-streaming"

import {
  IAccountDeletedEvent,
  Listener,
  queueGroupNames,
  Subjects,
} from "@tusksui/shared"

import Payment from "../../models/Payment"
import Order from "../../models/Order"
import { paymentService, stripeService } from "../../services"

export class AccountDeletedListener extends Listener<IAccountDeletedEvent> {
  readonly subject: Subjects.AccountDeleted = Subjects.AccountDeleted
  queueGroupName = queueGroupNames.PAYMENTS_QUEUE_GROUP

  onMessage = async (data: IAccountDeletedEvent["data"], msg: Message) => {
    console.log("Event data ", data)

    try {
      const order = await paymentService.findOrderByOwnerId(data.userId)
      const customerId = order!?.customerId

      if (customerId) {
        await stripeService.deleteCustomer(customerId)
        await Payment.deleteMany({ _id: data.userId })
        await Order.deleteMany({ ownerId: data.userId })
      }

      msg.ack()
    } catch (error) {
      return error.message
    }
  }
}
