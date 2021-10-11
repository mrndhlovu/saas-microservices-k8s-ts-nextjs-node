import { Message } from "node-nats-streaming"

import {
  Listener,
  Subjects,
  queueGroupNames,
  IWorkspaceCreatedEvent,
} from "@tusksui/shared"
import { User } from "../../models/User"

export class WorkspaceCreatedListener extends Listener<IWorkspaceCreatedEvent> {
  readonly subject: Subjects.WorkspaceCreated = Subjects.WorkspaceCreated
  queueGroupName = queueGroupNames.AUTH_QUEUE_GROUP

  async onMessage(data: IWorkspaceCreatedEvent["data"], msg: Message) {
    console.log("Event data ", data)

    const user = await User.findOneAndUpdate(
      { _id: data.ownerId },
      {
        $push: {
          workspaces: data.id,
        },
      }
    )

    await user!?.save()

    msg.ack()
  }
}
