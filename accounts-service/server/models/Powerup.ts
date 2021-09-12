import { Schema, Document, model } from "mongoose"

import { AccountStatus } from "@tusksui/shared"

const PowerUpSchema = new Schema<IPowerUpDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    tokens: {
      type: Object,
      default: {
        accessToken: "",
        refreshToken: "",
      },
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(AccountStatus),
      default: AccountStatus.Created,
    },
    ownerId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

PowerUpSchema.methods.toJSON = function () {
  const account = this.toObject({
    transform: function (_doc, ret, _options) {
      ret.id = ret._id

      delete ret.tokens
      delete ret._id
      delete ret.__v
      return ret
    },
  })

  return account
}

PowerUpSchema.pre("remove", async function (next) {
  next()
})

export interface IPowerUp {
  tokens: {
    accessToken: string
    refreshToken: string
  }
  status: AccountStatus
  name: string
  ownerId: string
}

export interface IPowerUpDocument extends Document, IPowerUp {
  createdAt: boolean | string | number
  updatedAt: boolean | string | number
}

const PowerUp = model<IPowerUpDocument>("PowerUp", PowerUpSchema)
export default PowerUp
