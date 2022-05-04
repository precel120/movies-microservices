import { Router, Response, Request, NextFunction } from "express";
import axios from "axios";
import { Movie } from "../models/movie";
import ValidateUser from "../middleware/userValidation";
import { CustomRequest, MovieType } from "../types";

const router = Router();
const { OMDb_SECRET } = process.env;

router.get(
  "/movies",
  ValidateUser,
  (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.dataFromMiddleware) {
      return res.status(400).json({ message: "no data from middleware" });
    }
    try {
      const { userId } = req.dataFromMiddleware;
      Movie.find({ CreatedBy: userId }, (error: Error, movies: MovieType[]) => {
        if (error) {
          return res.status(404).json({ error: "Couldn't find any movies" });
        }
        return res.status(200).json(movies);
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/movies",
  ValidateUser,
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.body) {
      return res.status(400).json({ error: "invalid body payload" });
    }
    // dataFromMiddleware comes from ValidateUser and has information such as userId, role or name
    if (!req.dataFromMiddleware) {
      return res.status(400).json({ message: "no data from middleware" });
    }
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "invalid title" });
    }
    try {
      const { userId, role } = req.dataFromMiddleware;
      // basic user can't create more than 5 movies in the same month
      if (role === "basic") {
        const retrievedUserMovies = await Movie.aggregate([
          {
            $match: {
              CreatedBy: userId,
              $expr: {
                $eq: [{ $month: "$CreatedOn" }, { $month: new Date() }],
              },
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
      // retrieve movie information from OMDb
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
  }
);

export default router;
