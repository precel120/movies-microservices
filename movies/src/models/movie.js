const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const movieSchema = new Schema({
	Title: { type: String, required: true },
	Released: { type: Date, required: true },
	Genre: { type: String, required: true },
	Director: { type: String, required: true }
});

module.exports = Movie = mongoose.model("movies", movieSchema);