import { Schema, Document, model } from "mongoose"

const PaymentSchema = new Schema<IPaymentDocument>(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

PaymentSchema.methods.toJSON = function () {
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

PaymentSchema.pre("remove", async function (next) {
  next()
})

export interface IAccount {
  orderId: string
  stripeId: string
}

export interface IPaymentDocument extends Document, IAccount {
  createdAt: boolean | string | number
  updatedAt: boolean | string | number
}

const Payment = model<IPaymentDocument>("Payment", PaymentSchema)
export default Payment
