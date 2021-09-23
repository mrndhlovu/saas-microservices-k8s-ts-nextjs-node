import { Message } from "node-nats-streaming"

import {
  Listener,
  Subjects,
  queueGroupNames,
  IAuthedActionEvent,
  ACTION_KEYS,
} from "@tusksui/shared"
import Action from "../../models/Action"

export class AuthActionListener extends Listener<IAuthedActionEvent> {
  readonly subject: Subjects.AuthedAction = Subjects.AuthedAction
  queueGroupName = queueGroupNames.AUTH_ACTION_QUEUE_GROUP

  async onMessage(data: IAuthedActionEvent["data"], msg: Message) {
    console.log(data)

    if (data.actionKey === ACTION_KEYS.REMOVE_CARD_ATTACHMENT) {
      const action = await Action.findOne({
        "entities.attachment.id": data.entities?.attachment.id,
      })

      if (action) {
        await action.delete()
      }
    }
    const action = new Action({
      type: data.type,
      memberCreator: data.user,
      translationKey: data.actionKey,
      entities: data.entities,
    })

    await action.save()

    msg.ack()
  }
}
