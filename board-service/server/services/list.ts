import { ObjectId } from "mongodb"

import { IPermissionType } from "@tusksui/shared"

import List from "../models/List"

export interface IUpdateListMemberOptions {
  currentPermFlag: number
  newRole: IPermissionType
  isNew: boolean
  userId: ObjectId
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

  validateEditableFields = <T>(allowedFields: T[], updates: T[]) => {
    return updates.every((update: T) => allowedFields.includes(update))
  }
}

const listService = new ListServices()

export { listService }
