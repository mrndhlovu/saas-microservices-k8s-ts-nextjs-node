import { Message } from "node-nats-streaming"
import jwt from "jsonwebtoken"
import {
  AccountStatus,
  IEmailEvent,
  IUserCreatedEvent,
  Listener,
  queueGroupNames,
  Subjects,
  CreateNotificationPublisher,
} from "@tusksui/shared"
import { accountService, natsService } from "../../services"
import { AccountUpdatedPublisher, SendEmailPublisher } from "../publishers"
import { DEFAULT_EMAIL } from "../../utils/constants"
import Account from "../../models/Account"
import Notification from "../../models/Notification"

export class UserCreatedListener extends Listener<IUserCreatedEvent> {
  readonly subject: Subjects.UserCreated = Subjects.UserCreated
  queueGroupName = queueGroupNames.ACCOUNT_QUEUE_GROUP

  onMessage = async (data: IUserCreatedEvent["data"], msg: Message) => {
    console.log("Event data >>", data)

    const account = new Account({
      _id: data.id,
      status: AccountStatus.Created,
      email: data.email,
    })

    const notification = new Notification({
      isRead: false,
      body: "New account created successfully",
      subject: "New account created successfully",
      title: "New account created successfully",
      userId: data.id,
      resourceType: "new:user",
    })

    await account.save()
    await notification.save()
    const eventData = accountService.getEventData(account)

    const BASE_URL = "https://tusks.dev/auth/verify"
    const token: string = jwt.sign(
      { userId: data.id, email: data.email },
      process.env.JWT_TOKEN_SIGNATURE!
    )

    const email: IEmailEvent["data"] = {
      email: data.email,
      body: `
      Please click the link below to verify your account:
      ${BASE_URL}?token=${token}`,
      subject: "Email verification to activate your account.",
      from: DEFAULT_EMAIL,
    }

    new AccountUpdatedPublisher(natsService.client).publish(eventData)
    new SendEmailPublisher(natsService.client).publish(email)

    msg.ack()
  }
}
