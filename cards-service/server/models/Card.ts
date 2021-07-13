import { Condition, ObjectId } from "mongodb"
import { Schema, Document, model } from "mongoose"

import { Services } from "../services"

export interface ICard {
  title: string
  attachments: string[]
  labels: string[]
  dueDate: string
  shortDesc: string
  checklists: string[]
  comments: string[]
  activities: string[]
  owners: string[]
  description: string
  cover: string
  assignees: string[]
  archived: boolean
  listId: string
}

const CardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
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
      type: Schema.Types.ObjectId,
      ref: "List",
      default: "",
      required: true,
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

export interface CardDocument extends ICard, Document {
  _id: Condition<ObjectId>
}

const Card = model<CardDocument>("Card", CardSchema)

export default Card
