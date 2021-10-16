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
import { IUploadFile, TemplateList } from "../types"
import { BoardViewedPublisher } from "../events/publishers/board-viewed"
import Workspace from "../models/Workspace"
import { WorkspaceCreatedPublisher } from "../events/publishers/workspace-created"
import { BOARD_TEMPLATES, generateRandomColor } from "../utils/constants"
import { algoliaClient, listService } from "../services"
import List from "../models/List"
import Card from "../models/Card"
import Task from "../models/Task"

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
    const { archived } = req.query

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
      board.lastViewed = Date.now()

      await board.save()

      await new BoardViewedPublisher(natsService.client).publish({
        boardId: board._id,
        userId: board.owner,
      })
    }

    res.send(board)
  }

  getBoardTemplates = async (req: Request, res: Response) => {
    res.send(BOARD_TEMPLATES)
  }

  getAttachmentsByBoardId = async (req: Request, res: Response) => {
    const { boardId } = req.params
    const attachments = await Attachment.find({ boardId })

    res.send(attachments)
  }

  getWorkspaces = async (req: Request, res: Response) => {
    const workspaces = await Workspace.find({
      owner: req.currentUserJwt.userId!,
    })

    res.send(workspaces)
  }

  getWorkspaceById = async (req: Request, res: Response) => {
    const workspace = await Workspace.findOne({
      _id: req.query.workspaceId!,
    })

    res.send(workspace)
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

  updateWorkspace = async (req: Request, res: Response) => {
    const workspaceId = req.params.workspaceId as string

    const updatedWorkspace = await Workspace.findOneAndUpdate(
      { _id: workspaceId },
      { $set: req.body },
      { new: true }
    )

    if (!updatedWorkspace) throw new BadRequestError("Fail to update workspace")

    await updatedWorkspace.save()

    algoliaClient.updateObject({
      objectID: updatedWorkspace?._id,

      workspace: {
        title: req.body?.name,
        description: req.body?.description,
      },
    })

    res.status(200).send(updatedWorkspace)
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
        type: "image",
      },
    })

    res.status(200).send(attachment)
  }

  createWorkspace = async (req: Request, res: Response) => {
    const userId = req.currentUserJwt.userId!

    let workspace = new Workspace({
      ...req.body,
      owner: userId,
      iconColor: generateRandomColor(),
    })

    await workspace.save()

    await new WorkspaceCreatedPublisher(natsService.client).publish({
      ownerId: userId,
      id: workspace?._id.toString(),
    })

    algoliaClient.addObjects([
      {
        objectID: workspace?._id,
        type: "workspace",
        userId: req.currentUserJwt.userId!,
        workspace: {
          title: workspace.name,
          description: workspace?.description!,
          category: workspace?.category,
        },
      },
    ])

    res.status(201).send(workspace)
  }

  createBoard = async (req: Request, res: Response) => {
    const userId = req.currentUserJwt.userId!
    const boardLists: TemplateList[] = req?.body?.templateLists

    let board = new Board({
      ...req.body,
      owner: userId,
      workspaces: req.body?.workspaceId ? [req.body?.workspaceId] : [],
    })

    const updatedBoard = await boardService.updateBoardMemberRole(board!, {
      currentPermFlag: permissionManager.permissions.BLOCKED,
      isNew: true,
      newRole: ROLES.OWNER,
      userId,
    })

    if (!updatedBoard) throw new BadRequestError("Fail to create board")

    if (boardLists) {
      boardLists.map(async item => {
        let list = new List({
          title: item.name,
          boardId: updatedBoard._id.toString(),
        })

        updatedBoard.lists.push(list._id.toString())

        await list.save()

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
      })
    }

    algoliaClient.addObjects([
      {
        objectID: board?._id,
        type: "board",
        userId: req.currentUserJwt.userId!,
        board: {
          title: board.title,
          description: board.description,
        },
      },
    ])

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
        workspace:
          req.body?.workspaceId !== undefined
            ? req.body?.workspaceId
            : "default",
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
    if (!!board?.title || !!board.description) {
      algoliaClient.updateObject({
        objectID: board?._id,
        board: {
          title: updatedBoard.title,
          description: updatedBoard.description,
        },
      })
    }

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

    algoliaClient.removeObjects([boardId])

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

    await boardService.deleteImages([resourceId])

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

  deleteWorkspace = async (req: Request, res: Response) => {
    const { workspaceId } = req.params

    const workspace = await Workspace.findById(workspaceId)
    if (!workspace) throw new NotFoundError("Workspace not found")

    workspace.delete()

    algoliaClient.removeObjects([workspaceId])

    res.status(HTTPStatusCode.NoContent).send()
  }

  search = async (req: Request, res: Response) => {
    const query = req.query.searchQuery as string
    const regex = new RegExp(query, "i")

    const boards = await Board.find({
      $and: [{ $or: [{ title: regex }, { description: regex }] }],
    })

    const workspaces = await Workspace.find({
      $and: [
        { $or: [{ name: regex }, { description: regex }, { category: regex }] },
      ],
    })

    const cards = await Card.find({
      $and: [{ $or: [{ title: regex }, { description: regex }] }],
    })

    const lists = await List.find({
      title: { $regex: query, $options: "i" },
    })

    const tasks = await Task.find({
      item: { $regex: query, $options: "i" },
    })

    res
      .status(HTTPStatusCode.OK)
      .send({ boards, cards, tasks, lists, workspaces })
  }
}

const boardController = new BoardController()

export { boardController }
