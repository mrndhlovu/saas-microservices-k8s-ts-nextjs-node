import { Message } from "node-nats-streaming"
import {
  AccountStatus,
  IUserVerifiedEvent,
  Listener,
  queueGroupNames,
  Subjects,
} from "@tusksui/shared"
import { accountService, natsService } from "../../services"
import { AccountUpdatedPublisher } from "../publishers"

import Account from "../../models/Account"
import Notification from "../../models/Notification"

export class UserVerifiedListener extends Listener<IUserVerifiedEvent> {
  readonly subject: Subjects.UserVerified = Subjects.UserVerified
  queueGroupName = queueGroupNames.ACCOUNT_QUEUE_GROUP

  onMessage = async (data: IUserVerifiedEvent["data"], msg: Message) => {
    console.log("Event data >>", data)

    const account = new Account({
      _id: data.id,
      status: AccountStatus.Active,
      email: data.email,
      isVerified: data.verified,
    })

    const notification = new Notification({
      isRead: false,
      body: "New account created successfully",
      subject: "New account created successfully",
      title: "New account created successfully",
      user: { id: data.id },
      actionKey: "new:user",
    })

    await account.save()
    await notification.save()
    const eventData = accountService.getEventData(account)

    new AccountUpdatedPublisher(natsService.client).publish(eventData)

    msg.ack()
  }
}
