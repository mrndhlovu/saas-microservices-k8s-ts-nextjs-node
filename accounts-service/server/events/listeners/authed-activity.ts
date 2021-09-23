import { Message } from "node-nats-streaming"

import {
  Listener,
  Subjects,
  queueGroupNames,
  IAuthedActivityEvent,
  ACTION_KEYS,
} from "@tusksui/shared"
import Activity from "../../models/Activity"

export class AuthActivityListener extends Listener<IAuthedActivityEvent> {
  readonly subject: Subjects.AuthedActivity = Subjects.AuthedActivity
  queueGroupName = queueGroupNames.AUTH_ACTIVITY_QUEUE_GROUP

  async onMessage(data: IAuthedActivityEvent["data"], msg: Message) {
    console.log(data)

    if (data.actionKey === ACTION_KEYS.REMOVE_CARD_ATTACHMENT) {
      const activity = await Activity.findOne({
        "entities.attachment.id": data.entities?.attachment.id,
      })

      if (activity) {
        await activity.delete()
      }
    }
    const activity = new Activity({
      type: data.type,
      memberCreator: data.user,
      translationKey: data.actionKey,
      entities: data.entities,
    })

    await activity.save()

    msg.ack()
  }
}
