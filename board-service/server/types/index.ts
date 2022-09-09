import { Types } from "mongoose"

export interface IMoveCardOptions {
  newListId?: string
  newBoardId?: string
  sourceListId: string
  sourceIndex: number
  destinationCardId: string
  cardId: string
}

export interface IUploadFile {
  name: string
  size: number
  type: string
  extension: string
  content: ArrayBuffer
  path: string
}

export interface IRemoveRecordIdOptions {
  [key: string]: { $in: Types.ObjectId[] }
}

export interface IUploadedFile {
  path: string
}

export interface IFileUpload {
  upload: (files: IUploadFile[]) => Promise<IUploadedFile[]>
}

export interface IFileUploader {
  upload: (
    files: File | File[]
  ) => Promise<IUploadedFile | IUploadedFile[] | undefined>
}

export enum activeBoardBg {
  COLOR = "color",
  IMAGE = "image",
}

export enum TASK_STATUS {
  TODO = "todo",
  DONE = "complete",
}

export interface TemplateList {
  name: string
}

export interface INewWorkspaceProps {
  category: string
  owner: string
  name: string
  iconColor: string
}

export interface IFindWorkspaceProps {
  category: string
  ownerId: string
}
