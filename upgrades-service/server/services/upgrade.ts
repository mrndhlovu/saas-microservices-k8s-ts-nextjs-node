import { ObjectId } from "mongodb"

import { IPermissionType } from "@tuskui/shared"

import Upgrade from "../models/Upgrade"

export interface IUpdateListMemberOptions {
  currentPermFlag: number
  newRole: IPermissionType
  isNew: boolean
  userId: ObjectId
}
class UpgradeServices {
  findUpgradeOnlyById = async (listId: ObjectId | string) => {
    const upgrade = await Upgrade.findOne({ _id: listId })
    return upgrade
  }

  findUpgradeById = async (listId: ObjectId | string) => {
    const upgrade = await Upgrade.findOne({ _id: listId })
    return upgrade
  }

  findUpgradeOnlyByTitle = async (title: string) => {
    const upgrade = await Upgrade.findOne({ title })
    return upgrade
  }

  validateEditableFields = <T>(allowedFields: T[], updates: T[]) => {
    return updates.every((update: T) => allowedFields.includes(update))
  }
}

export const upgradeService = new UpgradeServices()
