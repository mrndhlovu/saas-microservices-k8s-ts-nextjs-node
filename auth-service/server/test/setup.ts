import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import request from "supertest"

import app from "../app"

declare global {
  var getCookie: () => Promise<string[]>
}

let mongo: any
beforeAll(async () => {
  process.env.PORT = "8000"
  process.env.JWT_TOKEN_SIGNATURE = "JEST_TEST_KEYQWERTYUIO"
  process.env.JWT_REFRESH_TOKEN_SIGNATURE = "JEST_TEST_KEYQWERTYUIO"
  process.env.AUTH_MONGO_URI = "JEST_TEST_KEYQWERTYUIO"
  process.env.NATS_URL = "JEST_TEST_KEYQWERTYUIO"
  process.env.NATS_CLIENT_ID = "JEST_TEST_KEYQWERTYUIO"
  process.env.NATS_CLUSTER_ID = "JEST_TEST_KEYQWERTYUIO"

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

global.getCookie = async () => {
  const email = "test@test.com"
  const username = "bazinga"
  const password = "bazinga"

  const response = await request(app)
    .post("/api/auth/signup")
    .send({ email, username, password })
    .expect(201)

  const cookie = response.get("Set-Cookie")

  return cookie
}
