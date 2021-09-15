import { Message } from "node-nats-streaming"

import {
  Listener,
  Subjects,
  queueGroupNames,
  IBoardViewedEvent,
} from "@tusksui/shared"
import { User } from "../../models/User"

export class BoardViewedListener extends Listener<IBoardViewedEvent> {
  readonly subject: Subjects.BoardViewed = Subjects.BoardViewed
  queueGroupName = queueGroupNames.AUTH_QUEUE_GROUP

  async onMessage(data: IBoardViewedEvent["data"], msg: Message) {
    const user = await User.findOneAndUpdate(
      { _id: data.userId, viewedRecent: { $ne: data.boardId } },
      { $push: { viewedRecent: { $each: [data.boardId], $position: 0 } } }
    )

    if (user) {
      await user!?.save()
    }

    msg.ack()
  }
}
