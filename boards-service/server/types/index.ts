import { Application, Request } from "express"

import { BoardDocument } from "../models/Board"

export interface IRequestExtended extends Request {
  token: string
  board: BoardDocument
}

export type RolesType = "admin" | "basic" | "guest"

export interface IRoleOptions {
  [role: string]: RolesType
}

export interface IConfigTypes {
  port: number
  host: string
  apiUri: string
  authUri: string
}

export interface IProcessEnv {
  [key: string]: string | undefined
}

export interface IExtendedServer extends Application {
  close: any
}

export interface IJwtToken {
  _id: string
}

export interface IBoardRoleJwtToken {
  admin: string
  flag: number
}

export type JWTSignKeyOption = "refresh" | "role" | "access" | "board"

export type EncryptCallbackError = Error | undefined
export type EncryptCallbackPayload = string

export type EncryptCallback = (
  err?: EncryptCallbackError,
  payload?: EncryptCallbackPayload
) => EncryptCallbackPayload | EncryptCallbackError | void
