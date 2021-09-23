import { Request, Response } from "express"

import {
  BadRequestError,
  HTTPStatusCode,
  NotFoundError,
  permissionManager,
  ROLES,
  ACTION_TYPES,
  ACTION_KEYS,
} from "@tusksui/shared"

import { boardService } from "../services/board"
import {
  BoardDeletedPublisher,
  BoardCreatedPublisher,
} from "../events/publishers"
import { natsService } from "../services/nats"
import Board, { BoardDocument } from "../models/Board"
import Attachment from "../models/Attachment"
import { IUploadFile } from "../types"
import { BoardViewedPublisher } from "../events/publishers/board-viewed"

declare global {
  namespace Express {
    interface Request {
      board: BoardDocument | null | undefined
      uploadFiles?: IUploadFile[]
    }
  }
}

class BoardController {
  getBoardList = async (req: Request, res: Response) => {
    const { archived, populate } = req.query

    const isArchived = Boolean(archived !== "false")

    const boards = await Board.find({
      owner: req.currentUserJwt.userId,
      archived: !isArchived,
    }).populate({
      path: "lists",
      match: {
        archived: { $ne: true },
      },
      populate: {
        path: "cards",
        model: "Card",
        match: { archived: { $ne: true } },
      },
    })

    res.send(boards)
  }

  getBoardById = async (req: Request, res: Response) => {
    const board = await boardService.getPopulatedBoard(req.params.boardId)

    if (board) {
      await new BoardViewedPublisher(natsService.client).publish({
        boardId: board._id,
        userId: board.owner,
      })
    }

    res.send(board)
  }

  getAttachmentsByBoardId = async (req: Request, res: Response) => {
    const { boardId } = req.params
    const attachments = await Attachment.find({ boardId })

    res.send(attachments)
  }

  getUnsplashImages = async (req: Request, res: Response) => {
    const { pageIndex = "1", query = "nature", perPage = "20" } = req.query

    const images = await boardService.getUnsplash(
      query as string,
      +pageIndex,
      +perPage
    )

    res.send(images)
  }

  uploadBgImage = async (req: Request, res: Response) => {
    const { boardId } = req.params
    if (!boardId) throw new NotFoundError("Board id is required")
    const board = await boardService.findBoardOnlyById(boardId)

    if (!board) throw new NotFoundError("Board not found")

    const result = await boardService.upload(req.uploadFiles!)
    const data = result[0]

    const attachment = new Attachment({
      url: data.url,
      height: data.height,
      width: data.width,
      edgeColor: data?.colors[0]?.[0],
      active: true,
      boardId: board._id,
      title: data.original_filename,
      resourceId: data.public_id,
      resourceType: data.resource_type,
    })

    await attachment.save()

    board.prefs.image = data.url

    await board.save()

    await boardService.logAction(req, {
      type: ACTION_TYPES.CARD,
      actionKey: ACTION_KEYS.ADD_CARD_ATTACHMENT,
      entities: {
        boardId: board._id.toString(),
      },

      attachment: {
        id: attachment._id.toString(),
        url: data?.url,
        name: data?.original_filename,
      },
    })

    res.status(200).send(attachment)
  }

  createBoard = async (req: Request, res: Response) => {
    const userId = req.currentUserJwt.userId!

    let board = new Board({ ...req.body, owner: userId })

    const updatedBoard = await boardService.updateBoardMemberRole(board!, {
      currentPermFlag: permissionManager.permissions.BLOCKED,
      isNew: true,
      newRole: ROLES.OWNER,
      userId,
    })

    if (!updatedBoard) throw new BadRequestError("Fail to create board")

    await updatedBoard.save()

    await new BoardCreatedPublisher(natsService.client).publish({
      id: updatedBoard._id,
      ownerId: updatedBoard.owner,
    })

    await boardService.logAction(req, {
      type: ACTION_TYPES.BOARD,
      actionKey: ACTION_KEYS.CREATE_BOARD,
      entities: {
        boardId: board._id,
        name: board.title,
      },
    })

    res.status(201).send(updatedBoard)
  }

  updateBoard = async (req: Request, res: Response) => {
    let board = req.board!

    const updatedBoard = await Board.findOneAndUpdate(
      { _id: board._id },
      { $set: req.body },
      { new: true }
    ).populate([
      {
        path: "lists",
        match: { archived: false },
      },
    ])

    if (!updatedBoard) throw new BadRequestError("Fail to update board")

    await updatedBoard.save()

    res.status(200).send(updatedBoard)
  }

  archiveBoard = async (req: Request, res: Response) => {
    const board = req.board!
    board.archived = true

    board.save()

    await boardService.logAction(req, {
      type: ACTION_TYPES.BOARD,
      actionKey: ACTION_KEYS.ARCHIVED_BOARD,
      entities: {
        boardId: board._id.toString(),
        name: board.title,
      },
    })

    res.status(HTTPStatusCode.NoContent).send()
  }

  deleteBoard = async (req: Request, res: Response) => {
    const board = req.board!

    const boardId = board._id.toString()
    const title = board.title

    new BoardDeletedPublisher(natsService.client).publish({
      id: boardId.toString(),
      ownerId: req.currentUserJwt.userId!,
    })

    await board.delete()

    await boardService.logAction(req, {
      type: ACTION_TYPES.BOARD,
      actionKey: ACTION_KEYS.DELETED_BOARD,
      entities: {
        boardId,
        name: title,
      },
    })

    res.status(HTTPStatusCode.NoContent).send()
  }

  deleteAttachment = async (req: Request, res: Response) => {
    const { attachmentId } = req.params

    const attachment = await Attachment.findById(attachmentId)
    if (!attachment) throw new NotFoundError("Attachment not found")

    const id = attachment._id.toString()
    const name = attachment.title
    const resourceId = attachment.resourceId
    const boardId = attachment.boardId.toString()

    attachment.delete()

    const deleteResponse = await boardService.deleteImages([resourceId])

    await boardService.logAction(req, {
      type: ACTION_TYPES.BOARD,
      actionKey: ACTION_KEYS.REMOVE_CARD_ATTACHMENT,
      entities: {
        boardId,
      },
      attachment: {
        id,
        name,
      },
    })

    res.status(HTTPStatusCode.NoContent).send()
  }
}

const boardController = new BoardController()

export { boardController }
