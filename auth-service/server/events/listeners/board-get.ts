import { Message } from "node-nats-streaming"

import {
  IGetBoardEvent,
  Listener,
  queueGroupNames,
  Subjects,
} from "@tuskui/shared"

export class BoardByIdListener extends Listener<IGetBoardEvent> {
  readonly subject: Subjects.GetBoardById = Subjects.GetBoardById
  queueGroupName = queueGroupNames.BOARDS_QUEUE_GROUP

  onMessage(data: IGetBoardEvent["data"], msg: Message) {
    console.log("Event data ", data)

    msg.ack()
  }
}
