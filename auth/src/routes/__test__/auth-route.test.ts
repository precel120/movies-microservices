import request from "supertest";
import { app } from "../../app";

describe("/auth tests", () => {
  it("receives JWT token", async () => {
    await request(app)
      .post("/auth/sign")
      .send({
        username: "premium-jim",
        password: "GBLtTyq3E_UNjFnpo9m6",
      })
      .expect("Content-Type", /json/)
      .expect(200);
  });

  it("returns 401 with invalid credentials", async () => {
    return request(app)
      .post("/auth/sign")
      .send({
        username: "premium",
        password: "GBLtTyq3E_UNjFnpo",
      })
      .expect(401);
  });

  it("returns 400 without sending body", async () => {
    return request(app).post("/auth/sign").expect(400);
  });

  it("returns 400 without body's content", async () => {
    return request(app).post("/auth/sign").send({}).expect(400);
  });
  it("returns 400 with either password or username missing", async () => {
    await request(app)
      .post("/auth/sign")
      .send({ username: "premium-jim" })
      .expect(400);
    await request(app)
      .post("/auth/sign")
      .send({ password: "GBLtTyq3E_UNjFnpo9m6" })
      .expect(400);
  });
});

describe("/verify tests", () => {
  it("returns 200 with successful JWT validation", async () => {
    const authResponse = await request(app)
      .post("/auth/sign")
      .send({
        username: "premium-jim",
        password: "GBLtTyq3E_UNjFnpo9m6",
      })
      .expect("Content-Type", /json/)
      .expect(200);
    const { token } = authResponse.body;
    const verifyResponse = await request(app)
      .get("/auth/verify")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    const { isAuthorized, decoded } = verifyResponse.body;
    expect(isAuthorized).toEqual(true);
    expect(decoded).toBeDefined();
  });
  it("returns 401 with invalid token", async () => {
    const authResponse = await request(app)
      .post("/auth/sign")
      .send({
        username: "premium-jim",
        password: "GBLtTyq3E_UNjFnpo9m6",
      })
      .expect("Content-Type", /json/)
      .expect(200);
    const { token } = authResponse.body;
    const invalidToken = "<" + token.substring(1);
    await request(app)
      .get("/auth/verify")
      .set("Authorization", `Bearer ${invalidToken}`)
      .expect(401);
  });
  it("returns 401 with missing token", async () => {
    await request(app)
      .get("/auth/verify")
      .set("Authorization", `Bearer }`)
      .expect(401);
  });
});
