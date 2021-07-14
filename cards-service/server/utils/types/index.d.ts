import { Application, Request } from "express"

export interface IRequestExtended extends Request {
  [key: string]: any
}

export interface IConfigTypes {
  port: number
  host: string
  apiUri: string
  authUri: string
}

declare global {
  namespace Express {
    interface Request {}
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "testing"
      PORT: string
      MONGO_DB_URI: string
    }
  }
}
