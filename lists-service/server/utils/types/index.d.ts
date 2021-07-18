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

export interface IJwtToken {
  _id: string
}

export interface IBoardRoleJwtToken {
  admin: string
  flag: number
}

export type JWTSignKeyOption = "refresh" | "role" | "access" | "board"

declare global {
  declare global {
    namespace Express {
      interface Request {
        userId: string
      }
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "testing"
      PORT: string
      TOKEN_SIGNATURE: string
      JWT_REFRESH_TOKEN_SIGNATURE: string
      MONGO_DB_URI: string
    }
  }
}
