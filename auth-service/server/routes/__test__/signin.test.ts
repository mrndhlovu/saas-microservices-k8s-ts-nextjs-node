import request from "supertest"

import app from "../../app"
import { TestUser } from "../../test/setup"

let cookie: string[]
let user: TestUser

describe("Auth Login", () => {
  beforeEach(async () => {
    const { testCookie, testUser } = await global.signup()
    user = testUser
    cookie = testCookie
  })

  it("returns fails is email does not exist", async () => {
    return request(app)
      .post("/api/auth/login")
      .send({
        identifier: user.username,
        password: "passwo123",
      })
      .expect(400)
  })

  it("returns a 400 if incorrect password is used", async () => {
    await request(app)
      .post("/api/auth/login")
      .send({
        identifier: user.email,
        password: "pass123",
      })
      .expect(400)
  })

  it("returns a responses with a cookie if login successful", async () => {
    const response = await request(app).post("/api/auth/login").send({
      identifier: user.email,
      password: user.password,
    })

    expect(response.get("Set-Cookie")).toBeDefined()
  })

  it("returns a 200 after refreshing access token", async () => {
    await request(app)
      .get("/api/auth/refresh-token")
      .set("Cookie", cookie)
      .send()
      .expect(200)
  })

  it("it returns 400 if user is deleted and attempt login", async () => {})
})
