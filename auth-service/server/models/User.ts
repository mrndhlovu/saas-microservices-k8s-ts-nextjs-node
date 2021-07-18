import isEmail from "validator/lib/isEmail"
import { ObjectId } from "mongodb"
import { Schema, Document, model } from "mongoose"

import Services from "../services"

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
      minlength: 7,
      validate(value: string) {
        if (value.toLowerCase().includes("password"))
          throw new Error(`Password should not include 'password'`)
      },
    },
    permissionFlag: {
      type: Number,
      required: true,
      default: 0,
    },
    starred: {
      type: [{ type: Schema.Types.ObjectId, ref: "Board" }],
      required: true,
      default: [],
    },
    viewedRecent: {
      type: [{ type: Schema.Types.ObjectId, ref: "Board" }],
      required: true,
      default: [],
    },
    loginTypes: {
      type: Array,
      default: [],
      required: true,
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
      },
    },

    roles: [
      {
        admin: {
          type: [{ type: Schema.Types.ObjectId, ref: "Board" }],
          required: true,
        },
        basic: {
          type: [{ type: Schema.Types.ObjectId, ref: "Board" }],
          required: true,
        },
        guest: {
          type: [{ type: Schema.Types.ObjectId, ref: "Board" }],
          required: true,
        },
      },
    ],

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
  }
)

UserSchema.methods.toJSON = function () {
  const userObject = this.toObject({
    transform: function (_doc, ret, _options) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      delete ret.tokens
      return ret
    },
  })

  return userObject
}

UserSchema.pre("save", function (next) {
  const user = this
  const saltRounds = 12

  if (!user.isModified("password")) return next()

  Services.auth.encryptUserPassword(user, user.password, saltRounds, next)
})

export interface IAccessTokens {
  access: string
  refresh: string
}

interface IUseBoardRoles {
  [key: string]: ObjectId[]
}

type ILoginTypes = "email" | "username"

export interface IUserAttributes {
  username: string
  firstname?: string
  lastname?: string
  email: string
  password: string
  starred?: string[]
  viewedRecent?: string[]
  avatar?: string
  bio?: string
  loginTypes: ILoginTypes[]
  roles: IUseBoardRoles[]
  tokens: IAccessTokens
  resetPasswordToken?: string
  resetPasswordExpires?: string
}

export interface IUserDocument extends IUserAttributes, Document {
  _id: ObjectId
}

const User = model<IUserDocument>("User", UserSchema)

export default User
