import mongoose, { Types } from "mongoose"

export const toObjectId = (stringValue: string): Types.ObjectId =>
  mongoose.Types.ObjectId(stringValue)
