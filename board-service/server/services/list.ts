import { ObjectId } from "mongodb"

import { IPermissionType } from "@tusksui/shared"

import List from "../models/List"
import { IBoard } from "../models/Board"
import { IChangePosition } from "../types"

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
      id => id.toString() === options.source
    )

    const targetPosition = listsCopy.findIndex(
      id => id.toString() === options.target
    )

    const isMovingLeft = sourcePosition > targetPosition

    const sourceId = listsCopy.find(id => id.toString() === options.source)

    listsCopy.splice(sourcePosition, 1)

    const newPosition = isMovingLeft
      ? targetPosition === 0
        ? 0
        : targetPosition
      : targetPosition

    listsCopy.splice(newPosition, 0, sourceId!)

    board.lists = listsCopy
    return board
  }

  validateEditableFields = <T>(allowedFields: T[], updates: T[]) => {
    return updates.every((update: T) => allowedFields.includes(update))
  }
}

const listService = new ListServices()

export { listService }
