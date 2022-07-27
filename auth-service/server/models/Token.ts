import { Schema, model, Document } from "mongoose"
import { TokenType } from "../types"

const TokenSchema = new Schema<ITokenDocument>(
  {
    valid: {
      type: Boolean,
      default: true,
    },
    token: { type: String, required: true },
    tokenType: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
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
    transform: function (_doc: ITokenDocument, ret: ITokenDocument) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      return ret
    },
  })

  return userObject
}

export interface ITokenDocument extends Document {
  expiresAt?: Date
  valid: boolean
  token: string
  tokenType: TokenType
  userId: string
}

export const Token = model<ITokenDocument>("Token", TokenSchema)
