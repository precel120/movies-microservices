import axios from "axios";
import { Response, NextFunction } from "express";
import { CustomRequest } from "../types";

const ValidateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      return res.status(403).json({ message: "Auth header missing" });
    }
    const config = {
      headers: { Authorization: authHeader },
    };
    const retrievedData = await axios.get("http://auth:3000/verify", config);
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
