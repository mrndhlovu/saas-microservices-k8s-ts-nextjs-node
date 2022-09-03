import { IJwtAccessTokens } from "@tusksui/shared"
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
  accessTokens?: string[]
  refreshTokens?: string[]
  mfaTokens?: string[]
  accessExpiresAt?: string
  refreshExpiresAt?: string
}

export type SignatureType = "refresh" | "access" | "otp"

export type UserAccountStatus =
  | "pending"
  | "blocked"
  | "paused"
  | "archived"
  | "active"

export interface IGenerateTokenOptions {
  expiresIn?: string
  httpOnly?: boolean
  type: SignatureType
}

export interface IGenerateCookieOptions {
  tokens: Pick<IJwtAccessTokens, "access" | "refresh">
  httpOnly?: boolean
}

export type IAuthTypes = "identifier" | "google"

export interface IUpdateUserTokens {
  tokenType: keyof Pick<
    IAuthTokenOptions,
    "accessTokens" | "refreshTokens" | "mfaTokens"
  >
  token: string
}

export type SignatureOptions = {
  [type in SignatureType]: string
}

export interface IBoardMember {
  [id: string]: string | undefined
}
