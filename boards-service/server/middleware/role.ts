import { NextFunction, Request, Response } from "express"

import { IRequestExtended } from "../types"
import Board from "../models/Board"
import { Services } from "../services"

class RoleValidator {
  constructor() {
    this.boardAdmin
  }

  boardAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const _req = req as IRequestExtended
    const _id = req.params.boardId

    const board = await Board.findById(_id)

    if (board) {
      const decodedBoardJwt = Services.board.decodeJwtToken(
        board.admin,
        "board"
      )
      const adminPermissionFlag = decodedBoardJwt.flag
      if (
        !board.owner.equals(decodedBoardJwt.admin) ||
        !Services.role.validateRole(adminPermissionFlag)
      ) {
        throw new Error("Only admin can delete this board.")
      }

      _req.board = board
      next()
    }
    if (!board) {
      if (board === null) throw new Error("Board with that id was not found")
    }
  }
}

export default new RoleValidator()
