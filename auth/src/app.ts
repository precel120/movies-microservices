import express, { NextFunction, Request, Response } from "express";
import { json } from "body-parser";
import cors from "cors";
import authRoute from "./routes/auth-route";

const app = express();

app.use(json());
app.use(cors());

app.use(authRoute);

app.use((_: Error, __: Request, res: Response, ___: NextFunction) => {
  return res.status(500).json({ error: "internal server error" });
});

export default app;
