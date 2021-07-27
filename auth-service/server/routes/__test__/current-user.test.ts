import request from "supertest"

import app from "../../app"
import { TestUser } from "../../test/setup"

let cookie: string[]
let user: TestUser

describe("Auth current user", () => {
  beforeEach(async () => {
    const { testCookie, testUser } = await global.signup()
    user = testUser
    cookie = testCookie
  })

  it("it responses with current user data", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Cookie", cookie)
      .send()

    expect(response.body.email).toEqual(user.email)
  })

  it("it responds with a 200 if auth cookie not set but user should ne null", async () => {
    const response = await request(app).get("/api/auth/me").send()

    expect(200)
    expect(response.body.email).toBeUndefined()
  })

  it("it responds with a 200 with updated user", async () => {
    const response = await request(app).get("/api/auth/me").send()

    expect(200)
    expect(response.body.email).toBeUndefined()
  })

  it("it responses with updated user object", async () => {
    const newUsername = "updated username"

    const response = await request(app)
      .patch("/api/auth/update")
      .set("Cookie", cookie)
      .send({ username: newUsername })

    expect(200)
    expect(response.body.username).toEqual(newUsername)
  })

  it("it responses 400 updating an up editable field", async () => {
    await request(app)
      .patch("/api/auth/update")
      .set("Cookie", cookie)
      .send({ id: 12345 })
      .expect(400)
  })
})
