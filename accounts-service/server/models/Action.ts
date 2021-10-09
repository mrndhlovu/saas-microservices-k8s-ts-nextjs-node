import { Schema, Document, model, PaginateModel } from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

import { ACTION_TYPES } from "@tusksui/shared"

const ActionSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(ACTION_TYPES),
      required: true,
    },
    translationKey: {
      type: String,
      required: true,
    },
    entities: {
      type: Object,
      default: {},
    },
    memberCreator: {
      type: Object,
      default: {
        id: String,
        username: String,
        fullName: String,
      },
    },
  },
  {
    timestamps: true,
  }
)

ActionSchema.plugin(mongoosePaginate)

ActionSchema.methods.toJSON = function () {
  const action = this.toObject({
    transform: function (_doc, ret, _options) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      return ret
    },
  })

  return action
}

export type ActionEntities = {
  boardId: string
  name?: string
  [key: string]: any
}

export interface IAction {
  createdAt: boolean | string | number
  updatedAt: boolean | string | number
}

export interface IActionDocument extends Document {
  entities: ActionEntities
  type: ACTION_TYPES
  translationKey: string
  memberCreator: {
    username: string
    id: string
    fullName?: string
    initials: string
  }
}

interface ActionModel<T extends Document> extends PaginateModel<T> {}

export const Action: ActionModel<IActionDocument> = model<IActionDocument>(
  "Action",
  ActionSchema
)

export default Action
