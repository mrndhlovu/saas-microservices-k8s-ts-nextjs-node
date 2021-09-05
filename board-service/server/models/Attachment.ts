import { ObjectID, ObjectId } from "mongodb"
import { Schema, Document, model } from "mongoose"

const AttachmentSchema = new Schema<IAttachmentDocument>({
  url: {
    type: String,
    required: true,
    trim: true,
  },
  edgeColor: {
    type: String,
  },
  height: {
    type: String,
  },
  width: {
    type: String,
  },
  active: {
    type: Boolean,
  },
  cardId: {
    type: Schema.Types.ObjectId,
    ref: "Card",
  },
  boardId: {
    type: Schema.Types.ObjectId,
    ref: "Board",
  },
})

AttachmentSchema.methods.toJSON = function () {
  const list = this.toObject({
    transform: function (_doc, ret, _options) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      return ret
    },
    virtuals: true,
  })

  return list
}

export interface IAttachmentDocument extends Document {
  url: string
  edgeColor: string
  height: number
  width: number
  active: boolean
  cardId: ObjectID
}

const Attachment = model<IAttachmentDocument>("Attachment", AttachmentSchema)

export default Attachment
