import { IRoleOptions } from "../types"

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

export const editableUserFields = [
  "firstname",
  "lastname",
  "email",
  "password",
  "starred",
  "username",
  "avatar",
  "bio",
  "viewedRecent",
  "notifications",
]

export enum ROLES {
  ADMIN = 4,
  BASIC = 3,
  OBSERVER = 2,
  GUEST = 1,
  BLOCKED = 0,
}

export enum PermissionFlag {
  BLOCKED_PERMISSION = 0,
  TRIAL_PERMISSION = 1,
  FREE_PERMISSION = 2,
  BASIC_PERMISSION = 3,
  FULL_PERMISSION = 4,
  ADMIN_PERMISSION = 8,
  ALL_PERMISSIONS = 2147483647,
}
