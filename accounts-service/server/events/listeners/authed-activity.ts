import { Message } from "node-nats-streaming"

import {
  Listener,
  Subjects,
  queueGroupNames,
  IAuthedActivityEvent,
} from "@tusksui/shared"
import Activity from "../../models/Activity"

export class AuthActivityListener extends Listener<IAuthedActivityEvent> {
  readonly subject: Subjects.AuthedActivity = Subjects.AuthedActivity
  queueGroupName = queueGroupNames.AUTH_ACTIVITY_QUEUE_GROUP

  async onMessage(data: IAuthedActivityEvent["data"], msg: Message) {
    const activity = new Activity({
      type: data.type,
      memberCreator: data.user,
      translationKey: data.actionKey,
      entities: data.entities,
    })

    await activity.save()

    console.log(activity)

    msg.ack()
  }
}
