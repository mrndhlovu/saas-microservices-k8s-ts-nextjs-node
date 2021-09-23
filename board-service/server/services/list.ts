import { ObjectId } from "mongodb"

import {
  ACTION_KEYS,
  ACTION_TYPES,
  IPermissionType,
  NewActionPublisher,
  NotFoundError,
} from "@tusksui/shared"

import { boardService, natsService } from "."
import { IChangePosition } from "../types"
import Board, { IBoard } from "../models/Board"
import Card from "../models/Card"
import List from "../models/List"
import { idToObjectId } from "../helpers"
import { IActionLoggerWithCardAndListOptions } from "./card"
import { Request } from "express"

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

  async changePosition(board: IBoard, options: IChangePosition, req: Request) {
    const listsCopy = [...board.lists]
    const sourceList = await this.findListById(options.sourceListId!)

    if (!sourceList) throw new NotFoundError("Source list not found")

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

      await this.logAction(req, {
        type: ACTION_TYPES.LIST,
        actionKey: ACTION_KEYS.TRANSFER_LIST,
        entities: {
          boardId: req.body.boardId,
        },
        list: {
          id: sourceList._id.toString(),
          name: sourceList.title,
        },
        targetBoard:
          options.isSwitchingBoard && targetBoard
            ? { id: targetBoard._id.toString(), name: targetBoard.title }
            : undefined,
      })
    } else {
      await this.logAction(req, {
        type: ACTION_TYPES.LIST,
        actionKey: isMovingLeft
          ? ACTION_KEYS.MOVE_LIST_LEFT
          : ACTION_KEYS.MOVE_LIST_RIGHT,
        entities: {
          boardId: req.body.boardId,
        },
        list: {
          id: sourceList._id.toString(),
          name: sourceList.title,
        },
      })

      listsCopy.splice(newPosition, 0, sourceId!)
    }

    board.lists = listsCopy
    return board
  }

  validateEditableFields = <T>(allowedFields: T[], updates: T[]) => {
    return updates.every((update: T) => allowedFields.includes(update))
  }

  async logAction(req: Request, options: IActionLoggerWithCardAndListOptions) {
    await new NewActionPublisher(natsService.client).publish({
      type: options.type,
      userId: req.currentUserJwt.userId!,
      actionKey: options.actionKey,
      entities: {
        ...options.entities,
        list: options?.list,
        targetList: options?.targetList,
        targetBoard: options?.targetBoard,
      },
    })
  }
}

const listService = new ListServices()

export { listService }
