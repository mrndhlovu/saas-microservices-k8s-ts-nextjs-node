import request from "supertest"

import app from "../../app"

describe("Auth Logout", () => {
  it("it clears the cookie after logout", async () => {
    const { testCookie } = await global.signup()

    const response = await request(app)
      .get("/api/auth/logout")
      .set("Cookie", testCookie)
      .send()
      .expect(200)

    expect(response.get("Set-Cookie")).toEqual([
      "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly",
    ])
  })
})
