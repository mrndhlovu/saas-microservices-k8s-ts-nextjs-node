import { ObjectID } from "mongodb"
import mongoose from "mongoose"

export const idToObjectId = (id: string): ObjectID =>
  mongoose.Types.ObjectId(id)
