const express = require("express");
const bodyParser = require("body-parser");
const movieRouter = require("./routes/movies-route");

const app = express();

app.use(bodyParser.json());

app.use(movieRouter);

app.use((error, _, res, __) => {
  console.error(
    `Error processing request ${error}. See next message for details`
  );
  console.error(error);

  return res.status(500).json({ error: "internal server error" });
});

module.exports = app;
