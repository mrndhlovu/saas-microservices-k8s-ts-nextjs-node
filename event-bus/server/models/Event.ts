import { Condition, ObjectId } from "mongodb"
import { Schema, Document, model } from "mongoose"

interface IEvent {
  title: string
  cards: string[]
  boardId: ObjectId
}

const EventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Board",
    },

    cards: {
      type: [{ type: Schema.Types.ObjectId, ref: "Card" }],
      default: [],
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export interface EventDocument extends IEvent, Document {
  _id: Condition<ObjectId>
}

const Event = model<EventDocument>("Event", EventSchema)

export default Event
