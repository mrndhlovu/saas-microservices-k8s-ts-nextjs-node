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

export interface IProcessEnv {
  [key: string]: string | undefined
}

export interface IExtendedServer extends Application {
  close: any
}
