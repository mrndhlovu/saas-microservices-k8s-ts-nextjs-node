import { Message } from "node-nats-streaming"

import {
  IGetBoardListEvent,
  Listener,
  queueGroupNames,
  Subjects,
} from "@tuskui/shared"

export class BoardListListener extends Listener<IGetBoardListEvent> {
  readonly subject: Subjects.GetBoards = Subjects.GetBoards
  queueGroupName = queueGroupNames.BOARDS_QUEUE_GROUP

  onMessage(data: IGetBoardListEvent["data"], msg: Message) {
    console.log("Event data ", data)

    msg.ack()
  }
}
