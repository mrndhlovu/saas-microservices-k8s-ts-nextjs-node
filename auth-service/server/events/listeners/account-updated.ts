import { Message } from "node-nats-streaming"

import {
  Listener,
  Subjects,
  queueGroupNames,
  IAccountUpdatedEvent,
} from "@tusksui/shared"
import { User } from "../../models/User"

export class AccountUpdatedListener extends Listener<IAccountUpdatedEvent> {
  readonly subject: Subjects.AccountUpdated = Subjects.AccountUpdated
  queueGroupName = queueGroupNames.AUTH_QUEUE_GROUP

  async onMessage(data: IAccountUpdatedEvent["data"], msg: Message) {
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
