import { Message } from "node-nats-streaming"

import { IListCreatedEvent, Listener, Subjects } from "@tuskui/shared"

export class ListCreatedListener extends Listener<IListCreatedEvent> {
  readonly subject: Subjects.ListCreated = Subjects.ListCreated
  queueGroupName = "boards-service"

  async onMessage(data: IListCreatedEvent["data"], msg: Message) {
    console.log("Event data ", data)

    msg.ack()
  }
}
