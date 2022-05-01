const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Movie = require("../../movies/src/models/movie")

const PORT = 3001;
const { OMDb_SECRET } = process.env;

if (!OMDb_SECRET) {
  throw new Error("Missing OMDb_SECRET env var. Set it and restart the server")
}

mongoose.connect("mongodb://mongo:27017/docker-node-mongo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(bodyParser.json());

app.post("/movies", async (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ error: "invalid body payload" });
  }
  console.log(req.body)
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "invalid title" });
  }

  const returnedMovies = await fetch(`http://www.omdbapi.com/?t="${title}"&apikey=${OMDb_SECRET}`);
  console.log(returnedMovies);
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