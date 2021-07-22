import { NextFunction, Request, Response } from "express"
import { body, validationResult } from "express-validator"
import { ObjectID } from "mongodb"

import Board, { BoardDocument, IBoardMember } from "../models/Board"
import {
  authUtils,
  BadRequestError,
  CustomRequestError,
  PermissionRequestError,
  errorService,
  IJwtAuthToken,
} from "@tuskui/shared"
import { boardService } from "../services/board"

const { catchAsyncError } = errorService

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

      const userId = new ObjectID(req.user.userId)

      const board = await Board.findOne({ _id })

      if (!board) throw new BadRequestError("Board with that id was not found")

      const existingBoardMember = board.members.find((member: IBoardMember) =>
        member.id.equals(userId)
      )

      if (!existingBoardMember) {
        throw new PermissionRequestError()
      }

      const isGrantedPermission = authUtils.checkResourcePermission(
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

  checkDuplicateBoards = catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const existingBoard = await boardService.findBoardOnlyByTitle(
        req.body.title.trim()
      )

      if (existingBoard) {
        throw new BadRequestError("Board title should be unique.")
      }

      next()
    }
  )

  validateRequestBodyFields = catchAsyncError(
    async (req: Request, _res: Response, next: NextFunction) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        throw new CustomRequestError(errors.array())
      }

      next()
    }
  )
}

const boardMiddleware = new BoardMiddleware()

export { boardMiddleware }
