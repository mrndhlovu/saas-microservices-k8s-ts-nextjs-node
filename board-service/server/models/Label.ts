import { Schema, Document, model } from "mongoose"

const LabelSchema = new Schema<ILabelDocument>({
  color: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: String,
    required: true,
  },
})

LabelSchema.methods.toJSON = function () {
  const list = this.toObject({
    transform: function (_doc, ret, _options) {
      ret.id = ret._id
      delete ret._id
      delete ret.owner
      delete ret.__v
      return ret
    },
    virtuals: true,
  })

  return list
}

export interface ILabelDocument extends Document {
  color: string
  owner: string
  name: string
}

const Label = model<ILabelDocument>("Label", LabelSchema)

export default Label
