const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	role: { type: String, required: true },
	name: { type: String, required: true },
	username: { type: String, required: true },
	password: { type: String, required: true },
});

module.exports = User = mongoose.model("users", userSchema);