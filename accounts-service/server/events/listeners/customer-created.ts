import { Message } from "node-nats-streaming"

import {
  ICustomerCreated,
  Listener,
  queueGroupNames,
  Subjects,
} from "@tusksui/shared"

import { accountService, natsService } from "../../services"
import { AccountUpdatedPublisher, SendEmailPublisher } from "../publishers"
import { DEFAULT_EMAIL } from "../../utils/constants"

export class CustomerCreatedListener extends Listener<ICustomerCreated> {
  readonly subject: Subjects.CustomerCreated = Subjects.CustomerCreated
  queueGroupName = queueGroupNames.PAYMENTS_QUEUE_GROUP

  onMessage = async (data: ICustomerCreated["data"], msg: Message) => {
    console.log("Event data ", data)

    try {
      const account = await accountService.findAccountByIdAndUpdate(
        {
          customerId: data.customerId,
        },
        data.userId
      )

      if (account) {
        await account.save()
        const eventData = accountService.getEventData(account)
        new AccountUpdatedPublisher(natsService.client).publish(eventData)
      }
      msg.ack()
    } catch (error) {
      return error
    }
  }
}
