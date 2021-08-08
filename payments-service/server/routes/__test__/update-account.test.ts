import request from "supertest"

import app from "../../app"

let cookie: string[]

describe("Payment", () => {
  beforeEach(async () => {
    cookie = await global.signup()
  })

  it("it response with 400 if update fields are invalid", async () => {
    const response = await request(app)
      .patch("/api/payments")
      .set("Cookie", cookie)
      .send({
        plan: "silver",
      })

    expect(400)
  })

  it("it responds with a 200 update fields are valid", async () => {
    const response = await request(app)
      .patch("/api/payments")
      .set("Cookie", cookie)
      .send({
        status: "active",
      })

    expect(200)
    expect(response.body.status).toBe("active")
  })
})
