import axios from "axios";
import { Response, NextFunction } from "express";
import { CustomRequest } from "../types";

const ValidateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // JWT token is provided in Authorization header
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      return res.status(403).json({ message: "Auth header missing" });
    }
    const config = {
      headers: { Authorization: authHeader },
    };
    // call to auth service to verify the user
    const retrievedData = await axios.get(
      "http://auth:3000/auth/verify",
      config
    );
    const { data } = retrievedData;
    const { isAuthorized, decoded } = data;
    if (isAuthorized) {
      req.dataFromMiddleware = decoded;
      return next();
    }
  } catch (error) {
    return res.status(403).json({ message: "Not Authorized" });
  }
};

export default ValidateUser;
