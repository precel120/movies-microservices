import {app} from "./app";

const PORT = 3000;

if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET env var. Set it and restart the server");
}

app.listen(PORT, () => {
  console.log(`auth svc running at port ${PORT}`);
});
