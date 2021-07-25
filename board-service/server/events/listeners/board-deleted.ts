import { Message } from "node-nats-streaming"

import { IBoardDeletedEvent, Listener, Subjects } from "@tuskui/shared"

export class BoardDeletedListener extends Listener<IBoardDeletedEvent> {
  readonly subject: Subjects.BoardDeleted = Subjects.BoardDeleted
  queueGroupName = "boards-service"

  onMessage(data: IBoardDeletedEvent["data"], msg: Message) {
    console.log("Event data ", data)

    msg.ack()
  }
}
