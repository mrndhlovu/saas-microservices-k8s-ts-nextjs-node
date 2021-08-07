import { Message } from "node-nats-streaming"

import {
  AccountStatus,
  IUserCreatedEvent,
  Listener,
  queueGroupNames,
  Subjects,
} from "@tusksui/shared"
import Account from "../../models/Account"
import { AccountCreatedPublisher } from "../publishers/account-created"
import { accountService, natsService } from "../../services"

export class UserCreatedListener extends Listener<IUserCreatedEvent> {
  readonly subject: Subjects.UserCreated = Subjects.UserCreated
  queueGroupName = queueGroupNames.ACCOUNT_QUEUE_GROUP

  onMessage = async (data: IUserCreatedEvent["data"], msg: Message) => {
    console.log("Event data ", data)

    const account = new Account({
      ownerId: data.id,
      status: AccountStatus.Created,
    })

    await account.save()
    const eventData = accountService.getEventData(account)
    new AccountCreatedPublisher(natsService.client).publish(eventData)

    msg.ack()
  }
}
