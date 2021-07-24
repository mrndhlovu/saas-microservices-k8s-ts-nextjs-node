import { ObjectID } from "mongodb"
import { Request, Response } from "express"

import { permissionManager, ROLES } from "@tuskui/shared"

import { allowedBoardUpdateFields } from "../utils/constants"
import { BoardByIdPublisher } from "../events/publishers/board-get"
import { BoardCreatedPublisher } from "../events/publishers/board-created"
import { BoardDeletedPublisher } from "../events/publishers/board-deleted"
import { boardService } from "../services/board"
import { BoardUpdatedPublisher } from "../events/publishers/board-updated"
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
    let boards = await Board.find({ owner: req.user.userId })

    const data = boards.map((board: BoardDocument) => ({
      id: board._id,
      title: board.title,
      ownerId: board.owner,
    }))

    new BoardByIdPublisher(natsService.client).publish(data)

    res.send(boards)
  }

  getBoardById = async (req: Request, res: Response) => {
    const board = await boardService.populatedBoard(req.params.boardId)

    if (!board) throw new Error("Board with that id was not found")

    new BoardByIdPublisher(natsService.client).publish({
      id: board._id,
      title: board.title,
      ownerId: board.owner,
    })

    res.send(board)
  }

  createBoard = async (req: Request, res: Response) => {
    const userId = new ObjectID(req.user.userId)

    let board = new Board({
      ...req.body,
      owner: userId,
    })

    board = await boardService.updateBoardMemberRole(board, {
      currentPermFlag: permissionManager.permissions.BLOCKED,
      isNew: true,
      newRole: ROLES.OWNER,
      userId,
    })

    await board.save()

    await new BoardCreatedPublisher(natsService.client).publish({
      id: board._id,
      title: board.title,
      ownerId: board.owner,
    })

    res.status(201).send(board)
  }

  updateBoard = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body)
    let board = req.board!

    const hasValidFields = boardService.validateEditableFields(
      allowedBoardUpdateFields,
      updates
    )

    if (!hasValidFields) throw new Error("Invalid update field")

    const updatedBoard = await Board.findOneAndUpdate(
      { _id: board._id },
      { $set: { ...req.body } },
      { new: true }
    )

    await updatedBoard.save()

    new BoardUpdatedPublisher(natsService.client).publish({
      id: updatedBoard._id.toHexString(),
      title: updatedBoard.title,
      ownerId: updatedBoard.owner.toHexString(),
    })

    res.status(200).send(updatedBoard)
  }

  deleteBoard = async (req: Request, res: Response) => {
    const boardId = req.board!._id
    req.board!.delete()

    new BoardDeletedPublisher(natsService.client).publish({
      id: boardId.toHexString(),
    })

    res.status(200).send({ message: "Board deleted" })
  }
}

const boardController = new BoardController()

export { boardController }
