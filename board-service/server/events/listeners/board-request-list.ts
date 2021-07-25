import { Message } from "node-nats-streaming"

import { IGetBoardListEvent, Listener, Subjects } from "@tuskui/shared"

export class BoardListListener extends Listener<IGetBoardListEvent> {
  readonly subject: Subjects.GetBoards = Subjects.GetBoards
  queueGroupName = "boards-service"

  onMessage(data: IGetBoardListEvent["data"], msg: Message) {
    console.log("Event data ", data)

    msg.ack()
  }
}
