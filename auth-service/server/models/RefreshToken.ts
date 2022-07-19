import { Schema, Document, model } from "mongoose"

const RefreshTokenSchema = new Schema<IRefreshTokenDocument>(
  {
    used: {
      type: Boolean,
      default: false,
    },
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
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
)

RefreshTokenSchema.methods.toJSON = function () {
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

export interface IRefreshTokenDocument extends Document {
  used?: boolean
  invalidated?: boolean
  userId: string
  token: string
  useCount: number
}

export const RefreshToken = model<IRefreshTokenDocument>(
  "RefreshToken",
  RefreshTokenSchema
)
