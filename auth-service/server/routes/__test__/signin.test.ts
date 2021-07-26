import request from "supertest"

import app from "../../app"

describe("Auth Login", () => {
  it("returns fails is email does not exist", async () => {
    return request(app)
      .post("/api/auth/login")
      .send({
        identifier: "testingtest.com",
        password: "passwo123",
      })
      .expect(400)
  })

  it("returns a fail with an incorrect password", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({
        email: "testing@test.com",
        password: "pass1234",
        username: "username",
      })
      .expect(201)

    await request(app)
      .post("/api/auth/login")
      .send({
        identifier: "testing@test.com",
        password: "pass123",
      })
      .expect(400)
  })

  it("returns a responses with a cookie if login successfull", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({
        email: "testing@test.com",
        password: "pass1234",
        username: "username",
      })
      .expect(201)

    const response = await request(app).post("/api/auth/login").send({
      identifier: "testing@test.com",
      password: "pass1234",
    })

    expect(response.get("Set-Cookie")).toBeDefined()
  })
})
