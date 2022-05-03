import express, { NextFunction, Request, Response } from "express";
import { json } from "body-parser";
import authRoute from "./routes/auth-route";

const app = express();

app.use(json());

app.use(authRoute);

app.use((error: Error, _: Request, res: Response, __: NextFunction) => {
  console.error(
    `Error processing request ${error}. See next message for details`
  );
  console.error(error);

  return res.status(500).json({ error: "internal server error" });
});

export {app};
