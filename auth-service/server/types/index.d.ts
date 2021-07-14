import { Application, Request } from "express"

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

export type IJwtAuthTokenToSign = IObjectAuthTokenToSign | string

export interface IJwtRefreshTokens {
  access: string
  refresh: string
}

export interface IBoardRoleJwtToken {
  admin: string
  flag: number
}

export type JWTSignKeyOption = "refresh" | "role" | "access"

export type EncryptCallbackError = Error | undefined

export type EncryptCallbackPayload = string

declare global {
  namespace Express {
    interface Request {
      user: IUserDocument
      token: string
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "testing"
      PORT: string
      TOKEN_SIGNATURE: string
      REFRESH_TOKEN_SIGNATURE: string
      BOARD_TOKEN_SIGNATURE: string
      MONGO_DB_URI: string
    }
  }
}
