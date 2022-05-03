import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import {app} from "../../app";

let mongo: MongoMemoryServer;
describe("", () => {
  beforeAll(async () => {
	  mongo = new MongoMemoryServer();
	  const mongoUri = await mongo.getUri();
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
//   it("gets movies when user is logged in", async () => {
// 	  return request()
// 	  return request(app)
// 		  .get("/movies")
// 		  .send({
// 			  title: "Blade Runner"
// 		  })
//   });
})
