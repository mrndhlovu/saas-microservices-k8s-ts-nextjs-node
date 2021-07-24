import { Message } from "node-nats-streaming"

import { IBoardCreatedEvent, Listener, Subjects } from "@tuskui/shared"

export class BoardCreatedListener extends Listener<IBoardCreatedEvent> {
  readonly subject: Subjects.BoardCreated = Subjects.BoardCreated
  queueGroupName = "boards-service"

  onMessage(data: IBoardCreatedEvent["data"], msg: Message) {
    console.log("Event data ", data.title)

    msg.ack()
  }
}
