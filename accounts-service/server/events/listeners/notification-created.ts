import { Message } from "node-nats-streaming"

import {
  Listener,
  queueGroupNames,
  Subjects,
  ICreateNotificationEvent,
} from "@tusksui/shared"

import Notification from "../../models/Notification"

export class NotificationCreatedListener extends Listener<ICreateNotificationEvent> {
  readonly subject: Subjects.CreateNotification = Subjects.CreateNotification
  queueGroupName = queueGroupNames.ACCOUNT_QUEUE_GROUP

  onMessage = async (data: ICreateNotificationEvent["data"], msg: Message) => {
    console.log("Event data ", data)

    try {
      const notification = new Notification({
        body: data.body,
        isRead: false,
        subject: data.subject,
        actionKey: data.actionKey,
        user: data.user,
      })

      await notification.save()

      msg.ack()
    } catch (error) {
      return error
    }
  }
}
