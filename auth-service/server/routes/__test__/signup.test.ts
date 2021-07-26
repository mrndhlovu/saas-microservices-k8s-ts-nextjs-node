import request from "supertest"

import app from "../../app"

describe("Auth Signup", () => {
  it("returns a 201 on successful sign up", async () => {
    return request(app)
      .post("/api/auth/signup")
      .send({
        email: "testing@test.com",
        password: "passwo123",
        username: "username",
      })
      .expect(201)
  })

  it("returns a 400 with an invalid email", async () => {
    return request(app)
      .post("/api/auth/signup")
      .send({
        email: "testingtest.com",
        password: "passwo123",
        username: "username",
      })
      .expect(400)
  })

  it("returns a 400 with an invalid password", async () => {
    return request(app)
      .post("/api/auth/signup")
      .send({
        email: "testing@test.com",
        password: "password",
        username: "username",
      })
      .expect(400)
  })

  it("returns a 400 with missing email and password", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({ email: "testing@test.com" })
      .expect(400)

    await request(app)
      .post("/api/auth/signup")
      .send({ password: "password" })
      .expect(400)
  })

  it("it rejects duplicate emails", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({
        email: "testing@test.com",
        password: "passwo123",
        username: "username",
      })
      .expect(201)

    await request(app)
      .post("/api/auth/signup")
      .send({
        email: "testing@test.com",
        password: "passwo123",
        username: "username",
      })
      .expect(400)
  })

  it("it sets a cookie after success signup", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      email: "testing@test.com",
      password: "passwo123",
      username: "username",
    })

    expect(response.get("Set-Cookie")).toBeDefined()
  })
})
