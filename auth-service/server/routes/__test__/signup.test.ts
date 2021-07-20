import request from "supertest"

import { app } from "../../app"

it("returns a 201 on successful sign up", async () => {
  return request(app)
    .post("/api/auth/signup")
    .send({
      email: "testing@test.com",
      password: "password",
      username: "username",
    })
    .expect(400)
})
