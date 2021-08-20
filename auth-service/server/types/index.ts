import { Application } from "express"

import { IUserDocument } from "../models/User"

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
  refresh?: string
}

export interface IBoardRoleJwtToken {
  admin: string
  flag: number
}

export interface IJwtTokensExpiryTimes {}

export type JWTSignKeyOption = "refresh" | "role" | "access"

export interface IJwtAuthToken {
  userId: string
  email: string
}

export interface IPendingMfaCredentials {
  identifier: string
  password: string
}

export interface IAuthTokenOptions {
  accessToken?: string
  refreshTokenId?: string
  accessExpiresAt?: string
  refreshExpiresAt?: string
  isRefreshingToken?: boolean
}
