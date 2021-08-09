import { Message } from "node-nats-streaming"

import {
  IPaymentCreatedEvent,
  Listener,
  queueGroupNames,
  Subjects,
} from "@tusksui/shared"

import { AccountUpdatedPublisher } from "../publishers"
import { accountService, natsService } from "../../services"

export class PaymentCreatedListener extends Listener<IPaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated
  queueGroupName = queueGroupNames.PAYMENTS_QUEUE_GROUP

  onMessage = async (data: IPaymentCreatedEvent["data"], msg: Message) => {
    console.log("Event data ", data)

    try {
      const account = await accountService.findAccountByIdAndUpdate(
        {
          expiresAt: data.expiresAt,
          isTrial: data.isTrial,
          plan: data.plan,
        },
        data.ownerId
      )

      if (!account) throw new Error("Account with that user name was not found")

      const eventData = accountService.getEventData(account)

      await account.delete()

      new AccountUpdatedPublisher(natsService.client).publish(eventData)

      msg.ack()
    } catch (error) {
      return error.message
    }
  }
}
