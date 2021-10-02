import { Request } from "express"
import { Types } from "mongoose"

import {
  ACTION_KEYS,
  ACTION_TYPES,
  NewActionPublisher,
  NotFoundError,
} from "@tusksui/shared"

import { IActionLogger, natsService } from "."
import { IChangePosition } from "../types"
import { idToObjectId } from "../helpers"
import { listService } from "./list"
import Attachment, { IAttachmentDocument } from "../models/Attachment"
import Board, { BoardDocument } from "../models/Board"
import Card, { CardDocument } from "../models/Card"
import Checklist from "../models/Checklist"
import List from "../models/List"
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

  async changePosition(
    board: BoardDocument,
    options: IChangePosition,
    req: Request
  ) {
    if (options.isSwitchingList) {
      const targetList = await listService.findListById(options.targetListId!)

      if (!targetList) throw new NotFoundError("Target list not found.")

      const card = await this.findCardOnlyById(options.sourceCardId)
      if (!card) throw new NotFoundError("Drag source not found.")

      card.listId = options.targetListId!
      let targetBoard

      if (options.isSwitchingBoard) {
        board.cards.filter(card => card.toString() === options.sourceCardId)

        await board.save()
        targetBoard = await Board.findOneAndUpdate(
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

      await this.logAction(req, {
        type: ACTION_TYPES.CARD,
        actionKey: options?.isSwitchingBoard
          ? ACTION_KEYS.TRANSFER_CARD
          : ACTION_KEYS.MOVE_CARD_TO_LIST,
        entities: {
          boardId: req.body.boardId,
        },
        card: {
          id: options.sourceCardId,
          name: card.title,
        },
        list: {
          id: sourceList._id.toString(),
          name: sourceList.title,
        },
        targetList: {
          id: targetList._id.toString(),
          name: targetList.title,
        },
        targetBoard:
          options.isSwitchingBoard && targetBoard
            ? { id: targetBoard._id.toString(), name: targetBoard.title }
            : undefined,
      })

      return
    }

    var sourceList = await listService.findListById(options.sourceListId!)
    var sourceCard = await this.findCardOnlyById(options.sourceCardId!)
    if (!sourceList || !sourceCard)
      throw new NotFoundError("Source list not found.")

    const cardsCopy = [...sourceList.cards]

    const sourcePosition = cardsCopy.findIndex(
      id => id.toString() === options.sourceCardId
    )

    const targetPosition = cardsCopy.findIndex(
      id => id.toString() === options.targetCardId
    )

    if (sourcePosition === targetPosition) return
    const isMovingUp = sourcePosition > targetPosition

    cardsCopy.splice(sourcePosition, 1)

    const cardId = idToObjectId(options.sourceCardId)

    cardsCopy.splice(targetPosition, 0, cardId!)

    sourceList.cards = cardsCopy
    board.cards = sourceList.cards

    await sourceList.save()
    await board.save()

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

    return
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
