import { ObjectID } from "mongodb"
import { Schema, Document, model } from "mongoose"

export interface ICard {
  activities: string[]
  archived: boolean
  assignees: string[]
  attachments: string[]
  boardId: ObjectID
  cardId: string
  checklists: string[]
  comments: string[]
  cover: string
  description: string
  dueDate: string
  labels: string[]
  listId: string
  owners: string[]
  shortDesc: string
  title: string
}

const CardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    attachments: {
      type: Array,
      required: true,
      default: [],
    },
    archived: {
      type: Boolean,
      default: false,
      required: true,
    },
    cover: {
      type: String,
      default: "",
    },
    listId: {
      type: String,
      default: "",
      required: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Board",
    },
    comments: {
      type: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
      default: [],
      required: true,
    },
    labels: {
      type: Array,
      default: [],
      required: true,
    },
    checklists: {
      type: [{ type: Schema.Types.ObjectId, ref: "Checklist" }],
      default: [],
      required: true,
    },
    shortDesc: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    assignees: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
      required: true,
    },
    dueDate: {
      type: String,
      default: "",
    },
    position: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

CardSchema.methods.toJSON = function () {
  const card = this.toObject({
    transform: function (_doc, ret, _options) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      return ret
    },
    virtuals: true,
  })

  return card
}

export interface CardDocument extends ICard, Document {}

const Card = model<CardDocument>("Card", CardSchema)

export default Card
