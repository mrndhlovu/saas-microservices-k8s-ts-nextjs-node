import { ObjectId } from "mongodb"
import { Schema, Document, model } from "mongoose"

const DEFAULT_BOARD_BG_COLOR = "#0079be"

const BoardSchema = new Schema<BoardDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
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
    admin: {
      type: String,
      default: "",
    },
    archived: {
      type: Boolean,
      required: true,
      default: false,
    },
    workspaces: {
      type: [{ type: Schema.Types.ObjectId, ref: "Workspace" }],
      required: true,
      default: [],
    },
    members: {
      type: Array,
      default: [
        {
          id: { type: Schema.Types.ObjectId, ref: "User" },
          permissionFlag: 1,
        },
      ],
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
)

BoardSchema.pre("save", async function (next) {
  if (this.updatedAt) {
    this.updatedAt = Date.now()
  }
  next()
})

export interface IBoard {
  title: string
  lists: string[]
  date: string
  categories: string[]
  prefs: { [key: string]: string | boolean | undefined }
  visibility: {
    private: boolean
    public: boolean
    team: boolean
    workspace: boolean
  }
  owner: ObjectId
  admin: string
  archived: boolean
  comments: string[]
  activities: string[]
  members: IBoardMember[]
  description: string
  workspaces: string[]
}

export interface IBoardMember {
  id: ObjectId
  permissionFlag: number
}

export interface BoardDocument
  extends IBoardWithSchemaTimestampsConfig,
    Document {
  _id: ObjectId
}

interface IBoardWithSchemaTimestampsConfig extends IBoard {
  createdAt: boolean | string | number
  updatedAt: boolean | string | number
}

const Board = model("Board", BoardSchema)

export default Board
