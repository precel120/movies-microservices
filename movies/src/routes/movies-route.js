const express = require("express");
const axios = require("axios");
const Movie = require("../models/movie");
const ValidateUser = require("../middleware/userValidation");

const router = express.Router();
const { OMDb_SECRET } = process.env;

router.get("/movies", ValidateUser, (req, res, next) => {
  try {
    const { userId } = req.user;
    Movie.find({ CreatedBy: userId }, (error, movies) => {
      if (error) {
        return res.status(404).json({ error: "Couldn't find any movies" });
      }
      return res.status(200).json(movies);
    });
  } catch (error) {
    next(error);
  }
});

router.post("/movies", ValidateUser, async (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ error: "invalid body payload" });
  }
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "invalid title" });
  }
  try {
    const { userId, role } = req.user;
    if (role === "basic") {
      const retrievedUserMovies = await Movie.aggregate([
        {
          $match: {
            CreatedBy: userId,
            $expr: { $eq: [{ $month: "$CreatedOn" }, { $month: new Date() }] },
          },
        },
      ]);
      const createdOnUserMoviesDates = retrievedUserMovies.map(
        ({ CreatedOn }) => CreatedOn
      );
      if (createdOnUserMoviesDates.length >= 5) {
        return res
          .status(400)
          .json({ error: "Basic users can only insert 5 movies per month" });
      }
    }

    const retrievedOMDBMovies = await axios.get(
      `http://www.omdbapi.com/?t="${title}"&apikey=${OMDb_SECRET}`
    );
    const { data } = retrievedOMDBMovies;
    const { Title, Genre, Director, Released } = data;
    const movie = new Movie({
      Title,
      Genre,
      Director,
      Released,
      CreatedBy: userId,
      CreatedOn: Date.now(),
    });
    const savedMovie = await movie.save();
    return res.status(200).json(JSON.stringify(savedMovie));
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
