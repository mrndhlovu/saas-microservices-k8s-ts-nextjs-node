import request from "supertest"

import app from "../../app"

describe("Auth current user", () => {
  it("it responses with current user data", async () => {
    const cookie = await global.getCookie()

    const response = await request(app)
      .get("/api/auth/me")
      .set("Cookie", cookie)
      .send()

    expect(response.body.email).toEqual("test@test.com")
  })

  it("it responds with a 200 if auth cookie not set but user should ne null", async () => {
    const response = await request(app).get("/api/auth/me").send()

    expect(200)
    expect(response.body.email).toBeUndefined()
  })
})
