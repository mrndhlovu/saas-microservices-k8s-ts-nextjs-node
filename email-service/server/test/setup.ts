import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import request from "supertest"
import jwt from "jsonwebtoken"

import app from "../app"
import { IJwtAccessTokens, IJwtAuthToken } from "@tusksui/shared"
import { natsService } from "../services"

declare global {
  var signup: () => Promise<string[]>
}

jest.mock("../services/nats.ts")

let mongo: any
beforeAll(async () => {
  process.env.PORT = "8000"
  process.env.PAYMENTSS_MONGO_URI = "JEST_TEST_KEYQWERTYUIO"
  process.env.NATS_URL = "JEST_TEST_KEYQWERTYUIO"
  process.env.NATS_CLIENT_ID = "JEST_TEST_KEYQWERTYUIO"
  process.env.NATS_CLUSTER_ID = "JEST_TEST_KEYQWERTYUIO"
  process.env.JWT_ACCESS_TOKEN_SIGNATURE = "JEST_TEST_KEYQWERTYUIO"

  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
})

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()

  collections.map(async collection => {
    await collection.deleteMany({})
  })
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.signup = async () => {
  const response = await request(app)
    .get("/api/payments/create")
    .send({})
    .expect(201)

  expect(natsService.client.publish).toHaveBeenCalled()

  const payload: IJwtAuthToken = {
    userId: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
    paymentId: response.body.id,
  }

  const token: string = jwt.sign(
    payload,
    process.env.JWT_ACCESS_TOKEN_SIGNATURE!
  )
  const tokens: IJwtAccessTokens = { access: token, refresh: token }

  const session = { jwt: tokens }

  const sessionJSON = JSON.stringify(session)
  const base64 = Buffer.from(sessionJSON).toString("base64")

  return [`express:sess=${base64}`]
}
