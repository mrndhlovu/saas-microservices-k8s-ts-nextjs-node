import { Message } from "node-nats-streaming"

import {
  Listener,
  Subjects,
  queueGroupNames,
  IAccountCreatedEvent,
} from "@tusksui/shared"
import { User } from "../../models/User"

export class AccountCreatedListener extends Listener<IAccountCreatedEvent> {
  readonly subject: Subjects.AccountCreated = Subjects.AccountCreated
  queueGroupName = queueGroupNames.AUTH_QUEUE_GROUP

  async onMessage(data: IAccountCreatedEvent["data"], msg: Message) {
    console.log("Event data ", data)

    const user = await User.findOneAndUpdate(
      { _id: data.ownerId },
      {
        $set: {
          account: { ...data },
        },
      }
    )

    await user!?.save()

    msg.ack()
  }
}
