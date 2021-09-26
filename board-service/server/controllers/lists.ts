import { Request, Response } from "express"

import {
  ACTION_KEYS,
  ACTION_TYPES,
  BadRequestError,
  HTTPStatusCode,
  NotFoundError,
} from "@tusksui/shared"

import { allowedListUpdateFields } from "../utils/constants"
import { boardService } from "../services"
import { listService } from "../services/list"
import Board from "../models/Board"
import List, { IListDocument } from "../models/List"

declare global {
  namespace Express {
    interface Request {
      list: IListDocument | null | undefined
    }
  }
}

class ListController {
  getList = async (req: Request, res: Response) => {
    const { archived } = req.query
    const isTrue = archived === "true"

    let lists = await List.find({
      boardId: req.params.boardId,
      archived: isTrue,
    })

    res.send(lists)
  }

  getListById = async (req: Request, res: Response) => {
    const list = await listService.findListOnlyById(req.params.listId)

    if (!list) throw new BadRequestError("List with that id was not found")

    res.send(list)
  }

  createList = async (req: Request, res: Response) => {
    const boardId = req.params.boardId

    let list = new List({
      ...req.body,
      boardId,
    })

    const board = await Board.findOneAndUpdate(
      { _id: boardId },
      { $push: { lists: list._id } }
    )

    if (!board) throw new BadRequestError("Failed to create a list")

    await list.save()
    await board.save()

    await listService.logAction(req, {
      type: ACTION_TYPES.LIST,
      actionKey: ACTION_KEYS.CREATE_LIST,
      entities: {
        boardId: board?._id,
        name: board.title,
      },
      list: {
        id: list?._id,
        name: list.title,
      },
    })

    res.status(201).send(list)
  }

  moveList = async (req: Request, res: Response) => {
    const board = await boardService.findBoardOnlyById(req.body.boardId)

    if (!board) throw new NotFoundError("Board id is required")

    await listService.changePosition(board, req.body, req)

    await board.save()

    res.status(HTTPStatusCode.Accepted).send()
  }

  updateList = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body)
    const list = await listService.findListById(req.params.listId)

    if (!list) throw new BadRequestError("List with that id was not found")

    const hasValidFields = listService.validateEditableFields(
      allowedListUpdateFields,
      updates
    )

    if (!hasValidFields) throw new BadRequestError("Invalid update field")

    const updatedList = await List.findOneAndUpdate(
      { _id: list._id },
      { $set: { ...req.body } },
      { new: true }
    )

    if (!updatedList)
      throw new BadRequestError("List with that id was not found")

    await updatedList.save()

    if (updatedList.archived) {
    }

    res.status(200).send(updatedList)
  }

  deleteList = async (req: Request, res: Response) => {
    const { deleteAll } = req.query
    const shouldDeleteAll = deleteAll === "true"

    if (shouldDeleteAll) {
      const lists = await List.find({ boardId: req.params.boardId })

      if (lists?.length < 1)
        throw new BadRequestError("Lists owned by current user where now found")

      const listIds = lists.map((list: IListDocument) => list._id)
      await List.deleteMany({ _id: listIds })

      return res.status(200).send({})
    }
    const list = await listService.findListById(req.params.listId)
    if (!list) throw new BadRequestError("List with that id was not found")

    await list.delete()

    res.status(200).send({})
  }
}

const listController = new ListController()

export { listController }
