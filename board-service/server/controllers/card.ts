import { BadRequestError, HTTPStatusCode, NotFoundError } from "@tusksui/shared"
import { Request, Response } from "express"
import { idToObjectId } from "../helpers"
import Attachment from "../models/Attachment"
import Board from "../models/Board"

import Card, { CardDocument } from "../models/Card"
import Label from "../models/Label"
import List from "../models/List"
import { boardService } from "../services"
import { cardService } from "../services/card"
import { IUploadFile } from "../types"
import { allowedCardUpdateFields } from "../utils/constants"

declare global {
  namespace Express {
    interface Request {
      uploadFiles?: IUploadFile[]
    }
  }
}

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

  getLabelsByUserId = async (req: Request, res: Response) => {
    const labels = await Label.find({ owner: req.currentUserJwt.userId })

    res.send(labels)
  }

  getAttachmentsByCardId = async (req: Request, res: Response) => {
    const { cardId } = req.params
    const attachments = await Attachment.find({ cardId })

    res.send(attachments)
  }

  createCard = async (req: Request, res: Response) => {
    const { listId, boardId } = req.params
    const { title, position } = req.body

    const card = new Card({ title, position, listId, boardId })
    if (!card) throw new BadRequestError("Card failed to create card.")

    const list = await List.findOneAndUpdate(
      { _id: listId },
      { $push: { cards: card._id } }
    )

    const board = await Board.findOneAndUpdate(
      { _id: boardId },
      { $push: { cards: card._id } }
    )

    if (!list || !board) {
      throw new BadRequestError(
        "Card should be linked to a valid board and list"
      )
    }

    await card.save()
    await list.save()
    await board.save()

    res.status(201).send(card)
  }

  createLabel = async (req: Request, res: Response) => {
    const { color, name } = req.body

    const label = new Label({ color, name, owner: req.currentUserJwt.userId })
    if (!label) throw new BadRequestError("Card failed to create card.")

    await label.save()

    res.status(201).send(label)
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

  uploadCoverImage = async (req: Request, res: Response) => {
    const { cardId } = req.params
    if (!cardId) throw new NotFoundError("Card id query string required")

    const card = await cardService.findCardOnlyById(cardId as string)
    if (!card) throw new NotFoundError("Card not found")

    const result = await boardService.upload(req.uploadFiles!)
    const data = result[0]

    const attachment = new Attachment({
      cardId: card._id,
      url: data.url,
      height: data.height,
      width: data.width,
      edgeColor: data?.colors[0]?.[0],
      active: true,
    })

    await attachment.save()

    card.imageCover = attachment._id

    await card.save()

    res.status(200).send(attachment)
  }

  deleteLabel = async (req: Request, res: Response) => {
    const { labelId } = req.params

    const label = await Label.findOne({
      _id: labelId,
      owner: req.currentUserJwt.userId,
    })
    if (!label) throw new NotFoundError("Label with that id was not found")

    await label.delete()
    res.status(HTTPStatusCode.OK).send()
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
    const { cardId } = req.params
    const hasValidFields = cardService.validateEditableFields(
      allowedCardUpdateFields,
      updates
    )

    if (!hasValidFields) throw new BadRequestError("Invalid update field")

    const card = await cardService.findCardById(cardId)

    if (!card) throw new BadRequestError("Card not found")

    let updatedCard: CardDocument | null

    switch (true) {
      case updates.includes("label"):
        const { label } = req.body

        if (card.labels.includes(label)) {
          updatedCard = await Card.findByIdAndUpdate(
            card._id,
            { $pull: { labels: label } },
            { new: true, upsert: true }
          )
        } else {
          updatedCard = await Card.findByIdAndUpdate(
            card._id,
            { $push: { labels: label } },
            { new: true, upsert: true }
          )
        }
        break

      case updates.includes("imageCover"):
        const attachment = await cardService.findAttachmentById(
          req.body.imageCover
        )

        if (!attachment) throw new BadRequestError("Attachment not found")
        console.log(idToObjectId(req.body.imageCover).equals(attachment._id))

        if (idToObjectId(req.body.imageCover).equals(attachment._id)) {
          attachment.active = !attachment.active

          await attachment.save()
          updatedCard = card
          break
        }

        if (!attachment.active) {
          attachment.active = true
        }

        await attachment.save()
        card.imageCover = attachment._id

        updatedCard = card

        break

      default:
        updatedCard = await Card.findByIdAndUpdate(
          req.params.cardId,
          { $set: { ...req.body } },
          { new: true }
        )

        break
    }

    if (!updatedCard) throw new BadRequestError("Card to update was not found.")
    await updatedCard.save()

    const cardRecord = await cardService.getPopulatedCard(cardId)

    res.status(200).send(cardRecord)
  }
}

export const cardController = new CardController()
