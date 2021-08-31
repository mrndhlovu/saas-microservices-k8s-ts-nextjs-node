import { Request, Response } from "express"

import {
  BadRequestError,
  HTTPStatusCode,
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

declare global {
  namespace Express {
    interface Request {
      board: BoardDocument | null | undefined
    }
  }
}

class BoardController {
  getBoardList = async (req: Request, res: Response) => {
    const { archived } = req.query
    const isArchived = Boolean(archived !== "false")

    let boards = await Board.find({
      owner: req.currentUserJwt.userId,
      archived: !isArchived,
    })

    res.send(boards)
  }

  getBoardById = async (req: Request, res: Response) => {
    const board = await boardService.getPopulatedBoard(req.params.boardId)

    res.send(board)
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
    console.log(
      "🚀 ~ file: board.ts ~ line 70 ~ BoardController ~ updateBoard= ~ req",
      req.body
    )

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
