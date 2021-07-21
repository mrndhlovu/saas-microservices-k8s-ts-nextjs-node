import { NextFunction, Request, Response } from "express"
import { body, validationResult } from "express-validator"

import Board, { BoardDocument, IBoardMember } from "../models/Board"
import {
  authService,
  BadRequestError,
  CustomRequestError,
  PermissionRequestError,
} from "@tuskui/shared"

declare global {
  namespace Express {
    interface Request {
      board: BoardDocument | null | undefined
    }
  }
}

class BoardMiddleware {
  checkActionPermission(requirePermissionFlag: number) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const _id = req.params.boardId
      const userId = req.user._id

      const board = await Board.findOne({ _id })

      if (!board) throw new BadRequestError("Board with that id was not found")

      const existingBoardMember = board.members.find(
        (member: IBoardMember) => member.id === userId
      )

      if (!existingBoardMember) {
        throw new PermissionRequestError()
      }

      const isGrantedPermission = authService.checkResourcePermission(
        requirePermissionFlag,
        existingBoardMember.permissionFlag
      )

      if (!isGrantedPermission) {
        throw new BadRequestError("Permission to make this action was denied.")
      }

      req.board = board
      next()
    }
  }

  checkRequiredBodyFields = [
    body("title").trim().isLength({ min: 2 }).withMessage("Title is required."),
  ]

  validateRequestBodyFields() {
    return async (req: Request, _res: Response, next: NextFunction) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        throw new CustomRequestError(errors.array())
      }

      next()
    }
  }
}

const boardMiddleware = new BoardMiddleware()

export { boardMiddleware }
