import mongoose from "mongoose";
import { MovieType } from "../types";

const Schema = mongoose.Schema;

const movieSchema = new Schema<MovieType>({
  Title: { type: String, required: true },
  Released: { type: Date, required: true },
  Genre: { type: String, required: true },
  Director: { type: String, required: true },
  CreatedBy: { type: Number, required: true },
  CreatedOn: { type: Date, required: true },
});

const Movie = mongoose.model("movies", movieSchema);

export { Movie };
