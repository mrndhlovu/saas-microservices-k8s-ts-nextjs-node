import { Message } from "node-nats-streaming"

import {
  IBoardCreatedEvent,
  Listener,
  Subjects,
  queueGroupNames,
} from "@tusksui/shared"
import { User } from "../../models/User"

export class BoardCreatedListener extends Listener<IBoardCreatedEvent> {
  readonly subject: Subjects.BoardCreated = Subjects.BoardCreated
  queueGroupName = queueGroupNames.BOARDS_QUEUE_GROUP

  async onMessage(data: IBoardCreatedEvent["data"], msg: Message) {
    console.log("Event data ", data)

    const user = await User.findOneAndUpdate(
      { _id: data.ownerId },
      { $push: { boardIds: data.id } }
    )

    await user!?.save()

    msg.ack()
  }
}
