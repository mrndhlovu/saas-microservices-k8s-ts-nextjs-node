import mongoose, { Schema, Document, model } from "mongoose"

import { AccountOptions, AccountStatus } from "@tusksui/shared"

const AccountSchema = new Schema<IAccountDocument>(
  {
    plan: {
      type: String,
      required: true,
      enum: Object.values(AccountOptions),
      default: AccountOptions.Free,
    },
    ownerId: {
      type: String,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    expired: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(AccountStatus),
      default: AccountStatus.Created,
    },
    isTrial: {
      type: Boolean,
      required: true,
      default: false,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

AccountSchema.methods.toJSON = function () {
  const list = this.toObject({
    transform: function (_doc, ret, _options) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      return ret
    },
  })

  return list
}

AccountSchema.pre("remove", async function (next) {
  next()
})

export interface IAccount {
  expired: boolean
  expiresAt: Date
  isTrial: boolean
  ownerId: string
  plan: AccountOptions
  status: AccountStatus
  userId: string
  isVerified: boolean
}

export interface IAccountDocument extends Document, IAccount {
  createdAt: boolean | string | number
  updatedAt: boolean | string | number
}

const Account = model<IAccountDocument>("Account", AccountSchema)
export default Account
