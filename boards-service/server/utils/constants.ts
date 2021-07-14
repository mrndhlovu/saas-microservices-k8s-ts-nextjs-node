import { IRoleOptions } from "./types"

export const allowedBoardUpdateFields: string[] = [
  "accessLevel",
  "activities",
  "archived",
  "category",
  "comments",
  "description",
  "labels",
  "lists",
  "styles",
  "title",
]

export enum ROLES {
  ADMIN = 4,
  BASIC = 3,
  OBSERVER = 2,
  GUEST = 1,
  BLOCKED = 0,
}
