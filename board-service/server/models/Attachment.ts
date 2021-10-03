import { Schema, Document, model, Types } from "mongoose"

const AttachmentSchema = new Schema<IAttachmentDocument>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    edgeColor: {
      type: String,
    },
    title: {
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
    resourceId: {
      type: String,
    },
    resourceType: {
      type: String,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
    },
  },
  {
    timestamps: true,
  }
)

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

export interface IAttachment extends Document {
  active: boolean
  boardId: Types.ObjectId
  cardId: Types.ObjectId
  edgeColor: string
  height: number
  resourceId: string
  resourceType: string
  title: string
  url: string
  width: number
}

export interface IAttachmentDocument extends IAttachment {
  createdAt: boolean | string | number
  updatedAt: boolean | string | number
}

const Attachment = model<IAttachmentDocument>("Attachment", AttachmentSchema)

export default Attachment
