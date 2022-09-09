import {
  ACTION_KEYS,
  ACTION_TYPES,
  BadRequestError,
  HTTPStatusCode,
  NotFoundError,
} from "@tusksui/shared"
import { Request, Response } from "express"
import { idToObjectId } from "../helpers"
import Attachment from "../models/Attachment"
import Board, { BoardDocument } from "../models/Board"

import { allowedCardUpdateFields } from "../utils/constants"
import { algoliaClient, boardService } from "../services"
import { cardService } from "../services/card"
import { IUploadFile, TASK_STATUS } from "../types"
import Card, { CardDocument } from "../models/Card"
import Checklist from "../models/Checklist"
import Label from "../models/Label"
import List from "../models/List"
import Task from "../models/Task"

declare global {
  namespace Express {
    interface Request {
      uploadFiles?: IUploadFile[]
      board?: BoardDocument | null
    }
    namespace MulterS3 {
      interface File extends Multer.File {
        bucket: string
        key: string
        acl: string
        contentType: string
        contentDisposition: null
        storageClass: string
        serverSideEncryption: null
        metadata: any
        location: string
        etag: string
      }
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
    const { title } = req.body

    const card = new Card({ title, listId, boardId })
    const list = await List.findById(listId)
    if (!card || !list) throw new BadRequestError("Card failed to create card.")

    const board = await Board.findOneAndUpdate(
      { _id: boardId },
      { $push: { cards: card._id } }
    )

    if (!board) {
      throw new BadRequestError(
        "Card should be linked to a valid board and list"
      )
    }

    await card.save()

    await board.save()

    await cardService.logAction(req, {
      type: ACTION_TYPES.CARD,
      actionKey: ACTION_KEYS.CREATE_CARD,
      entities: {
        boardId,
        name: title,
      },
      list: {
        id: list?.id,
        name: list.title,
      },
      card: {
        id: card._id,
        name: card.title,
      },
    })

    algoliaClient.addObjects([
      {
        objectID: card?._id.toString(),
        type: "card",
        userId: req.currentUserJwt.userId!,
        card: {
          title: card.title,
          description: card?.description,
          boardId,
        },
      },
    ])

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
      type: ACTION_TYPES.CARD,
      actionKey: ACTION_KEYS.ADD_CHECKLIST,
      entities: {
        boardId: card.boardId.toString(),
      },
      card: {
        id: cardId,
        name: card.title,
      },
      checklist: {
        id: checklist._id,
        name: checklist.title,
      },
    })

    algoliaClient.addObjects([
      {
        objectID: checklist?._id.toString(),
        type: "checklist",
        userId: req.currentUserJwt.userId!,
        checklist: {
          title: checklist.title,
          cardId,
        },
      },
    ])

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
    if (checklist.hideComplete) {
      checklist.hideComplete = false
    }

    if (checklist.complete) {
      checklist.complete = false
    }

    await checklist.save()
    await task.save()

    algoliaClient.addObjects([
      {
        objectID: checklist?._id.toString(),
        type: "task",
        userId: req.currentUserJwt.userId!,
        task: {
          title: task.item,
          checklistId,
        },
      },
    ])

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
      type: ACTION_TYPES.CARD,
      actionKey: ACTION_KEYS.CONVERT_TASK_TO_CARD,
      entities: {
        boardId: board._id,
        name: board.title,
      },
      card: {
        id: card._id,
        name: task.item,
      },
      checklist: {
        id: checklist._id,
        name: checklist.title,
      },
      task: {
        id: task._id,
        name: task.item,
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
      type: ACTION_TYPES.CARD,
      actionKey: ACTION_KEYS.DELETED_CARD,
      entities: {
        boardId: card.boardId.toString(),
      },
      card: {
        id: cardId,
        name: card.title,
      },
    })

    algoliaClient.removeObjects([cardId])

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

    algoliaClient.removeObjects([checklistId])

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
    algoliaClient.removeObjects([taskId])

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
      boardId: card.boardId,
      title: data.original_filename,
      resourceId: data.public_id,
      resourceType: data.resource_type,
    })

    await attachment.save()

    card.imageCover = attachment._id

    await card.save()

    await cardService.logAction(req, {
      type: ACTION_TYPES.CARD,
      actionKey: ACTION_KEYS.ADD_CARD_ATTACHMENT,
      entities: {
        boardId: card.boardId.toString(),
      },
      card: {
        id: card._id.toString(),
        name: card.title,
      },
      attachment: {
        id: attachment._id.toString(),
        url: data?.url,
        name: data?.original_filename,
        type: data.format,
      },
    })

    algoliaClient.addObjects([
      {
        objectID: attachment?._id.toString(),
        type: "attachment",
        userId: req.currentUserJwt.userId!,
        attachment: {
          boardId: card.boardId.toString(),
          title: data.original_filename,
          resourceType: data.resource_type,
          imageUrl: data?.url,
        },
      },
    ])

    res.status(200).send(attachment)
  }

  async updateAttachment(req: Request, res: Response) {
    const attachment = await Attachment.findByIdAndUpdate(
      req.params.attachmentId,
      { $set: { title: req.body.title } },
      { new: true }
    )

    algoliaClient.updateObject({
      objectID: attachment?._id.toString(),
      attachment: {
        title: req.body.title,
      },
    })

    res.status(200).send(attachment)
  }

  addLinkAttachment = async (req: Request, res: Response) => {
    const { cardId } = req.params
    if (!cardId) throw new NotFoundError("Card id query string required")

    const card = await cardService.findCardOnlyById(cardId as string)
    if (!card) throw new NotFoundError("Card not found")

    const attachment = new Attachment({
      cardId: card._id,
      url: req.body.link,
      boardId: card.boardId,
      title: req.body?.name,
      resourceId: card._id.toString(),
      resourceType: "link",
    })

    await attachment.save()
    await card.save()

    await cardService.logAction(req, {
      type: ACTION_TYPES.CARD,
      actionKey: ACTION_KEYS.ADD_CARD_ATTACHMENT,
      entities: {
        boardId: card.boardId.toString(),
      },
      card: {
        id: card._id.toString(),
        name: card.title,
      },
      attachment: {
        id: attachment._id.toString(),
        url: req.body?.link,
        name: req.body?.name,
        type: "link",
      },
    })

    res.status(200).send(attachment)
  }

  uploadAttachment = async (req: Request, res: Response) => {
    const { cardId } = req.params

    if (!cardId) throw new NotFoundError("Card id query string required")

    const card = await cardService.findCardOnlyById(cardId as string)
    if (!card) throw new NotFoundError("Card not found")
    const attachments = await cardService.saveUploadFiles(req, card)

    res.status(200).send(attachments)
  }

  deleteAttachment = async (req: Request, res: Response) => {
    const { attachmentId } = req.params

    const attachment = await Attachment.findOne({ _id: attachmentId })
    if (!attachment)
      throw new NotFoundError("Attachment with that id was not found")

    const cardId = attachment.cardId.toString()
    const boardId = attachment.boardId.toString()
    const name = attachment.title

    await attachment.delete()

    await cardService.logAction(req, {
      type: ACTION_TYPES.CARD,
      actionKey: ACTION_KEYS.REMOVE_CARD_ATTACHMENT,
      entities: {
        boardId,
      },
      attachment: {
        id: attachmentId,
        name,
      },
    })

    algoliaClient.removeObjects([attachmentId])

    res.status(HTTPStatusCode.OK).send()
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
    const board = req.board!
    const { newBoardId, newListId } = req.body

    if (!board) throw new NotFoundError("Board id is required")

    switch (true) {
      case Boolean(newListId):
        await cardService.moveToNewList(board, req.body, req)
        break

      case Boolean(newBoardId):
        break

      default:
        await cardService.moveCard(board, req.body, req)
        break
    }

    const updateBoard = await boardService.getPopulatedBoard(
      board?.id,
      req.currentUserJwt?.userId
    )

    // await board.save()

    res.status(HTTPStatusCode.Accepted).send(updateBoard)
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
            card?.imageCover?.toString()
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
            card?.imageCover?.toString()
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

    algoliaClient.updateObject({
      objectID: cardRecord?._id.toString(),
      card: {
        title: updatedCard.title,
      },
    })

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

    algoliaClient.updateObject({
      objectID: checklist?._id.toString(),
      checklist: {
        title: checklist.title,
      },
    })

    await checklist.save()

    res.status(200).send(checklist)
  }

  updateTask = async (req: Request, res: Response) => {
    const { taskId } = req.body
    if (!taskId) throw new NotFoundError("Task id is required")
    let allTasksComplete = false

    const task = await Task.findByIdAndUpdate(
      taskId,
      {
        $set: { ...req.body.update },
      },
      { new: true }
    )
    if (!task) throw new NotFoundError("Task not found")
    await task.save()

    if (req.body.update.state) {
      const checklist = await Checklist.findById(task.checklist)

      if (checklist) {
        const tasks = await Task.find({ _id: [...checklist.tasks] })

        allTasksComplete = tasks.every(task => task.state === TASK_STATUS.DONE)

        checklist.complete = allTasksComplete

        await checklist.save()
      }
    }

    if (req.body.update) {
      algoliaClient.updateObject({
        objectID: task?._id.toString(),
        task: {
          title: task.item,
        },
      })
    }

    res.status(200).send({ task, allTasksComplete })
  }
}

export const cardController = new CardController()
