import { Schema, Document, model, ObjectId } from "mongoose"

import { TASK_STATUS } from "../types"

const TaskSchema = new Schema<ITaskDocument>({
  item: {
    type: String,
    trim: true,
  },
  checklist: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  state: {
    type: String,
    enum: Object.values(TASK_STATUS),
    default: TASK_STATUS.TODO,
  },
  assignees: {
    type: Array,
    default: [],
  },
})

TaskSchema.methods.toJSON = function () {
  const object = this.toObject({
    transform: function (_doc, ret, _options) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      return ret
    },
    virtuals: true,
  })

  return object
}

export interface ITaskDocument extends Document {
  state: TASK_STATUS
  checklist: ObjectId
  item: string
  assignees: string[]
}

const Task = model<ITaskDocument>("Task", TaskSchema)

export default Task
