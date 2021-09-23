import { Schema, Document, model, Types } from "mongoose"

export interface ICard {
  activities: string[]
  archived: boolean
  assignees: string[]
  attachments: string[]
  boardId: Types.ObjectId
  cardId: string
  checklists: Types.ObjectId[]
  comments: string[]
  imageCover: Types.ObjectId
  colorCover: string
  description: string
  dueDate: string
  labels: string[]
  listId: string
  owners: string[]
  shortDesc: string
  title: string
  coverUrl: {
    image: string
    edgeColor: string
    active: boolean
  }
}

const CardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    attachments: {
      type: [{ type: Schema.Types.ObjectId, ref: "Attachment" }],
      required: true,
      default: [],
    },
    archived: {
      type: Boolean,
      default: false,
      required: true,
    },
    imageCover: {
      type: Schema.Types.ObjectId,
      ref: "Attachment",
    },
    colorCover: {
      type: String,
      default: "",
    },
    coverUrl: {
      type: Object,
      default: {
        image: String,
        edgeColor: String,
        active: Boolean,
      },
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
