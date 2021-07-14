import { Condition, ObjectId } from "mongodb"
import { Schema, Document, model } from "mongoose"

interface IList {
  title: string
  cards: string[]
  boardId: ObjectId
}

const ListSchema = new Schema(
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

export interface ListDocument extends IList, Document {
  _id: Condition<ObjectId>
}

const List = model<ListDocument>("List", ListSchema)

export default List
