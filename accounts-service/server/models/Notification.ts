import { Schema, Document, model } from "mongoose"

const NotificationSchema = new Schema<INotificationDocument>(
  {
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
    subject: {
      type: String,
    },
    title: {
      type: String,
    },
    body: {
      type: String,
    },
    user: {
      type: Object,
      default: {
        id: "",
        initials: "",
      },
    },
    actionKey: {
      type: String,
    },
    archived: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

NotificationSchema.methods.toJSON = function () {
  const notification = this.toObject({
    transform: function (_doc, ret, _options) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      return ret
    },
  })

  return notification
}

NotificationSchema.pre("remove", async function (next) {
  next()
})

export interface INotification {
  body: string
  isRead: boolean
  isVerified: boolean
  subject: string
  title: string
  actionKey: string
  user: {
    id: string
    initials: string
  }
}

export interface INotificationDocument extends Document, INotification {
  createdAt: boolean | string | number
  updatedAt: boolean | string | number
}

const Notification = model<INotificationDocument>(
  "Notification",
  NotificationSchema
)
export default Notification
