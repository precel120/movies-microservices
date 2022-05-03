import request from "supertest";
import { app } from "../../app";

it("receives JWT token", async () => {
  await request(app)
    .post("/auth")
    .send({
      username: "premium-jim",
      password: "GBLtTyq3E_UNjFnpo9m6",
    })
    .expect("Content-Type", /json/)
    .expect(200);
});

it("returns 401 with invalid credentials", async () => {
  return request(app)
    .post("/auth")
    .send({
      username: "premium",
      password: "GBLtTyq3E_UNjFnpo",
    })
    .expect(401);
});

it("returns 400 without sending body", async () => {
  return request(app).post("/auth").expect(400);
});

it("returns 400 without body's content", async () => {
  return request(app).post("/auth").send({}).expect(400);
});
it("returns 400 with either password or username missing", async () => {
  await request(app)
    .post("/auth")
    .send({ username: "premium-jim" })
    .expect(400);
  await request(app)
    .post("/auth")
    .send({ password: "GBLtTyq3E_UNjFnpo9m6" })
    .expect(400);
});
