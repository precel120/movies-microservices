import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import axios from "axios";
import app from "../../app";
import authApp from "../../../../auth/src/app";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

let mongo: MongoMemoryServer;
describe("/movies tests", () => {
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

  it("POST creates a movie when user is logged in (premium user)", async () => {
    const userRole = "premium";
    const signResponse = await request(authApp)
      .post("/auth/sign")
      .send({
        username: "premium-jim",
        password: "GBLtTyq3E_UNjFnpo9m6",
      })
      .expect("Content-Type", /json/)
      .expect(200);

    mockAuthAndOMDb(userRole);
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

  it("POST gets 400 when body is missing", async () => {
    const userRole = "premium";
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
          role: userRole,
        },
      },
    });
    const { token } = signResponse.body;
    return request(app)
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
  });

  it("POST gets 400 when title is missing", async () => {
    const userRole = "premium";
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
          role: userRole,
        },
      },
    });
    const { token } = signResponse.body;
    return request(app)
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect(400);
  });

  it("POST gets 500 when title is invalid", async () => {
    const userRole = "premium";
    const signResponse = await request(authApp)
      .post("/auth/sign")
      .send({
        username: "premium-jim",
        password: "GBLtTyq3E_UNjFnpo9m6",
      })
      .expect("Content-Type", /json/)
      .expect(200);
    mockAuth(userRole);
    mockedAxios.get.mockResolvedValueOnce({
      Response: "False",
      Error: "Movie not found!",
    });
    const { token } = signResponse.body;
    return request(app)
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Blade" })
      .expect(500);
  });

  it("POST creates a movie when user is logged in (basic user)", async () => {
    const userRole = "basic";
    const title = "Blade Runner";
    const signResponse = await request(authApp)
      .post("/auth/sign")
      .send({
        username: "basic-thomas",
        password: "sR-_pcoow-27-6PAwCD8",
      })
      .expect("Content-Type", /json/)
      .expect(200);
    mockAuthAndOMDb(userRole);
    const { token } = signResponse.body;
    const response = await request(app)
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title,
      })
      .expect(200);
    const { body } = response;
    expect(body).toBeDefined();
  });

  it("POST gets 400 when trying to create more than 5 movies (basic user)", async () => {
    const userRole = "basic";
    const title = "Blade Runner";
    const signResponse = await request(authApp)
      .post("/auth/sign")
      .send({
        username: "basic-thomas",
        password: "sR-_pcoow-27-6PAwCD8",
      })
      .expect("Content-Type", /json/)
      .expect(200);

    mockAuthAndOMDb(userRole);
    const { token } = signResponse.body;
    await request(app)
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title,
      })
      .expect(200);

    mockAuthAndOMDb(userRole);
    await request(app)
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title,
      })
      .expect(200);

    mockAuthAndOMDb(userRole);
    await request(app)
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title,
      })
      .expect(200);
    mockAuthAndOMDb(userRole);
    await request(app)
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title,
      })
      .expect(200);
    mockAuthAndOMDb(userRole);
    await request(app)
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title,
      })
      .expect(200);
    mockAuthAndOMDb(userRole);
    await request(app)
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title,
      })
      .expect(400);
  });
});

const mockAuth = (userRole: string) => {
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      isAuthorized: true,
      decoded: {
        userId: 5678,
        role: userRole,
      },
    },
  });
};

const mockAuthAndOMDb = (userRole: string) => {
  mockAuth(userRole);
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
};
