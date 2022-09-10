import { ObjectId } from "mongodb"

import {
  ACTION_KEYS,
  ACTION_TYPES,
  IPermissionType,
  NewActionPublisher,
  NotFoundError,
} from "@tusksui/shared"

import { boardService, natsService } from "."
import Board, { BoardDocument, IBoard } from "../models/Board"
import Card from "../models/Card"
import List from "../models/List"
import { idToObjectId } from "../helpers"
import { IActionLoggerWithCardAndListOptions } from "./card"
import { Request } from "express"
import { IMoveListOptions } from "../types"

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

  async moveListToNewBoard(board: BoardDocument, options: IMoveListOptions) {
    const cardIds: ObjectId[] = []
    const sourceList = await this.findListById(options.sourceListId!)
    const sourceBoardLists = [...board.lists]
    const sourceBoardCards = [...board.cards]
    const sourceIndex = sourceBoardLists.findIndex(
      list => list.toString() === options.sourceListId
    )

    if (!sourceList) throw new NotFoundError("List not found")

    sourceBoardLists.splice(sourceIndex, 1)

    sourceList.boardId = idToObjectId(options.newBoardId!)

    await Card.find({ listId: options.sourceListId! }, (err, records) => {
      records?.map(async record => {
        cardIds.push(record._id)
        record.boardId = new ObjectId(options.newBoardId!)
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
      { _id: options.newBoardId! },
      {
        $push: {
          lists: { $each: [options.sourceListId] },
          cards: { $each: cardIds },
        },
      }
    )
    board.lists = sourceBoardLists

    await board.save()
    await sourceList.save()
    await targetBoard!.save()
  }

  async moveList(board: BoardDocument, options: IMoveListOptions) {
    const lists = [...board.lists]
    const listId = idToObjectId(options.sourceListId)

    const sourceListIndex = lists.findIndex(
      id => id.toString() === options.sourceListId
    )
    const destinationIndex = lists.findIndex(
      id => id.toString() === options.destinationListId!
    )

    lists.splice(sourceListIndex, 1)
    lists.splice(destinationIndex, 0, listId)

    console.log({ sourceListIndex, destinationIndex })

    board.lists = lists
    await board.save()

    // const isMovingUp = sourceCardIndex > destinationIndex

    // await this.logAction(req, {
    //   type: ACTION_TYPES.CARD,
    //   actionKey: isMovingUp
    //     ? ACTION_KEYS.MOVE_CARD_UP
    //     : ACTION_KEYS.MOVE_CARD_DOWN,
    //   entities: {
    //     boardId: req.body.boardId,
    //   },
    //   card: {
    //     name: sourceCard.title,
    //     id: sourceCard?._id.toString(),
    //   },
    // })
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
