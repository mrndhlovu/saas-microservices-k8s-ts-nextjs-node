import isEmail from "validator/lib/isEmail"
import { Schema, Document, model, Types } from "mongoose"
import { IAccountCreatedEvent } from "@tusksui/shared"
import { PasswordManager } from "../services/password"
import { IAuthTokenOptions, IAuthTypes, UserAccountStatus } from "../types"

const UserSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      lowercase: true,
      trim: true,
      minlength: 4,
      unique: true,
    },
    firstName: {
      type: String,
      trim: true,
      minlength: 4,
    },
    lastName: {
      type: String,
      trim: true,
      minlength: 4,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value: string) {
        if (!isEmail(value)) throw new Error("Email is invalid")
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (value.toLowerCase().includes("password"))
          throw new Error(`Password should not include the word 'password'`)
      },
    },
    boardIds: {
      type: [String],
      required: true,
      default: [],
    },
    workspaces: {
      type: [String],
      required: true,
      default: [],
    },
    starredBoards: {
      type: [String],
      required: true,
      default: [],
    },
    permissionFlag: {
      type: Number,
      required: true,
      default: 0,
    },
    initials: {
      type: String,
    },
    viewedRecent: {
      type: [{ type: String }],
      required: true,
      default: [],
    },
    avatar: {
      type: Array,
      required: true,
      default: [],
    },
    bio: {
      type: String,
      trim: true,
      minlength: 4,
    },
    account: {
      type: Object,
      default: {},
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "pending",
    },
    authType: {
      type: String,
    },
    authTokens: {
      type: [String],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

UserSchema.methods.toJSON = function () {
  const userObject = this.toObject({
    transform: function (_doc: IUserDocument, ret: IUserDocument) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      delete ret.password
      return ret
    },
  })

  return userObject
}

UserSchema.pre("validate", async function (next) {
  if (this.isModified("password")) {
    const hash = await PasswordManager.encrypt(this.get("password"))
    this.set("password", hash)
  }

  if (this.isNew) {
    if (this.firstName && this.lastName) {
      const fNameInitial = this.firstName?.substring(0, 1)
      const lNameInitial = this.lastName?.substring(0, 1)

      this.initials = `${fNameInitial}${lNameInitial}`.toUpperCase()
    } else {
      this.initials = this.username?.substring(0, 2).toUpperCase()
    }
  }

  next()
})

UserSchema.virtual("fullName").get(function (this: IUserDocument) {
  if (!this.firstName) return ""
  return `${this.firstName} ${this.lastName || ""}`
})

interface IUseBoardRoles {
  [key: string]: Types.ObjectId[]
}

export interface IUserDocument extends Document {
  avatar?: string
  bio?: string
  email: Readonly<string>
  firstName?: string
  initials?: string
  lastName?: string
  password?: string
  account: IAccountCreatedEvent["data"]
  boardIds: string[]
  workspaces: string[]
  roles: IUseBoardRoles[]
  username: string
  viewedRecent?: string[]
  authType: IAuthTypes
  permissionFlag: number
  isVerified: boolean
  status: UserAccountStatus
  authTokens: string[]
  starredBoards: string[]
}

export const User = model<IUserDocument>("User", UserSchema)
