import { Message } from "node-nats-streaming"

import {
  IUserDeletedEvent,
  Listener,
  queueGroupNames,
  Subjects,
} from "@tuskui/shared"
import Board from "../../models/Board"

export class UserDeletedListener extends Listener<IUserDeletedEvent> {
  readonly subject: Subjects.UserDeleted = Subjects.UserDeleted
  queueGroupName = queueGroupNames.AUTH_QUEUE_GROUP

  async onMessage(data: IUserDeletedEvent["data"], msg: Message) {
    console.log("Event data ", data)

    const result = await Board.deleteMany({ _id: data.boardIds })

    msg.ack()
  }
}
