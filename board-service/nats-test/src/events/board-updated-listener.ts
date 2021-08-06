import { Message } from "node-nats-streaming"

import { IBoardUpdatedEvent, Listener, Subjects } from "@tusksui/shared"

export class BoardUpdatedListener extends Listener<IBoardUpdatedEvent> {
  readonly subject: Subjects.BoardUpdated = Subjects.BoardUpdated
  queueGroupName = "boards-service"

  onMessage(data: IBoardUpdatedEvent["data"], msg: Message) {
    console.log("Event data ", data)

    msg.ack()
  }
}
