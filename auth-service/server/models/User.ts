import isEmail from "validator/lib/isEmail"
import { Schema, Document, model, Types } from "mongoose"
import { IAccountCreatedEvent, IJwtAccessTokens } from "@tusksui/shared"
import { PasswordManager } from "../services/password"
import { UserAccountStatus } from "../types"

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
        mfa: String,
        refresh: {
          type: Schema.Types.ObjectId,
          ref: "Token",
        },
      },
    },
    account: {
      type: Object,
      default: {},
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
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "pending",
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

type IRecoveryToken = {
  token: string
  setupDate: string
}

export interface IUser {
  avatar?: string
  bio?: string
  email: string
  firstName?: string
  initials?: string
  lastName?: string
  loginTypes: string[]
  password: string
  account: IAccountCreatedEvent["data"]
  boardIds: string[]
  workspaces: string[]
  resetPasswordExpires?: string
  resetPasswordToken?: string
  roles: IUseBoardRoles[]
  starred?: string[]
  tokens: IJwtAccessTokens
  username: string
  viewedRecent?: string[]
  multiFactorAuth: boolean
  permissionFlag: number
  twoStepRecovery: IRecoveryToken
  isVerified: boolean
  status: UserAccountStatus
}

export interface IUserDocument extends Document, IUser {
  createdAt: boolean | string | number
  updatedAt: boolean | string | number
}

export const User = model<IUserDocument>("User", UserSchema)
