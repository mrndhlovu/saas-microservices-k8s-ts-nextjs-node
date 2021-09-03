export interface IChangePosition {
  sourceCardId: string
  targetCardId: string
  sourceListId?: string
  targetListId?: string
  boardId?: string
  isSwitchingList?: boolean
}

export interface IUploadFile {
  name: string
  size: number
  type: string
  extension: string
  content: ArrayBuffer
  path: string
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
