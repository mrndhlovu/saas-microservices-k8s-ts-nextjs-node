import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"

import { app } from "../app"

let mongo: any
beforeAll(async () => {
  process.env.JWT_REFRESH_TOKEN_SIGNATURE = "jdkkdoldlos"
  process.env.JWT_TOKEN_SIGNATURE = "jdkkdoldlos"
  process.env.MONGO_DB_URI = "jdkkdoldlos"
  process.env.PORT = "8000"

  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()

  collections.map(async collection => {
    await collection.deleteMany({})
  })
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})
