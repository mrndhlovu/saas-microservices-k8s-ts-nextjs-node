import mongoose, { Schema, Document, model } from "mongoose"
import { CURRENCY_OPTIONS } from "../types"

const OrderSchema = new Schema<IOrderDocument>(
  {
    amount: {
      type: String,
    },
    source: {
      type: String,
    },
    productId: {
      type: String,
    },
    ownerId: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      enum: Object.values(CURRENCY_OPTIONS),
      default: CURRENCY_OPTIONS.EURO,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    startAt: {
      type: mongoose.Schema.Types.Date,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

OrderSchema.methods.toJSON = function () {
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

OrderSchema.pre("remove", async function (next) {
  next()
})

export interface IAccount {
  expiresAt?: Date
  startAt?: Date
  isPaid: boolean
  ownerId: string
  customerId: string
  productId: string
}

export interface IOrderDocument extends Document, IAccount {
  createdAt: boolean | string | number
  updatedAt: boolean | string | number
}

const Order = model<IOrderDocument>("Order", OrderSchema)
export default Order
