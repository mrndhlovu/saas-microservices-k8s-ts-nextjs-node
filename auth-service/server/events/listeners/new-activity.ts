import { Message } from "node-nats-streaming"

import {
  Listener,
  Subjects,
  queueGroupNames,
  INewActivityEvent,
} from "@tusksui/shared"

import { natsService } from "../../services/nats"
import { User } from "../../models/User"
import { AuthedActivityPublisher } from "../publishers/authed-activity"

export class NewActivityListener extends Listener<INewActivityEvent> {
  readonly subject: Subjects.NewActivity = Subjects.NewActivity
  queueGroupName = queueGroupNames.AUTH_ACTIVITY_QUEUE_GROUP

  async onMessage(data: INewActivityEvent["data"], msg: Message) {
    const user = await User.findById(data.userId)

    if (user) {
      new AuthedActivityPublisher(natsService.client).publish({
        ...data,
        user: {
          id: user._id,
          initials: user.initials!,
          username: user?.username,
          fullName: user?.firstname
            ? `${user?.firstname} ${user?.lastname}`
            : ``,
        },
      })
    }

    msg.ack()
  }
}
