import { CallbackError } from "mongoose"
import { ObjectId } from "mongodb"

import {
  BadRequestError,
  IPermissionType,
  permissionManager,
} from "@tuskui/shared"

import Board, { BoardDocument, IBoardMember } from "../models/Board"

export interface IUpdateBoardMemberOptions {
  currentPermFlag: number
  newRole: IPermissionType
  isNew: boolean
  userId: ObjectId
}
class BoardServices {
  updateBoardMemberRole = async (
    board: BoardDocument,
    options: IUpdateBoardMemberOptions
  ) => {
    const boardMember: IBoardMember = {
      id: options.userId,
      permissionFlag: permissionManager.updatePermission(
        options.currentPermFlag,
        options.newRole
      ),
    }

    if (options.isNew) {
      board.members.push(boardMember)

      return board
    }

    const updateBoardRecord = await Board.findById(
      board._id,
      async (err: CallbackError, record: BoardDocument) => {
        if (err) {
          return new BadRequestError("Board not found")
        }

        const existingBoardMember = record?.members.find(
          (member: IBoardMember) => member.id === options.userId
        )
        if (existingBoardMember) {
          record?.members.map((member: IBoardMember) => {
            if (existingBoardMember?.id.equals(member.id)) {
              member.permissionFlag = permissionManager.updatePermission(
                member.permissionFlag,
                options.newRole
              )
            }
          })
        } else {
          record?.members.push(boardMember)
        }

        await record.save()

        return record
      }
    )

    return updateBoardRecord
  }

  populatedBoard = async (boardId: ObjectId | string) => {
    const board = await Board.findById(boardId)
    return board
  }

  findInvitedBoards(userId: ObjectId, invitedBoardList: ObjectId[]) {}

  findBoardOnlyByTitle = async (title: string) => {
    const board = await Board.findOne({ title })
    return board
  }

  validateEditableFields = <T>(allowedFields: T[], updates: T[]) => {
    return updates.every((update: T) => allowedFields.includes(update))
  }
}

const boardService = new BoardServices()

export { boardService }
