import jwt from "jsonwebtoken";

export interface ValidationResponse {
  isAuthorized: boolean;
  decoded?: string | jwt.JwtPayload;
}
