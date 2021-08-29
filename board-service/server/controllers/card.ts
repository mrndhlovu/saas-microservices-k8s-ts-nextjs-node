import { BadRequestError, HTTPStatusCode, NotFoundError } from "@tusksui/shared"
import { Request, Response } from "express"

import Board from "../models/Board"
import Card, { CardDocument } from "../models/Card"
import List from "../models/List"
import { boardService } from "../services"
import { cardService } from "../services/card"
import { allowedCardUpdateFields } from "../utils/constants"

class CardController {
  getCards = async (req: Request, res: Response) => {
    const { archived } = req.query
    const isTrue = archived === "true"

    let cards = await Card.find({ listId: req.params.listId, archived: isTrue })

    res.send(cards)
  }

  getCardById = async (req: Request, res: Response) => {
    const { cardId } = req.params

    const card = await cardService.findCardById(cardId)
    if (!card) throw new BadRequestError("Card with that id was not found")

    res.send(card)
  }

  createCard = async (req: Request, res: Response) => {
    const { listId, boardId } = req.params
    const { title, position } = req.body

    const card = new Card({ title, position, listId, boardId })
    if (!card) throw new BadRequestError("Card failed to create card.")

    const board = await Board.findOneAndUpdate(
      { _id: boardId },
      { $push: { cards: card._id } }
    )

    const list = await List.findOneAndUpdate(
      { _id: listId },
      { $push: { cards: card._id } }
    )

    if (!board || !list) {
      throw new BadRequestError(
        "Card should be linked to a valid board and list"
      )
    }

    await card.save()
    await list.save()
    await board.save()

    const updatedBoard = await boardService.getPopulatedBoard(boardId)

    res.status(201).send(updatedBoard)
  }

  deleteCard = async (req: Request, res: Response) => {
    const { listId, cardId } = req.params
    const { deleteAll } = req.query

    const shouldDeleteAll = deleteAll === "true"

    if (shouldDeleteAll) {
      const cards = await Card.find({ listId })

      cards.map(async (card: CardDocument) => await card.delete())

      return res.status(200).send({})
    }

    const card = await cardService.findCardById(cardId)
    if (!card) throw new BadRequestError("Card with that id was not found")

    await card.delete()
    res.status(200).send({})
  }

  moveCard = async (req: Request, res: Response) => {
    const board = await boardService.findBoardOnlyById(req.body.boardId)

    if (!board) throw new NotFoundError("Board id is required")

    await cardService.changePosition(board, req.body)

    await board.save()

    res.status(HTTPStatusCode.Accepted).send()
  }

  updateCard = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body)

    const hasValidFields = cardService.validateEditableFields(
      allowedCardUpdateFields,
      updates
    )

    if (!hasValidFields) throw new BadRequestError("Invalid update field")

    const card = await cardService.findCardById(req.params.cardId)

    if (!card) throw new BadRequestError("Card not found")

    const updatedCard = await Card.findOneAndUpdate(
      { _id: card._id },
      { $set: { ...req.body } },
      { new: true }
    )

    if (!updatedCard) throw new BadRequestError("Card to update was not found.")

    res.status(200).send(updatedCard)
  }
}

export const cardController = new CardController()
