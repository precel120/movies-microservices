const mongoose = require("mongoose");
const app = require("./app");

const PORT = 3001;
const { OMDb_SECRET, MONGODB } = process.env;

if (!OMDb_SECRET) {
  throw new Error("Missing OMDb_SECRET env var. Set it and restart the server");
}
if (!MONGODB) {
  throw new Error("Missing MONGODB env var. Set it and restart the server");
}

mongoose.connect(MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`movies svc running at port ${PORT}`);
});
