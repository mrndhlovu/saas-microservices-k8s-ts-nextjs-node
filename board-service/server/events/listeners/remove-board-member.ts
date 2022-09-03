import { Message } from "node-nats-streaming"
import {
  BadRequestError,
  IRemoveBoardMemberEvent,
  Listener,
  queueGroupNames,
  Subjects,
} from "@tusksui/shared"
import { boardService } from "../../services"
import { workspaceService } from "../../services/workspace"
import { generateRandomColor } from "../../utils/constants"
import { idToObjectId } from "../../helpers"

export class RemoveBoardMemberListener extends Listener<IRemoveBoardMemberEvent> {
  readonly subject: Subjects.RemoveBoardMember = Subjects.RemoveBoardMember
  queueGroupName = queueGroupNames.BOARDS_QUEUE_GROUP

  onMessage = async (data: IRemoveBoardMemberEvent["data"], msg: Message) => {
    console.log("Event data ", data)

    try {
      const { boardId, memberId } = data
      const board = await boardService.findBoardOnlyById(boardId)

      if (!board) {
        throw new BadRequestError("Board not found")
      }

      const updatedBoard = boardService.removeBoardMember(board, memberId)

      const workspace =
        (await workspaceService.findWorkspaceByCategory({
          ownerId: memberId,
          category: "guest",
        })) ||
        workspaceService.createWorkspace({
          category: "guest",
          owner: data.memberId,
          name: "Guest",
          iconColor: generateRandomColor(),
        })

      if (workspace) {
        workspace.boards = workspace.boards.filter(
          id => !id.equals(idToObjectId(boardId))
        )
        await workspace?.save()
      }

      if (board) {
        await updatedBoard.save()
      }

      msg.ack()
    } catch (error) {
      return error
    }
  }
}
