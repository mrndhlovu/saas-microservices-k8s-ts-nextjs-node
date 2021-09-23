import { Schema, Document, model, Types } from "mongoose"

import { ACTIVITY_TYPES } from "@tusksui/shared"

const ActivitySchema = new Schema<IActivityDocument>(
  {
    type: {
      type: String,
      enum: Object.values(ACTIVITY_TYPES),
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

ActivitySchema.pre("save", async function (next) {
  if (this.updatedAt) {
    this.updatedAt = Date.now()
  }
  next()
})

ActivitySchema.methods.toJSON = function () {
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

ActivitySchema.pre("remove", async function (next) {
  next()
})

export type ActivityEntities = {
  boardId: string
  name: string
  [key: string]: any
}

export interface IActivity {
  entities: ActivityEntities
  type: ACTIVITY_TYPES
  memberCreator: {
    username: string
    id: string
    fullName?: string
    initials: string
  }
  translationKey: string
}

export interface IActivityDocument extends Document, IActivity {
  createdAt: boolean | string | number
  updatedAt: boolean | string | number
}

const Activity = model<IActivityDocument>("Activity", ActivitySchema)

export default Activity
