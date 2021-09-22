import { Request } from "express"
import { Types } from "mongoose"

import { NewActivityPublisher, NotFoundError } from "@tusksui/shared"

import { IActionLogger, natsService } from "."
import { IChangePosition } from "../types"
import { idToObjectId } from "../helpers"
import { listService } from "./list"
import Attachment from "../models/Attachment"
import Board, { BoardDocument } from "../models/Board"
import Card from "../models/Card"
import Checklist from "../models/Checklist"
import List from "../models/List"
import Task from "../models/Task"

export type ResourceProps = {
  id: string
  name: string
}

export interface IActionLoggerWithCardAndListOptions extends IActionLogger {
  card?: ResourceProps
  list?: ResourceProps
  checklist?: ResourceProps
  task?: ResourceProps
}

class CardServices {
  findCardOnlyById = async (cardId: string) => {
    const card = await Card.findOne({ _id: cardId })
    return card
  }

  findCardById = async (cardId: string, archived?: boolean) => {
    const card = await Card.findOne({
      _id: cardId,
      archived: archived || false,
    })
    return card
  }

  findListOnlyByTitle = async (title: string) => {
    const card = await Card.findOne({ title })
    return card
  }

  findCardsByBoardId = async (boardId: string) => {
    const cards = await Card.find({ boardId, archived: false }).sort("listId")
    return cards
  }

  findAttachmentByCardId = async (cardId: string) => {
    const cards = await Attachment.findOne({ cardId })
    return cards
  }

  findChecklistByCardId = async (cardId: Types.ObjectId) => {
    const checklists = await Checklist.find({ cardId }).populate({
      path: "tasks",
      model: "Task",
    })
    return checklists
  }

  findChecklistById = async (_id: string) => {
    const checklist = await Checklist.findById(_id)

    return checklist
  }

  findTaskById = async (_id: string) => {
    const task = await Task.findById(_id)

    return task
  }

  findAttachmentById = async (_id: string) => {
    const cards = await Attachment.findOne({ _id })
    return cards
  }

  async getPopulatedCard(cardId: string) {
    const card = await Card.findOne({ _id: cardId }).populate({
      path: "imageCover",
      model: "Attachment",
    })

    return card
  }

  validateEditableFields = <T>(allowedFields: T[], updates: T[]) => {
    return updates.every((update: T) => allowedFields.includes(update))
  }

  async changePosition(board: BoardDocument, options: IChangePosition) {
    if (options.isSwitchingList) {
      const targetList = await listService.findListById(options.targetListId!)

      if (!targetList) throw new NotFoundError("Target list not found.")

      const card = await this.findCardOnlyById(options.sourceCardId)
      if (!card) throw new NotFoundError("Drag source not found.")

      card.listId = options.targetListId!
      if (options.isSwitchingBoard) {
        board.cards.filter(card => card.toString() === options.sourceCardId)

        await board.save()
        const targetBoard = await Board.findOneAndUpdate(
          { _id: options.targetBoardId },
          {
            $addToSet: { cards: idToObjectId(options.sourceCardId) },
          }
        )

        card.boardId = idToObjectId(options.targetBoardId!)
        await targetBoard!.save()
      }

      await card?.save()

      var sourceList = await List.findOneAndUpdate(
        { _id: options.sourceListId! },
        {
          $pull: { cards: { $eq: idToObjectId(options.sourceCardId) } },
        }
      )

      if (!sourceList) throw new NotFoundError("Source list not found.")

      await sourceList.save()

      const targetPosition = targetList.cards.findIndex(
        cardId => cardId.toString() === options.targetCardId
      )

      const cardsCopy = [...targetList.cards]
      const cardId = idToObjectId(options.targetCardId)

      if (targetPosition === -1) {
        cardsCopy.splice(0, 0, cardId)
      } else {
        cardsCopy.splice(targetPosition, 0, cardId)
      }

      targetList.cards = cardsCopy

      await targetList.save()

      return
    }

    var sourceList = await listService.findListById(options.sourceListId!)
    if (!sourceList) throw new NotFoundError("Source list not found.")

    const cardsCopy = [...sourceList.cards]

    const sourcePosition = cardsCopy.findIndex(
      id => id.toString() === options.sourceCardId
    )

    const targetPosition = cardsCopy.findIndex(
      id => id.toString() === options.targetCardId
    )

    if (sourcePosition === targetPosition) return

    cardsCopy.splice(sourcePosition, 1)

    const cardId = idToObjectId(options.sourceCardId)

    cardsCopy.splice(targetPosition, 0, cardId!)

    sourceList.cards = cardsCopy
    board.cards = sourceList.cards

    await sourceList.save()
    await board.save()

    return
  }

  async logAction(req: Request, options: IActionLoggerWithCardAndListOptions) {
    await new NewActivityPublisher(natsService.client).publish({
      type: options.type,
      userId: req.currentUserJwt.userId!,
      actionKey: options.actionKey,
      data: {
        ...options.data,
        card: options.card,
        list: options?.list,
        checklist: options?.checklist,
        task: options?.task,
      },
    })
  }
}

export const cardService = new CardServices()
