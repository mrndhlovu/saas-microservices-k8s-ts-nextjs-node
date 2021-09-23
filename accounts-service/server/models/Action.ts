import { Schema, Document, model } from "mongoose"

import { ACTION_TYPES } from "@tusksui/shared"

const ActionSchema = new Schema<IActionDocument>(
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

ActionSchema.pre("save", async function (next) {
  if (this.updatedAt) {
    this.updatedAt = Date.now()
  }
  next()
})

ActionSchema.methods.toJSON = function () {
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

ActionSchema.pre("remove", async function (next) {
  next()
})

export type ActionEntities = {
  boardId: string
  name?: string
  [key: string]: any
}

export interface IAction {
  entities: ActionEntities
  type: ACTION_TYPES
  memberCreator: {
    username: string
    id: string
    fullName?: string
    initials: string
  }
  translationKey: string
}

export interface IActionDocument extends Document, IAction {
  createdAt: boolean | string | number
  updatedAt: boolean | string | number
}

const Action = model<IActionDocument>("Action", ActionSchema)

export default Action
