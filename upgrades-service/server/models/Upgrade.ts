import mongoose, { Schema, Document, model } from "mongoose"

import { UpgradeStatus } from "@tuskui/shared"

const UpgradeSchema = new Schema<UpgradeDocument>(
  {
    option: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Board",
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(UpgradeStatus),
      default: UpgradeStatus.Created,
    },
  },
  {
    timestamps: true,
  }
)

UpgradeSchema.pre("save", async function (next) {
  if (this.updatedAt) {
    this.updatedAt = Date.now()
  }
  next()
})

UpgradeSchema.methods.toJSON = function () {
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

UpgradeSchema.pre("remove", async function (next) {
  next()
})

export interface IList {
  userId: string
  status: string
  option: string
  expiresAt: Date
}

export interface UpgradeDocument extends Document, IList {
  createdAt: boolean | string | number
  updatedAt: boolean | string | number
}

const Upgrade = model<UpgradeDocument>("Upgrade", UpgradeSchema)
export default Upgrade
