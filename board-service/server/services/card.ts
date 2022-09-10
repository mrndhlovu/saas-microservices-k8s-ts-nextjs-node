import { Request } from "express"
import { Types } from "mongoose"

import {
  ACTION_KEYS,
  ACTION_TYPES,
  NewActionPublisher,
  NotFoundError,
} from "@tusksui/shared"
import { IActionLogger, natsService } from "."
import { IMoveCardOptions } from "../types"
import { idToObjectId } from "../helpers"
import { listService } from "./list"
import Attachment, { IAttachmentDocument } from "../models/Attachment"
import Board, { BoardDocument } from "../models/Board"
import Card, { CardDocument } from "../models/Card"
import Checklist from "../models/Checklist"
import Task from "../models/Task"

export type ResourceProps = {
  id: string
  name: string
  [key: string]: any
}

export interface IActionLoggerWithCardAndListOptions extends IActionLogger {
  card?: ResourceProps
  list?: ResourceProps
  targetList?: ResourceProps
  checklist?: ResourceProps
  task?: ResourceProps
  targetBoard?: ResourceProps
  attachment?: ResourceProps
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

  async saveUploadFiles(req: Request, card: CardDocument) {
    const uploadedFiles = req.files as Express.MulterS3.File[]

    const attachments: IAttachmentDocument[] = []
    const actions: IActionLoggerWithCardAndListOptions[] = []

    const recordPromises = uploadedFiles?.map(async file => {
      const attachment = new Attachment({
        cardId: card._id,
        url: file.location,
        boardId: card.boardId,
        title: file.originalname,
        resourceId: file.etag,
        resourceType: file.originalname.split(".")?.[1],
      })

      await attachment.save()
      attachments.push(attachment)

      const action = {
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
          url: file.location,
          name: file.originalname,
          type: file.originalname.split(".")?.[1],
        },
      }

      actions.push(action)
      await this.logAction(req, action)
    })

    await Promise.all(recordPromises)

    return attachments
  }

  async moveToAnotherBoard(board: BoardDocument, options: IMoveCardOptions) {
    const card = await this.findCardById(options.cardId)

    if (!card) throw new NotFoundError("Card not found")
    const filteredCards = board.cards.filter(
      card => card.toString() === options.cardId
    )
    board.cards = filteredCards

    const targetBoard = await Board.findOne({ _id: options.newBoardId })

    if (!targetBoard) throw new NotFoundError("Target board not found")

    const destinationIndex = targetBoard.cards.findIndex(
      id => id.toString() === options?.destinationCardId!
    )

    targetBoard.cards.splice(destinationIndex, 0, card._id)
    card.boardId = idToObjectId(options.newBoardId!)
    card.listId = options.targetListId!

    await card.save()
    await board.save()
    await targetBoard!.save()
  }

  async moveToNewList(
    board: BoardDocument,
    options: IMoveCardOptions,
    req: Request
  ) {
    const sourceCard = await this.findCardOnlyById(options.cardId)
    if (!sourceCard) throw new NotFoundError("Dragging card not found.")

    const cards = [...board.cards]
    const cardId = idToObjectId(options.cardId)

    const sourceCardIndex = cards.findIndex(
      id => id.toString() === options.cardId
    )
    const destinationIndex = cards.findIndex(
      id => id.toString() === options.destinationCardId!
    )

    cards.splice(sourceCardIndex, 1)

    cards.splice(destinationIndex === -1 ? 0 : destinationIndex, 0, cardId)

    board.cards = cards
    sourceCard.listId = options.newListId!

    await sourceCard.save()

    await board.save()

    const isMovingUp = sourceCardIndex > destinationIndex

    await this.logAction(req, {
      type: ACTION_TYPES.CARD,
      actionKey: isMovingUp
        ? ACTION_KEYS.MOVE_CARD_UP
        : ACTION_KEYS.MOVE_CARD_DOWN,
      entities: {
        boardId: req.body.boardId,
      },
      card: {
        name: sourceCard.title,
        id: sourceCard?._id.toString(),
      },
    })
  }

  async moveCard(
    board: BoardDocument,
    options: IMoveCardOptions,
    req: Request
  ) {
    const sourceList = await listService.findListById(options.sourceListId!)

    if (!sourceList) throw new NotFoundError("Source list not found.")

    const card = await this.findCardOnlyById(options.cardId)

    if (!card) throw new NotFoundError("Drag source not found.")

    const sourceListCards = [...board.cards]
    const cardId = idToObjectId(options.cardId)

    const cardIndex = sourceListCards.findIndex(
      id => id.toString() === options.cardId
    )
    const destinationIndex = sourceListCards.findIndex(
      id => id.toString() === options?.destinationCardId!
    )

    sourceListCards.splice(cardIndex, 1)
    sourceListCards.splice(
      destinationIndex === -1 ? 0 : destinationIndex,
      0,
      cardId
    )

    board.cards = sourceListCards

    await board.save()

    await this.logAction(req, {
      type: ACTION_TYPES.CARD,
      actionKey: Boolean(options?.newBoardId)
        ? ACTION_KEYS.TRANSFER_CARD
        : ACTION_KEYS.MOVE_CARD_TO_LIST,
      entities: {
        boardId: req.body.boardId,
      },
      card: {
        id: options.cardId,
        name: card.title,
      },
      list: {
        id: sourceList._id.toString(),
        name: sourceList.title,
      },
      targetList: {
        id: sourceList._id.toString(),
        name: sourceList.title,
      },
      targetBoard: { id: options.newBoardId || "", name: board.title },
    })
  }

  async logAction(req: Request, options: IActionLoggerWithCardAndListOptions) {
    await new NewActionPublisher(natsService.client).publish({
      type: options.type,
      userId: req.currentUserJwt.userId!,
      actionKey: options.actionKey,
      entities: {
        ...options.entities,
        card: options.card,
        list: options?.list,
        checklist: options?.checklist,
        task: options?.task,
        targetList: options?.targetList,
        attachment: options?.attachment,
        targetBoard: options?.targetBoard,
      },
    })
  }
}

export const cardService = new CardServices()
