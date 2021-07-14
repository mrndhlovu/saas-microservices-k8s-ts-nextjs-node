import { BoardDocument } from "../../models/Board"

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

declare global {
  namespace Express {
    interface Request {
      token: string
      board: BoardDocument
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production"
      PORT: string
      BOARD_TOKEN_SIGNATURE: string
      MONGO_DB_URI: string
    }
  }
}
