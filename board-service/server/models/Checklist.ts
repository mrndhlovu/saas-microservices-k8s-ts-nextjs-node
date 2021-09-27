import { Schema, Document, model, Types } from "mongoose"

import { TASK_STATUS } from "../types"
import Task from "./Task"

const ChecklistSchema = new Schema<IChecklistDocument>({
  title: {
    type: String,
    trim: true,
  },
  tasks: {
    type: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    default: [],
  },
  cardId: {
    type: Schema.Types.ObjectId,
    required: true,
    trim: true,
  },
  complete: {
    type: Boolean,
    required: true,
    default: false,
  },
  hideComplete: {
    type: Boolean,
    required: true,
    default: false,
  },
  owner: {
    type: String,
    required: true,
  },
})

ChecklistSchema.methods.toJSON = function () {
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

export interface IChecklistDocument extends Document {
  cardId: Types.ObjectId
  tasks: Types.ObjectId[]
  owner: string
  title: string
  complete: boolean
  hideComplete: boolean
}

const Checklist = model<IChecklistDocument>("Checklist", ChecklistSchema)

export default Checklist
