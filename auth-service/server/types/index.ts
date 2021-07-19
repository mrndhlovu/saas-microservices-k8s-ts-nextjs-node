import { Application } from "express"

import { IUserDocument } from "@tuskui/shared"

export interface IUserJwtPayload {
  user?: IUserDocument
  token: string
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

export interface IExtendedServer extends Application {
  close: any
}

export interface IObjectAuthTokenToSign {
  userId: string
  email: string
}

export interface IJwtRefreshTokens {
  access: string
  refresh: string
}

export interface IBoardRoleJwtToken {
  admin: string
  flag: number
}
