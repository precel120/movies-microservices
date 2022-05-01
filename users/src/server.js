const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/user");

const PORT = 3002;

const { MONGODB } = process.env;

if (!MONGODB) {
	throw new Error("Missing MONGODB env var. Set it and restart the server")
}

mongoose.connect(MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(bodyParser.json());

app.get("/users", (req, res, next) => {
  User.find({}, (error, users) => {
    if(error) {
      res.status(404).json({ error: "Couldn't find any users"});
      next(error);
    }
    return res.status(200).json(users);
  });
});

app.post("/users", async (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ error: "invalid body payload" });
  }
  const { role, name, username, password } = req.body;

  if (!role || !name || !username || !password) {
    return res.status(400).json({ error: "invalid body payload" });
  }
  try {
    const user = new User({
      role,
	  name,
	  username,
	  password,
    });
    const savedUser = await user.save();
    res.status(200).json(savedUser)
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