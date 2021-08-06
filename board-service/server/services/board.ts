import mongoose, { CallbackError } from "mongoose"

import {
  BadRequestError,
  IPermissionType,
  permissionManager,
} from "@tusksui/shared"

import Board, { BoardDocument, IBoardMember } from "../models/Board"
import { idToObjectId } from "../helpers"

export interface IUpdateBoardMemberOptions {
  currentPermFlag: number
  newRole: IPermissionType
  isNew: boolean
  userId: string
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
            if (existingBoardMember?.id === member.id) {
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

  getPopulatedBoard = async (boardId: string | string) => {
    const board = await Board.findOne({
      _id: idToObjectId(boardId),
      archived: false,
    }).populate([{ path: "lists" }, { path: "cards", model: "Card" }])

    return board
  }

  findInvitedBoards(userId: string, invitedBoardList: string[]) {}

  findBoardOnlyByTitle = async (title: string) => {
    const board = await Board.findOne({ title })
    return board
  }

  findBoardOnlyById = async (boardId: string) => {
    const board = await Board.findOne({ _id: boardId })

    if (!board) throw new BadRequestError("Board with that id was not found")

    return board
  }

  validateEditableFields = <T>(allowedFields: T[], updates: T[]) => {
    return updates.every((update: T) => allowedFields.includes(update))
  }
}

const boardService = new BoardServices()

export { boardService }
