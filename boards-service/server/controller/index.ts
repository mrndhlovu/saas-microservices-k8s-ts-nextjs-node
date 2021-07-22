import { ObjectID } from "mongodb"
import { Request, Response } from "express"

import { permissionManager, ROLES } from "@tuskui/shared"

import { allowedBoardUpdateFields } from "../utils/constants"
import { boardService } from "../services/board"
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
    let boards = await Board.find({ owner: req.body.userId })
    res.send(boards)
  }

  getBoardById = async (req: Request, res: Response) => {
    const board = await boardService.populatedBoard(req.params.boardId)

    if (!board) throw new Error("Board with that id was not found")

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

    board.save()

    res.status(201).send(board)
  }

  updateBoard = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body)

    const hasValidFields = boardService.validateEditableFields(
      allowedBoardUpdateFields,
      updates
    )

    if (!hasValidFields) throw new Error("Invalid update field")

    updates.forEach(async (update: string) => {
      await req.board!.updateOne({ $set: { [update]: req.body[update] } })
    })

    req.board!.save()

    res.status(200).send(req.board)
  }

  deleteBoard = async (req: Request, res: Response) => {
    req.board!.delete()
    res.status(200).send({ message: "Board deleted" })
  }
}

const boardController = new BoardController()

export { boardController }
