import { ObjectID } from "mongodb"
import { Request, Response } from "express"

import { allowedBoardUpdateFields, ROLES } from "../utils/constants"
import { Services } from "../services"
import Board from "../models/Board"

class BoardController {
  getBoardList = async (req: Request, res: Response) => {
    let boards = await Board.find({ owner: req.body.userId })
    res.send(boards)
  }

  getBoardById = async (req: Request, res: Response) => {
    const board = await Services.board.populatedBoard(req.params.boardId)

    if (!board) throw new Error("Board with that id was not found")

    res.send(board)
  }

  createBoard = async (req: Request, res: Response) => {
    const userId = req.body.userId

    let board = new Board({
      ...req.body,
      owner: userId,
      members: [userId],
    })

    board = await Services.board.assignBoardRole(ROLES.ADMIN, userId, board)

    board.save()

    res.status(201).send(board)
  }

  updateBoard = async (req: Request, res: Response) => {
    const _id = new ObjectID(req.params.boardId)

    const updates = Object.keys(req.body)

    const hasValidFields = Services.board.validateEditableFields(
      allowedBoardUpdateFields,
      updates
    )

    if (!hasValidFields) throw new Error("Invalid update field")

    const board = await Services.board.populatedBoard(_id)

    if (!board) throw new Error("Board with that id was not found")

    updates.forEach(async (update: string) => {
      await board.updateOne({ $set: { [update]: req.body[update] } })
    })

    board.save()

    res.status(200).send(board)
  }

  deleteBoard = async (req: Request, res: Response) => {
    req.board.delete()
    res.status(200).send({ message: "Board deleted" })
  }
}

export default new BoardController()
