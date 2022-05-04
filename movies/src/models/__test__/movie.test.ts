import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { MovieType } from "../../types";
import { Movie } from "../movie";

let mongo: MongoMemoryServer;
const movieInfo: MovieType = {
  Title: "Blade Runner",
  Released: new Date("1990-10-10"),
  Genre: "action",
  Director: "Ridley Scott",
  CreatedBy: 1234,
  CreatedOn: new Date(),
};
describe("Movie Model tests", () => {
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

  it("creates a movie", async () => {
    await createMovie();
  });

  it("gets a list of movies", async () => {
    await createMovie();
    await createMovie();

    const foundMovies = await Movie.find({});
    expect(foundMovies).toBeDefined();
    expect(foundMovies).toHaveLength(2);
  });

  it("gets movies created by user this month", async () => {
    await createMovie();
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 2);
    movieInfo.CreatedOn = currentDate;
    await createMovie();
    const allUserMovies = await Movie.find({ CreatedBy: movieInfo.CreatedBy });
    expect(allUserMovies).toHaveLength(2);
    const retrievedUserMovies = await Movie.aggregate([
      {
        $match: {
          CreatedBy: movieInfo.CreatedBy,
          $expr: {
            $eq: [{ $month: "$CreatedOn" }, { $month: new Date() }],
          },
        },
      },
    ]);
    expect(retrievedUserMovies).toHaveLength(1);
  });
});

const createMovie = async (movieData = movieInfo) => {
  const movie = new Movie(movieData);
  const savedMovie = await movie.save();
  expect(savedMovie.Title).toEqual(movieInfo.Title);
  return savedMovie;
};
