import { ObjectId } from "mongodb"
import { Schema, Document, model } from "mongoose"
import Board from "./Board"
import Card, { CardDocument } from "./Card"

const ListSchema = new Schema<ListDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Board",
    },
    archived: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

ListSchema.pre("save", async function (next) {
  if (this.updatedAt) {
    this.updatedAt = Date.now()
  }
  next()
})

ListSchema.methods.toJSON = function () {
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

ListSchema.pre("remove", async function (next) {
  const board = await Board.findOne({ _id: this.boardId })
  const cards = await Card.find({ listId: this._id.toHexString() })
  const cardIds = cards.map(card => card._id as string)

  if (board) {
    board.lists.map(async (listId: string) => {
      if (listId === this._id.toHexString()) {
        board.lists.filter(id => id !== this._id.toHexString())
      }
    })

    board?.cards.filter(id => cardIds.includes(id))

    board.save()
  }

  if (cards) {
    cards.map(async (card: CardDocument) => {
      await card.delete()
    })
  }

  next()
})

export interface IList {
  title: string
  boardId: ObjectId
}

export interface ListDocument
  extends IListWithSchemaTimestampsConfig,
    Document {
  _id: ObjectId
}

interface IListWithSchemaTimestampsConfig extends IList {
  createdAt: boolean | string | number
  updatedAt: boolean | string | number
}

const List = model("List", ListSchema)

export default List
