import { Message } from "node-nats-streaming"
import {
  BadRequestError,
  IAddBoardMemberEvent,
  Listener,
  queueGroupNames,
  ROLES,
  Subjects,
} from "@tusksui/shared"
import { boardService } from "../../services"
import { workspaceService } from "../../services/workspace"
import { generateRandomColor } from "../../utils/constants"
import { idToObjectId } from "../../helpers"

export class AddBoardMemberListener extends Listener<IAddBoardMemberEvent> {
  readonly subject: Subjects.AddBoardMember = Subjects.AddBoardMember
  queueGroupName = queueGroupNames.BOARDS_QUEUE_GROUP

  onMessage = async (data: IAddBoardMemberEvent["data"], msg: Message) => {
    console.log("Event data ", data)

    try {
      const [boardId, role] = data.boardInviteId?.split(":")

      const board = await boardService.updateBoardMemberRole(boardId, {
        isNew: true,
        newRole: role.toUpperCase() as keyof typeof ROLES,
        userId: data.memberId,
      })

      if (!board) {
        console.log("Board not found")
        return msg.ack()
      }

      const workspace =
        (await workspaceService.findWorkspaceByCategory({
          ownerId: data.memberId,
          category: "guest",
        })) ||
        workspaceService.createWorkspace({
          category: "guest",
          owner: data.memberId,
          name: "Guest",
          iconColor: generateRandomColor(),
        })

      if (workspace) {
        workspace.boards.push(idToObjectId(boardId))
        await workspace?.save()
      }

      if (board) {
        await board.save()
      }

      msg.ack()
    } catch (error) {
      return error
    }
  }
}
