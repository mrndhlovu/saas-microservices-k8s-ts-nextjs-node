import { CallbackError } from "mongoose"
import { ObjectId } from "mongodb"

import { BadRequestError } from "@tuskui/shared"

import Board, { BoardDocument, IBoardMember } from "../models/Board"

class BoardServices {
  updateBoardMemberRole = async (
    role: number,
    userId: ObjectId,
    board: BoardDocument,
    isNew?: boolean
  ) => {
    const boardMember = { id: userId, permissionFlag: role }

    if (isNew) {
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
          (member: IBoardMember) => member.id === userId
        )
        if (existingBoardMember) {
          record?.members.map((member: IBoardMember) => {
            if (existingBoardMember?.id.equals(member.id)) {
              member.permissionFlag = role
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
