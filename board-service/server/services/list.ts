import { ObjectId } from "mongodb"

import { IPermissionType } from "@tusksui/shared"

import { boardService } from "."
import { IChangePosition } from "../types"
import Board, { IBoard } from "../models/Board"
import Card from "../models/Card"
import List from "../models/List"
import { idToObjectId } from "../helpers"

export interface IUpdateListMemberOptions {
  currentPermFlag: number
  newRole: IPermissionType
  isNew: boolean
  userId: ObjectId
}

export interface IListChangePosition {
  source: {
    position: number
    id: string
  }
  target: {
    position: number
    id: string
  }
}

class ListServices {
  findListOnlyById = async (listId: ObjectId | string) => {
    const list = await List.findOne({ _id: listId })
    return list
  }

  findListByKey = async (key: string, value: string) => {
    const list = await List.findOne({ [key]: value })
    return list
  }

  findListByBoardId = async (boardId: string) => {
    const lists = await List.find({ boardId, archived: false })
    return lists
  }

  findListById = async (listId: ObjectId | string) => {
    const list = await List.findOne({ _id: listId })
    return list
  }

  findListOnlyByTitle = async (title: string) => {
    const list = await List.findOne({ title })
    return list
  }

  async changePosition(board: IBoard, options: IChangePosition) {
    const listsCopy = [...board.lists]

    const sourcePosition = listsCopy.findIndex(
      id => id?.toString() === options.sourceListId
    )

    const targetPosition = listsCopy.findIndex(
      id => id?.toString() === options.targetListId
    )

    const isMovingLeft = sourcePosition > targetPosition

    const sourceId = listsCopy.find(
      id => id?.toString() === options.sourceListId
    )

    listsCopy.splice(sourcePosition, 1)

    const newPosition = isMovingLeft
      ? targetPosition === 0
        ? 0
        : targetPosition
      : targetPosition

    if (options.isSwitchingBoard) {
      const cardIds: ObjectId[] = []

      await Card.find({ listId: options.sourceListId! }, (err, records) => {
        records?.map(async record => {
          cardIds.push(record._id)
          record.boardId = new ObjectId(options.targetBoardId!)
          await record.save()
        })
      })

      if (cardIds.length > 0) {
        await boardService.removeRecordIds(board._id, {
          cards: { $in: cardIds },
          lists: { $in: [idToObjectId(options.sourceListId!)] },
        })
      }

      const targetBoard = await Board.findByIdAndUpdate(
        { _id: options.targetBoardId },
        {
          $push: {
            lists: { $each: [options.sourceListId], $position: newPosition },
            cards: { $each: cardIds },
          },
        }
      )

      await targetBoard!.save()
    } else {
      listsCopy.splice(newPosition, 0, sourceId!)
    }

    board.lists = listsCopy
    return board
  }

  validateEditableFields = <T>(allowedFields: T[], updates: T[]) => {
    return updates.every((update: T) => allowedFields.includes(update))
  }
}

const listService = new ListServices()

export { listService }
