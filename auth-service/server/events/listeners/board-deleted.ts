import { Message } from "node-nats-streaming"

import {
  IBoardDeletedEvent,
  Listener,
  queueGroupNames,
  Subjects,
} from "@tusksui/shared"
import { User } from "../../models/User"

export class BoardDeletedListener extends Listener<IBoardDeletedEvent> {
  readonly subject: Subjects.BoardDeleted = Subjects.BoardDeleted
  queueGroupName = queueGroupNames.BOARDS_QUEUE_GROUP

  async onMessage(data: IBoardDeletedEvent["data"], msg: Message) {
    console.log("Event data ", data)
    const user = await User.findOneAndUpdate(
      { _id: data.ownerId },
      { $pull: { boardIds: data.id } }
    )

    if (!user) throw new Error("User not found")

    msg.ack()
  }
}
