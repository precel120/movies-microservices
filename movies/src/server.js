const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fetch = require("cross-fetch");
const Movie = require("./models/movie");

const PORT = 3001;
const { OMDb_SECRET, MONGODB } = process.env;

if (!OMDb_SECRET) {
  throw new Error("Missing OMDb_SECRET env var. Set it and restart the server")
}
if (!MONGODB) {
  throw new Error("Missing MONGODB env var. Set it and restart the server")
}

mongoose.connect(MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(bodyParser.json());

app.get("/movies", (req, res, next) => {
  Movie.find({}, (error, movies) => {
    if(error) {
      res.status(404).json({ error: "Couldn't find any movies"});
      next(error);
    }
    return res.status(200).json(movies);
  });
});

app.post("/movies", async (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ error: "invalid body payload" });
  }
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "invalid title" });
  }
  try {
    const returnedMovies = await fetch(`http://www.omdbapi.com/?t="${title}"&apikey=${OMDb_SECRET}`);
    const jsonData = await returnedMovies.json();
    const { Title, Genre, Director, Released } = jsonData;
    const movie = new Movie({
      Title,
      Genre,
      Director,
      Released,
      CreatedBy: "Basic Thomas",
      CreatedOn: Date.now()
    });
    const savedMovie = await movie.save();
    res.status(200).json(savedMovie)
  } catch(error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
});

app.use((error, _, res, __) => {
  console.error(
    `Error processing request ${error}. See next message for details`
  );
  console.error(error);

  return res.status(500).json({ error: "internal server error" });
});

app.listen(PORT, () => {
  console.log(`auth svc running at port ${PORT}`);
});