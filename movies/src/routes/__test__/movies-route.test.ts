const request = require("supertest");
const app = require("../../app");

it("gets movies when user is logged in", async () => {
	return request(app)
		.get("http://movies:3001")
		.send({
			
		})
});