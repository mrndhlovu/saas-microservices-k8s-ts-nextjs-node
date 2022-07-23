import { Schema, Document, model } from "mongoose"
import { PasswordManager } from "../services"
import { TokenType } from "../types"

const TokenSchema = new Schema<TokenDocument>(
  {
    invalidated: {
      type: Boolean,
      default: false,
    },
    useCount: {
      type: Number,
      default: 0,
    },
    token: {
      type: String,
    },
    tokenType: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    expiresAt: {
      type: Date,
      // required: function (): boolean {
      //   return this.tokenType! === "otp"
      // },
    },
  },
  {
    timestamps: true,
  }
)

TokenSchema.methods.toJSON = function () {
  const userObject = this.toObject({
    transform: function (_doc, ret, _options) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      return ret
    },
  })

  return userObject
}

export interface TokenDocument extends Document {
  invalidated?: boolean
  userId: string
  token: string
  useCount: number
  tokenType: TokenType
  expiresAt?: Date
}

export const Token = model<TokenDocument>("Token", TokenSchema)
