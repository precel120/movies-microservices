import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface MovieType {
  Title: String;
  Released: Date;
  Genre: String;
  Director: String;
  CreatedBy: Number;
  CreatedOn: Date;
}

export interface UserType {
  userId: String;
  id: Number;
  role: String;
  name: String;
  username: String;
  password: String;
}

export interface CustomRequest extends Request {
  dataFromMiddleware?: UserType;
}
