import { Router, Request, Response, NextFunction } from "express";
import { authFactory, AuthError } from "../auth";

const { JWT_SECRET } = process.env;

const router = Router();
const { GenerateToken, ValidateSignature } = authFactory(JWT_SECRET!);

router.post("/auth/sign", (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) {
    return res.status(400).json({ error: "invalid payload" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "invalid payload" });
  }

  try {
    const token = GenerateToken(username, password);

    return res.status(200).json({ token });
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(401).json({ error: error.message });
    }

    next(error);
  }
});

router.get("/auth/verify", (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationData = ValidateSignature(req);
    return res.status(200).json(validationData);
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(401).json({ error: error.message });
    }
    next(error);
  }
});

export default router;
