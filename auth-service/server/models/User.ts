import isEmail from "validator/lib/isEmail"
import { ObjectId } from "mongodb"
import { Schema, Document, model } from "mongoose"

import { authService } from "../services/auth"
import { IJwtAccessTokens } from "../types"
import { IAccountCreatedEvent } from "@tusksui/shared"

const UserSchema: Schema<IUserDocument> = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      trim: true,
      minlength: 4,
      unique: true,
    },
    firstname: {
      type: String,
      trim: true,
      minlength: 4,
    },
    lastname: {
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
      type: [{ type: Schema.Types.ObjectId, ref: "Board" }],
      required: true,
      default: [],
    },
    accountId: {
      type: String,
    },
    permissionFlag: {
      type: Number,
      required: true,
      default: 0,
    },
    initials: {
      type: String,
    },
    starred: {
      type: [{ type: String }],
      required: true,
      default: [],
    },
    viewedRecent: {
      type: [{ type: String }],
      required: true,
      default: [],
    },
    loginTypes: {
      type: Array,
      default: [],
      required: true,
    },
    multiFactorAuth: {
      type: Boolean,
      default: false,
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

    tokens: {
      type: Object,
      default: {
        access: String,
        refresh: String,
        mfa: String,
      },
    },
    account: {
      type: Object,
    },
    twoStepRecovery: {
      type: Object,
      default: {
        token: String,
        setupDate: Date,
      },
    },
    resetPassword: {
      type: Object,
      default: {
        token: String,
        expiresAt: Date,
      },
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
    transform: function (_doc, ret, _options) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      delete ret.tokens
      delete ret.password
      return ret
    },
  })

  return userObject
}

UserSchema.virtual("fullName").get(function (this: IUserAttributes) {
  if (!this.firstname) return ""
  return `${this.firstname} ${this.lastname || ""}`
})

UserSchema.pre("save", function (next) {
  const saltRounds = 12

  if (!this.isModified("password")) return next()

  authService.encryptUserPassword(this, this.password, saltRounds, next)
})

UserSchema.pre("save", function (next) {
  if (this.firstname && this.lastname) {
    const fNameInitial = this.firstname?.substring(0, 1)
    const lNameInitial = this.lastname?.substring(0, 1)

    this.initials = `${fNameInitial}${lNameInitial}`.toUpperCase()
  } else {
    this.initials = this.username?.substring(0, 2).toUpperCase()
  }

  next()
})

interface IUseBoardRoles {
  [key: string]: ObjectId[]
}

type ILoginTypes = "email" | "username"

type IRecoveryToken = {
  token: string
  setupDate: string
}

export interface IUserAttributes {
  avatar?: string
  bio?: string
  email: string
  firstname?: string
  initials?: string
  lastname?: string
  loginTypes: ILoginTypes[]
  password: string
  account: IAccountCreatedEvent["data"]
  boardIds: string[]
  resetPasswordExpires?: string
  resetPasswordToken?: string
  roles: IUseBoardRoles[]
  starred?: string[]
  tokens: IJwtAccessTokens
  username: string
  viewedRecent?: string[]
  multiFactorAuth: boolean
  permissionFlag: Number
  twoStepRecovery: IRecoveryToken
}

export interface IUserDocument extends IUserAttributes, Document {
  _id: ObjectId
}

export const User = model<IUserDocument>("User", UserSchema)
