import request from "supertest"

import app from "../../app"
import { TestUser } from "../../test/setup"

let user: TestUser

describe("Auth Signup", () => {
  beforeEach(async () => {
    user = {
      email: "test@test.com",
      username: "bazinga",
      password: "bazinga",
    }
  })

  it("returns a 201 on successful sign up", async () => {
    return request(app)
      .post("/api/auth/signup")
      .send({
        email: user.email,
        password: user.password,
        username: user.username,
      })
      .expect(201)
  })

  it("returns a 400 with an invalid email", async () => {
    return request(app)
      .post("/api/auth/signup")
      .send({
        email: "testingtest.com",
        password: user.password,
        username: user.username,
      })
      .expect(400)
  })

  it("returns a 400 with an invalid password", async () => {
    return request(app)
      .post("/api/auth/signup")
      .send({
        email: user.email,
        password: "password",
        username: user.username,
      })
      .expect(400)
  })

  it("returns a 400 with missing email and password", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({ email: user.email })
      .expect(400)

    await request(app)
      .post("/api/auth/signup")
      .send({ password: user.password, username: user.username })
      .expect(400)
  })

  it("it rejects duplicate emails", async () => {
    const existing = await global.signup()

    await request(app)
      .post("/api/auth/signup")
      .send({
        email: existing.testUser.email,
        password: existing.testUser.password,
        username: existing.testUser.username,
      })
      .expect(400)
  })

  it("it sets a cookie after success signup", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({ ...user })

    expect(response.get("Set-Cookie")).toBeDefined()
  })
})
