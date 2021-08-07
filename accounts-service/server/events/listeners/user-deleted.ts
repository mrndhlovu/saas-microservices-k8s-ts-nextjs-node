import { Message } from "node-nats-streaming"

import {
  BadRequestError,
  IUserDeletedEvent,
  Listener,
  queueGroupNames,
  Subjects,
} from "@tusksui/shared"

import Account from "../../models/Account"

export class UserDeletedListener extends Listener<IUserDeletedEvent> {
  readonly subject: Subjects.UserDeleted = Subjects.UserDeleted
  queueGroupName = queueGroupNames.ACCOUNT_QUEUE_GROUP

  onMessage = async (data: IUserDeletedEvent["data"], msg: Message) => {
    console.log("Event data ", data)

    try {
      const account = await Account.findOne({
        ownerId: data.id,
      })

      if (!account)
        throw new BadRequestError("Account with that user name was not found")

      await account.delete()

      msg.ack()
    } catch (error) {
      return error.message
    }
  }
}
