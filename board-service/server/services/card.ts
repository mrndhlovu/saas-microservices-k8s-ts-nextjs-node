import { NotFoundError } from "@tusksui/shared"
import { ObjectId } from "mongodb"

import { IBoard } from "../models/Board"
import { IChangePosition } from "../types"
import { idToObjectId } from "../helpers"
import { listService } from "./list"
import Card from "../models/Card"

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

  validateEditableFields = <T>(allowedFields: T[], updates: T[]) => {
    return updates.every((update: T) => allowedFields.includes(update))
  }

  async changePosition(board: IBoard, options: IChangePosition) {
    const sourceList = await listService.findListById(options.sourceListId!)
    if (!sourceList) throw new NotFoundError("Source list not found.")

    if (options.isSwitchingList) {
      const targetList = await listService.findListById(options.targetListId!)

      if (!targetList) throw new NotFoundError("Target list not found.")

      const card = await this.findCardOnlyById(options.sourceCardId)
      if (!card) throw new NotFoundError("Card not found.")

      card.listId = options.targetListId!
      await card?.save()

      delete sourceList.cards[
        sourceList.cards.findIndex(cardId =>
          cardId.equals(idToObjectId(options.sourceCardId))
        )
      ]

      const targetPosition = targetList.cards.findIndex(cardId =>
        cardId.equals(idToObjectId(options.targetCardId))
      )

      const cardsCopy = [...targetList.cards]
      const cardId = new ObjectId(options.targetCardId)

      cardsCopy.splice(targetPosition, 0, cardId)

      await sourceList.save()

      targetList.cards = cardsCopy
      await targetList.save()
    } else {
      const cardsCopy = [...sourceList.cards]

      const sourcePosition = cardsCopy.findIndex(
        id => id.toHexString() === options.sourceCardId
      )
      console.log(
        "🚀 ~ file: card.ts ~ line 73 ~ CardServices ~ changePosition ~ sourcePosition",
        sourcePosition
      )

      const targetPosition = cardsCopy.findIndex(
        id => id.toHexString() === options.targetCardId
      )
      console.log(
        "🚀 ~ file: card.ts ~ line 78 ~ CardServices ~ changePosition ~ targetPosition",
        targetPosition
      )

      cardsCopy.splice(sourcePosition, 1)

      const cardId = new ObjectId(options.sourceCardId)

      cardsCopy.splice(targetPosition, 0, cardId!)

      sourceList.cards = cardsCopy
      await sourceList.save()
      board.cards = sourceList.cards

      await board.save()
    }

    return {}
  }
}

export const cardService = new CardServices()
