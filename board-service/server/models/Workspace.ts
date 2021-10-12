import { Schema, Document, Types, model } from "mongoose"

const WorkspaceSchema = new Schema<IWorkspaceDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    boards: {
      type: [{ type: Schema.Types.ObjectId, ref: "Board" }],
      default: [],
    },
    category: {
      type: String,
    },
    owner: {
      type: String,
    },
    description: {
      type: String,
    },
    shortname: {
      type: String,
    },
    visibility: {
      type: String,
    },
    iconColor: {
      type: String,
      default: "#cd5a91",
    },
  },
  {
    timestamps: true,
  }
)

WorkspaceSchema.pre("save", async function (next) {
  if (this.updatedAt) {
    this.updatedAt = Date.now()
  }
  next()
})

WorkspaceSchema.methods.toJSON = function () {
  const object = this.toObject({
    transform: function (_doc, ret, _options) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      return ret
    },
  })

  return object
}

WorkspaceSchema.pre("remove", async function (next) {
  next()
})

export interface IList {
  name: string
  boards: Types.ObjectId[]
  category: string
  description: string
  owner: string
  iconColor: string
  shortname: string
  visibility: string
}

export interface IWorkspaceDocument extends Document, IList {
  createdAt: boolean | string | number
  updatedAt: boolean | string | number
}

const Workspace = model<IWorkspaceDocument>("Workspace", WorkspaceSchema)

export default Workspace
