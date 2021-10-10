import { Schema, Document, model, Types } from "mongoose"
import { activeBoardBg } from "../types"
import Card from "./Card"
import List from "./List"

const DEFAULT_BOARD_BG_COLOR = "#0079be"

const BoardSchema = new Schema<BoardDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    lists: {
      type: [{ type: Schema.Types.ObjectId, ref: "List" }],
      required: true,
      default: [],
    },
    categories: {
      type: Array,
      required: true,
      default: [],
    },

    prefs: {
      type: Object,
      default: { color: DEFAULT_BOARD_BG_COLOR },
    },
    visibility: {
      type: Object,
      required: true,
      default: { private: true, public: false, team: false, workspace: false },
    },
    owner: {
      type: String,
    },
    archived: {
      type: Boolean,
      required: true,
      default: false,
    },
    workspaces: {
      type: [{ type: Schema.Types.ObjectId, ref: "Workspace" }],
      default: [],
    },
    members: {
      type: Array,
      default: [],
    },

    cards: {
      type: [{ type: Schema.Types.ObjectId, ref: "Card" }],
      default: [],
    },
    description: {
      type: String,
    },
    activeBg: {
      type: String,
      enum: Object.values(activeBoardBg),
      default: activeBoardBg.COLOR,
    },
  },
  { timestamps: true }
)

BoardSchema.pre("save", async function (next) {
  if (this.updatedAt) {
    // this.updatedAt = Date.now()
  }
  next()
})

BoardSchema.methods.toJSON = function () {
  const doc = this.toObject({
    transform: function (_doc, ret, _options) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      return ret
    },
    virtuals: true,
  })

  return doc
}

BoardSchema.pre("remove", function (next) {
  this.cards.map(
    async (cardId: Types.ObjectId) => await Card.findByIdAndRemove(cardId)
  )
  this.lists.map(
    async (listId: Types.ObjectId) => await List.findByIdAndRemove(listId)
  )

  next()
})

export interface IBoard extends Document {
  title: string
  date: string
  categories: string[]
  prefs: { [key: string]: string | boolean | undefined }
  visibility: {
    private: boolean
    public: boolean
    team: boolean
    workspace: boolean
  }
  lists: Types.ObjectId[]
  cards: Types.ObjectId[]
  owner: string
  archived: boolean
  comments: string[]
  activities: string[]
  members: IBoardMember[]
  description: string
  workspaces: Types.ObjectId[]
}

export interface IBoardMember {
  id: string
  permissionFlag: number
  teamId?: string
}

export interface BoardDocument extends IBoard {
  createdAt: boolean | string | number
  updatedAt: boolean | string | number
}

const Board = model<BoardDocument>("Board", BoardSchema)

export default Board
