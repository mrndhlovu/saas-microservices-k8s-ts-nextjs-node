import mongoose from "mongoose"
import { Request, Response } from "express"

import { BadRequestError } from "@tuskui/shared"

import { allowedUpgradeUpdateFields } from "../utils/constants"
import { upgradeService } from "../services/upgrade"
import Upgrade, { UpgradeDocument } from "../models/Upgrade"

declare global {
  namespace Express {
    interface Request {
      upgrade: UpgradeDocument | null | undefined
    }
  }
}

class UpgradeController {
  getList = async (req: Request, res: Response) => {
    const { archived } = req.query
    const isTrue = archived === "true"

    let lists = await Upgrade.find({
      boardId: req.params.boardId,
      archived: isTrue,
    })

    res.send(lists)
  }

  getListById = async (req: Request, res: Response) => {
    const upgrade = await upgradeService.findUpgradeOnlyById(req.params.listId)

    if (!upgrade)
      throw new BadRequestError("Upgrade with that id was not found")

    res.send(upgrade)
  }

  createList = async (req: Request, res: Response) => {
    const boardId = req.params.boardId

    let upgrade = new Upgrade({
      ...req.body,
      boardId,
    })

    // const board = await Board.findOneAndUpdate(
    //   { _id: boardId },
    //   { $push: { lists: upgrade._id } }
    // )

    // if (!board) throw new BadRequestError("Failed to create a upgrade")

    await upgrade.save()

    res.status(201).send(upgrade)
  }

  updateList = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body)
    const upgrade = await upgradeService.findUpgradeById(req.params.userId)

    const hasValidFields = upgradeService.validateEditableFields(
      allowedUpgradeUpdateFields,
      updates
    )

    if (!hasValidFields) throw new BadRequestError("Invalid update field")

    const updatedRecord = await Upgrade.findOneAndUpdate(
      { _id: upgrade!._id },
      { $set: { ...req.body } },
      { new: true }
    )

    await updatedRecord!.save()

    res.status(200).send(updatedRecord)
  }

  deleteList = async (req: Request, res: Response) => {
    const upgrade = await upgradeService.findUpgradeById(req.params.userId)

    await upgrade!.delete()

    res.status(200).send({})
  }
}

export const upgradeController = new UpgradeController()
