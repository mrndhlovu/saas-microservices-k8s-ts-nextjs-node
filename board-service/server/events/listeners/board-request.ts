import { Message } from "node-nats-streaming"

import { IGetBoardEvent, Listener, Subjects } from "@tuskui/shared"

export class BoardByIdListener extends Listener<IGetBoardEvent> {
  readonly subject: Subjects.GetBoardById = Subjects.GetBoardById
  queueGroupName = "boards-service"

  onMessage(data: IGetBoardEvent["data"], msg: Message) {
    console.log("Event data ", data)

    msg.ack()
  }
}
