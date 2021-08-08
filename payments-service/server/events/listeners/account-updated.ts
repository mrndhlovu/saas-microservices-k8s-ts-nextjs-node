import { Message } from "node-nats-streaming"

import {
  IAccountUpdatedEvent,
  Listener,
  queueGroupNames,
  Subjects,
} from "@tusksui/shared"
import { natsService, paymentService, stripeService } from "../../services"
import { CustomerCreatedPublisher } from "../publishers/customer-created"

export class AccountUpdatedListener extends Listener<IAccountUpdatedEvent> {
  readonly subject: Subjects.AccountUpdated = Subjects.AccountUpdated
  queueGroupName = queueGroupNames.PAYMENTS_QUEUE_GROUP

  onMessage = async (data: IAccountUpdatedEvent["data"], msg: Message) => {
    console.log("Event data ", data)

    const order = await paymentService.findOrderByOwnerId(data.id)

    if (data.isVerified && !order) {
      const customer =
        await stripeService.createDefaultStripeCustomerSubscription(data)
      new CustomerCreatedPublisher(natsService.client).publish({
        userId: data.id,
        customerId: customer.id,
      })
    }

    msg.ack()
  }
}
