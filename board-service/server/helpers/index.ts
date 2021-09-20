import mongoose from "mongoose"

export const idToObjectId = (id: string) => mongoose.Types.ObjectId(id)
