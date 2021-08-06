import { Message } from "node-nats-streaming"

import {
  AccountStatus,
  IUserCreatedEvent,
  Listener,
  queueGroupNames,
  Subjects,
} from "@tusksui/shared"
import Account from "../../models/Account"

export class UserCreatedListener extends Listener<IUserCreatedEvent> {
  readonly subject: Subjects.UserCreated = Subjects.UserCreated
  queueGroupName = queueGroupNames.ACCOUNT_QUEUE_GROUP

  onMessage = async (data: IUserCreatedEvent["data"], msg: Message) => {
    console.log("Event data ", data)

    const account = new Account({
      userId: data.id,
      status: AccountStatus.Active,
    })

    await account.save()

    msg.ack()
  }
}
