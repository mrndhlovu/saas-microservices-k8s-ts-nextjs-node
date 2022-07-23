import { Message } from "node-nats-streaming"

import {
  ICustomerCreated,
  Listener,
  queueGroupNames,
  Subjects,
} from "@tusksui/shared"

import Workspace from "../../models/Workspace"
import { WorkspaceCreatedPublisher } from "../publishers/workspace-created"
import { algoliaClient, natsService } from "../../services"
import { SendEmailPublisher } from "../publishers/send-email"
import { DEFAULT_EMAIL } from "../../utils/constants"

export class CustomerCreatedListener extends Listener<ICustomerCreated> {
  readonly subject: Subjects.CustomerCreated = Subjects.CustomerCreated
  queueGroupName = queueGroupNames.BOARDS_QUEUE_GROUP

  onMessage = async (data: ICustomerCreated["data"], msg: Message) => {
    console.log("Event data ", data)

    try {
      const workspace = new Workspace({
        owner: data.userId,
        name: "Default",
        category: "default",
      })

      await workspace.save()

      await new WorkspaceCreatedPublisher(natsService.client).publish({
        ownerId: data.userId,
        id: workspace?._id.toString(),
      })

      algoliaClient.addObjects([
        {
          objectID: workspace?._id,
          type: "workspace",
          userId: data.userId,
          workspace: {
            title: workspace.name,
            description: workspace?.description!,
            category: workspace?.category,
          },
        },
      ])

      const email = {
        email: DEFAULT_EMAIL,
        body: `
          <div>	
            <p>Hello Mduduzi Ndhlovu,</p>
            <p>Start taking creating your tusks.</p>
          <div>`,
        subject: "Welcome to TUSKS!",
        from: DEFAULT_EMAIL,
      }

      await new SendEmailPublisher(natsService.client).publish(email)

      msg.ack()
    } catch (error) {
      return error
    }
  }
}
