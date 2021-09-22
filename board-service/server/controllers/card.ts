import {
  ACTION_KEYS,
  ACTIVITY_TYPES,
  BadRequestError,
  HTTPStatusCode,
  NewActivityPublisher,
  NotFoundError,
} from "@tusksui/shared"
import { Request, Response } from "express"
import { idToObjectId } from "../helpers"
import Attachment from "../models/Attachment"
import Board from "../models/Board"

import { allowedCardUpdateFields } from "../utils/constants"
import { boardService, natsService } from "../services"
import { cardService } from "../services/card"
import { IUploadFile } from "../types"
import Card, { CardDocument } from "../models/Card"
import Checklist from "../models/Checklist"
import Label from "../models/Label"
import List from "../models/List"
import Task from "../models/Task"
import { listeners } from "process"

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

  getChecklistsByCardId = async (req: Request, res: Response) => {
    const cardId = req.params.cardId! as string

    const card = await cardService.findChecklistByCardId(idToObjectId(cardId))
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

    const card = new Card({ title, listId, boardId })
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

    await cardService.logAction(req, {
      type: ACTIVITY_TYPES.CARD,
      actionKey: ACTION_KEYS.CREATE_CARD,
      data: {
        id: boardId,
        name: title,
      },
      list: {
        id: list._id,
        name: list.title,
      },
      card: {
        id: card._id,
        name: card.title,
      },
    })

    res.status(201).send(card)
  }

  createLabel = async (req: Request, res: Response) => {
    const { color, name } = req.body

    const label = new Label({ color, name, owner: req.currentUserJwt.userId })
    if (!label) throw new BadRequestError("Card failed to create card.")

    await label.save()

    res.status(201).send(label)
  }

  createChecklist = async (req: Request, res: Response) => {
    const { title, cardId } = req.body

    const checklist = new Checklist({
      title,
      cardId,
      owner: req.currentUserJwt.userId,
    })
    if (!checklist) throw new BadRequestError("Failed to create checklist.")

    const card = await cardService.findCardOnlyById(cardId)

    if (!card) throw new BadRequestError("Card with that id was not found")

    card?.checklists.unshift(checklist._id)

    await checklist.save()
    await card.save()

    await cardService.logAction(req, {
      type: ACTIVITY_TYPES.CARD,
      actionKey: ACTION_KEYS.ADD_CHECKLIST,
      data: {
        id: cardId,
        name: card.title,
      },
      checklist: {
        id: checklist._id,
        name: checklist.title,
      },
    })

    res.status(201).send(checklist)
  }

  createTask = async (req: Request, res: Response) => {
    const { item, checklistId } = req.body

    const task = new Task({
      item,
      checklist: idToObjectId(checklistId),
    })
    if (!task) throw new BadRequestError("Failed to create task.")

    const checklist = await cardService.findChecklistById(checklistId)

    if (!checklist) {
      throw new BadRequestError("Checklist with that id was not found")
    }
    checklist.tasks.push(task._id)

    await checklist.save()
    await task.save()

    res.status(201).send(task)
  }

  convertTaskToCard = async (req: Request, res: Response) => {
    const { taskId, checklistId, boardId, listId } = req.body

    const task = await cardService.findTaskById(taskId)
    if (!task) {
      throw new BadRequestError("Checklist with that id was not found")
    }

    const card = new Card({ title: task.item, listId, boardId })

    const checklist = await Checklist.findByIdAndUpdate(checklistId, {
      $pull: { tasks: idToObjectId(taskId) },
    })

    if (!checklist) throw new BadRequestError("Card with that id was not found")

    const board = await Board.findOneAndUpdate(
      { _id: boardId },
      { $push: { cards: card._id } }
    )

    if (!board) {
      throw new BadRequestError(
        "Card should be linked to a valid board and list"
      )
    }

    await task.delete()
    await checklist.save()
    await card.save()
    await board.save()

    await cardService.logAction(req, {
      type: ACTIVITY_TYPES.CARD,
      actionKey: ACTION_KEYS.CONVERT_TASK_TO_CARD,
      data: {
        id: task._id,
        name: task.item,
      },
      card: {
        id: card._id,
        name: task.item,
      },
      checklist: {
        id: checklist._id,
        name: checklist.title,
      },
    })

    res.status(201).send(card)
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

    await cardService.logAction(req, {
      type: ACTIVITY_TYPES.CARD,
      actionKey: ACTION_KEYS.DELETED_CARD,
      data: {
        id: cardId,
        name: card.title,
      },
    })

    res.status(HTTPStatusCode.NoContent).send()
  }

  deleteChecklist = async (req: Request, res: Response) => {
    const { checklistId, cardId } = req.params

    const checklist = await cardService.findChecklistById(checklistId)
    if (!checklist) {
      throw new BadRequestError("Checklist with that id was not found")
    }

    const card = await Card.findByIdAndUpdate(cardId, {
      $pull: { checklists: idToObjectId(checklistId) },
    })

    if (!card) throw new BadRequestError("Card with that id was not found")

    await checklist.delete()
    await card.save()
    res.status(HTTPStatusCode.NoContent).send()
  }

  deleteTask = async (req: Request, res: Response) => {
    const { checklistId, taskId } = req.params

    const task = await cardService.findTaskById(taskId)
    if (!task) {
      throw new BadRequestError("Checklist with that id was not found")
    }

    const checklist = await Checklist.findByIdAndUpdate(checklistId, {
      $pull: { tasks: idToObjectId(taskId) },
    })

    if (!checklist) throw new BadRequestError("Card with that id was not found")

    await task.delete()
    await checklist.save()
    res.status(HTTPStatusCode.NoContent).send()
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
        var attachment = await cardService.findAttachmentById(
          req.body.imageCover
        )

        if (!attachment) throw new BadRequestError("Attachment not found")

        if (req.body.imageCover === attachment._id.toString()) {
          attachment.active = !attachment.active

          await attachment.save()
          card.imageCover = attachment._id

          updatedCard = card
          break
        }

        if (!attachment.active) {
          attachment.active = true
          await attachment.save()
        }

        updatedCard = await Card.findByIdAndUpdate(
          req.params.cardId,
          {
            $set: {
              imageCover: attachment._id,
              coverUrl: { ...card.coverUrl, active: false },
            },
          },
          { new: true }
        )

        break

      case updates.includes("colorCover"):
        if (card?.imageCover) {
          var attachment = await cardService.findAttachmentById(
            card?.imageCover?.toHexString()
          )

          if (attachment?.active) {
            attachment.active = false
            await attachment.save()
          }
        }

        updatedCard = await Card.findByIdAndUpdate(
          req.params.cardId,
          {
            $set: {
              colorCover: req.body.colorCover,
              coverUrl: { ...card.coverUrl, active: false },
            },
          },
          { new: true }
        )

        break

      case updates.includes("coverUrl"):
        if (card?.imageCover) {
          var attachment = await cardService.findAttachmentById(
            card?.imageCover?.toHexString()
          )

          if (attachment?.active) {
            attachment.active = false
            await attachment.save()
          }
        }

        updatedCard = await Card.findByIdAndUpdate(
          req.params.cardId,
          {
            $set: {
              colorCover: "",
              coverUrl: {
                edgeColor: req.body.edgeColor,
                image: req.body.coverUrl,
                active: true,
              },
            },
          },
          { new: true }
        )

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

  updateChecklist = async (req: Request, res: Response) => {
    const { checklistId } = req.body
    if (!checklistId) throw new NotFoundError("Checklist id is required")

    const checklist = await Checklist.findByIdAndUpdate(
      checklistId,
      {
        $set: { ...req.body.update },
      },
      { new: true }
    )
    if (!checklist) throw new NotFoundError("Checklist not found")

    await checklist.save()

    res.status(200).send(checklist)
  }

  updateTask = async (req: Request, res: Response) => {
    const { taskId } = req.body
    if (!taskId) throw new NotFoundError("Task id is required")

    const task = await Task.findByIdAndUpdate(
      taskId,
      {
        $set: { ...req.body.update },
      },
      { new: true }
    )
    if (!task) throw new NotFoundError("Task not found")

    await task.save()

    res.status(200).send(task)
  }
}

export const cardController = new CardController()
