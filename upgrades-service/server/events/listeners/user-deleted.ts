import { Message } from "node-nats-streaming"

import {
  IUserDeletedEvent,
  Listener,
  queueGroupNames,
  Subjects,
} from "@tuskui/shared"

export class UserDeletedListener extends Listener<IUserDeletedEvent> {
  readonly subject: Subjects.UserDeleted = Subjects.UserDeleted
  queueGroupName = queueGroupNames.AUTH_QUEUE_GROUP

  async onMessage(data: IUserDeletedEvent["data"], msg: Message) {
    console.log("Event data ", data)

    msg.ack()
  }
}
