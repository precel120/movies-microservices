import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import axios from "axios";
import app from "../../app";
import authApp from "../../../../auth/src/app";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

let mongo: MongoMemoryServer;
describe("", () => {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  });

  afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
  });

  it("gets movies when user is logged in", async () => {
    const signResponse = await request(authApp)
      .post("/auth/sign")
      .send({
        username: "premium-jim",
        password: "GBLtTyq3E_UNjFnpo9m6",
      })
      .expect("Content-Type", /json/)
      .expect(200);
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        isAuthorized: true,
        decoded: {
          userId: 1234,
          role: "premium",
        },
      },
    });
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        Title: "Blade Runner",
        Genre: "action",
        Director: "Ridley Scott",
        Released: new Date("1990-12-01"),
        CreatedBy: 1234,
        CreatedOn: Date.now(),
      },
    });
    const { token } = signResponse.body;
    const response = await request(app)
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Blade Runner",
      })
      .expect(200);
    const { body } = response;
    expect(body).toBeDefined();
  });
});
