import request from "supertest"

import app from "../../app"

let cookie: string[]

describe("Account", () => {
  beforeEach(async () => {
    cookie = await global.signup()
  })

  it("it response with 400 if account not found", async () => {
    await request(app).get("/api/accounts").send({})

    expect(400)
  })

  it("it responds with a 200 if account is found", async () => {
    await request(app).get("/api/accounts").set("Cookie", cookie).send({})

    expect(200)
  })
})
