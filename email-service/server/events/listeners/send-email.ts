import { Message } from "node-nats-streaming"

import {
  IEmailEvent,
  Listener,
  queueGroupNames,
  Subjects,
} from "@tusksui/shared"
import { emailService } from "../../services"

export class SendEmailListener extends Listener<IEmailEvent> {
  readonly subject: Subjects.Email = Subjects.Email
  queueGroupName = queueGroupNames.EMAIL_QUEUE_GROUP

  onMessage = async (data: IEmailEvent["data"], msg: Message) => {
    console.log("Event data", data)

    await emailService.send(data)

    msg.ack()
  }
}
