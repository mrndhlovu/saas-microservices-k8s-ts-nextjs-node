import { Request, Response } from "express"

import {
  BadRequestError,
  HTTPStatusCode,
  NotFoundError,
  permissionManager,
  ROLES,
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
    }).populate([
      { path: "lists" },
      {
        path: "cards",
        model: "Card",
        match: { archived: false },
      },
    ])

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
    })

    await attachment.save()

    board.prefs.image = data.url

    await board.save()

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

    res.status(200).send({})
  }

  deleteBoard = async (req: Request, res: Response) => {
    const board = req.board!

    const boardId = board._id

    new BoardDeletedPublisher(natsService.client).publish({
      id: boardId.toHexString(),
      ownerId: req.currentUserJwt.userId!,
    })

    await board.delete()

    res.status(HTTPStatusCode.NoContent).send()
  }
}

const boardController = new BoardController()

export { boardController }
