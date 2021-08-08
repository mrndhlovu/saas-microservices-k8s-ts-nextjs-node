import request from "supertest"

import app from "../../app"

let cookie: string[]

describe("Payment", () => {
  beforeEach(async () => {
    cookie = await global.signup()
  })

  it("it response with 400 if payment not found", async () => {
    await request(app).get("/api/payments").send({})

    expect(400)
  })

  it("it responds with a 200 if payment is found", async () => {
    await request(app).get("/api/payments").set("Cookie", cookie).send({})

    expect(200)
  })
})
