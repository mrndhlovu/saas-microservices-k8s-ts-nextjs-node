import { NotFoundError } from "@tusksui/shared"
import { ObjectId } from "mongodb"

import Board, { BoardDocument, IBoard } from "../models/Board"
import { IChangePosition } from "../types"
import { idToObjectId } from "../helpers"
import { listService } from "./list"
import Card from "../models/Card"
import { body } from "express-validator"
import Attachment from "../models/Attachment"
import List from "../models/List"
import { boardService } from "."

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
        board.cards.filter(
          card => !card.equals(idToObjectId(options.sourceCardId))
        )

        await board.save()
        const targetBoard = await Board.findOneAndUpdate(
          { _id: options.targetBoardId },
          {
            $addToSet: { cards: new ObjectId(options.sourceCardId) },
          }
        )

        card.boardId = new ObjectId(options.targetBoardId!)
        await targetBoard!.save()
      }

      await card?.save()

      var sourceList = await List.findOneAndUpdate(
        { _id: options.sourceListId! },
        {
          $pull: { cards: { $eq: new ObjectId(options.sourceCardId) } },
        }
      )

      if (!sourceList) throw new NotFoundError("Source list not found.")

      await sourceList.save()

      const targetPosition = targetList.cards.findIndex(cardId =>
        cardId.equals(idToObjectId(options.targetCardId))
      )

      const cardsCopy = [...targetList.cards]
      const cardId = new ObjectId(options.targetCardId)

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
      id => id.toHexString() === options.sourceCardId
    )

    const targetPosition = cardsCopy.findIndex(
      id => id.toHexString() === options.targetCardId
    )

    if (sourcePosition === targetPosition) return

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
