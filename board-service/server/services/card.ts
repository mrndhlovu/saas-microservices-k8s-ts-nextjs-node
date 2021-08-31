import { NotFoundError } from "@tusksui/shared"
import { ObjectId } from "mongodb"

import { BoardDocument, IBoard } from "../models/Board"
import { IChangePosition } from "../types"
import { idToObjectId } from "../helpers"
import { listService } from "./list"
import Card from "../models/Card"
import { body } from "express-validator"

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

  validateEditableFields = <T>(allowedFields: T[], updates: T[]) => {
    return updates.every((update: T) => allowedFields.includes(update))
  }

  async changePosition(board: BoardDocument, options: IChangePosition) {
    const sourceList = await listService.findListById(options.sourceListId!)

    if (!sourceList) throw new NotFoundError("Source list not found.")

    if (options.isSwitchingList) {
      const targetList = await listService.findListById(options.targetListId!)

      if (!targetList) throw new NotFoundError("Target list not found.")

      const card = await this.findCardOnlyById(options.sourceCardId)
      if (!card) throw new NotFoundError("Drag source not found.")

      card.listId = options.targetListId!
      await card?.save()

      sourceList.cards = sourceList.cards.filter(
        cardId => !cardId.equals(idToObjectId(options.sourceCardId))
      )

      await sourceList.save()

      const targetPosition = targetList.cards.findIndex(cardId =>
        cardId.equals(idToObjectId(options.targetCardId))
      )

      const cardsCopy = [...targetList.cards]
      const cardId = new ObjectId(options.targetCardId)

      cardsCopy.splice(targetPosition, 0, cardId)

      targetList.cards = cardsCopy
      await targetList.save()

      return
    }

    const cardsCopy = [...board.cards]

    const sourcePosition = cardsCopy.findIndex(
      id => id.toHexString() === options.sourceCardId
    )

    const targetPosition = cardsCopy.findIndex(
      id => id.toHexString() === options.targetCardId
    )

    cardsCopy.splice(sourcePosition, 1)

    const cardId = new ObjectId(options.sourceCardId)

    cardsCopy.splice(targetPosition, 0, cardId!)

    sourceList.cards = cardsCopy
    board.cards = cardsCopy

    await sourceList.save()
    await board.save()

    return
  }
}

export const cardService = new CardServices()
