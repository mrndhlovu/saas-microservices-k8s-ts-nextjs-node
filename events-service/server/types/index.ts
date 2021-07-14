import { Application, Request } from "express"
import { ObjectId } from "mongoose"

import { BoardDocument } from "../models/Board"
import { IUserDocument } from "../models/User"
import { ROLES } from "../utils/constants"

export interface IRequestExtended extends Request {
  user: IUserDocument
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
