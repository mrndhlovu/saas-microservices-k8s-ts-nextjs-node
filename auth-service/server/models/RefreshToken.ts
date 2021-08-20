import { Schema, Document, model } from "mongoose"

const RefreshTokenSchema: Schema<IRefreshTokenDocument> = new Schema(
  {
    used: {
      type: Boolean,
      default: false,
    },
    invalidated: {
      type: Boolean,
      default: false,
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
}

export const RefreshToken = model<IRefreshTokenDocument>(
  "RefreshToken",
  RefreshTokenSchema
)
