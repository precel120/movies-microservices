const request = require("supertest");
const app = require("../../app");
require("dotenv").config();

it("receives JWT token", async () => {
	return request(app)
		.post("/auth")
		.send({
			username: "premium-jim",
			password: "GBLtTyq3E_UNjFnpo9m6"
		})
		.expect(200);
});