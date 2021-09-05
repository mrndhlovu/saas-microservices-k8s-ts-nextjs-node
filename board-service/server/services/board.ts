import { CallbackError } from "mongoose"
import { v2 } from "cloudinary"
import axios from "axios"

import {
  BadRequestError,
  IPermissionType,
  permissionManager,
} from "@tusksui/shared"

import Board, { BoardDocument, IBoardMember } from "../models/Board"
import { idToObjectId } from "../helpers"
import { IUploadFile } from "../types"
import { allowedUploadTypes } from "../utils/constants"

const cloudinary = v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export interface IUpdateBoardMemberOptions {
  currentPermFlag: number
  newRole: IPermissionType
  isNew: boolean
  userId: string
}

class BoardServices {
  updateBoardMemberRole = async (
    board: BoardDocument,
    options: IUpdateBoardMemberOptions
  ) => {
    const boardMember: IBoardMember = {
      id: options.userId,
      permissionFlag: permissionManager.updatePermission(
        options.currentPermFlag,
        options.newRole
      ),
    }

    if (options.isNew) {
      board.members.push(boardMember)

      return board
    }

    const updateBoardRecord = await Board.findById(
      board._id,
      async (err: CallbackError, record: BoardDocument) => {
        if (err) {
          return new BadRequestError("Board not found")
        }

        const existingBoardMember = record?.members.find(
          (member: IBoardMember) => member.id === options.userId
        )
        if (existingBoardMember) {
          record?.members.map((member: IBoardMember) => {
            if (existingBoardMember?.id === member.id) {
              member.permissionFlag = permissionManager.updatePermission(
                member.permissionFlag,
                options.newRole
              )
            }
          })
        } else {
          record?.members.push(boardMember)
        }

        await record.save()

        return record
      }
    )

    return updateBoardRecord
  }

  validatedUpload(files: IUploadFile[]) {
    return files.every(file => allowedUploadTypes.includes(file.extension))
  }

  async upload(files: IUploadFile[]) {
    if (!files.length || !files) throw new BadRequestError("No files attached!")

    const isValidFileType = this.validatedUpload(files)

    if (!isValidFileType)
      throw new BadRequestError(
        `Invalid file type!. Only ${allowedUploadTypes.join("/")} are allowed.`
      )

    const uploadPromises = files.map(file =>
      cloudinary.uploader.upload(file.path, {
        colors: true,
        folder: "trello-clone",
      })
    )

    const response = await Promise.all(uploadPromises)

    // if()

    return response
  }

  getPopulatedBoard = async (boardId: string) => {
    const board = await Board.findOne({
      _id: idToObjectId(boardId),
      archived: false,
    }).populate([
      { path: "lists" },
      {
        path: "cards",
        model: "Card",
        match: { archived: false },
        populate: {
          path: "imageCover",
          model: "Attachment",
        },
      },
    ])

    return board
  }

  async getUnsplash(query: string, pageIndex: number) {
    const IMAGES_EP = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_ACCESS_KEY}&query=${query}&per_page=20&page=${pageIndex}`

    const response = await axios.get(IMAGES_EP)

    return response?.data
  }

  findInvitedBoards(userId: string, invitedBoardList: string[]) {}

  findBoardOnlyByTitle = async (title: string) => {
    const board = await Board.findOne({ title })
    return board
  }

  findBoardOnlyById = async (boardId: string) => {
    const board = await Board.findOne({ _id: boardId })

    if (!board) throw new BadRequestError("Board with that id was not found")

    return board
  }

  validateEditableFields = <T>(allowedFields: T[], updates: T[]) => {
    return updates.every((update: T) => allowedFields.includes(update))
  }
}

const boardService = new BoardServices()

export { boardService }
