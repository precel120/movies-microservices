import { Request } from "express";
import jwt from "jsonwebtoken";
import { ValidationResponse } from "./types";

const users = [
  {
    id: 123,
    role: "basic",
    name: "Basic Thomas",
    username: "basic-thomas",
    password: "sR-_pcoow-27-6PAwCD8",
  },
  {
    id: 434,
    role: "premium",
    name: "Premium Jim",
    username: "premium-jim",
    password: "GBLtTyq3E_UNjFnpo9m6",
  },
];

class AuthError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

const authFactory = (secret: jwt.Secret) => {
  return {
    GenerateToken(username: String, password: String) {
      const user = users.find((u) => u.username === username);

      if (!user || user.password !== password) {
        throw new AuthError("invalid username or password");
      }

      return jwt.sign(
        {
          userId: user.id,
          name: user.name,
          role: user.role,
        },
        secret,
        {
          issuer: "https://www.netguru.com/",
          subject: `${user.id}`,
          expiresIn: 30 * 60,
        }
      );
    },
    ValidateSignature(req: Request) {
      try {
        const signature = req.get("Authorization");
        if (!signature) {
          throw new AuthError("invalid signature");
        }
        const data: ValidationResponse = {
          isAuthorized: false,
        };
        if (signature) {
          const payload = jwt.verify(signature.split(" ")[1], secret);
          if (payload) {
            data.isAuthorized = true;
            data.decoded = payload;
          }
        }
        return data;
      } catch (error) {
        throw new AuthError("validating signature failed");
      }
    },
  };
};

export { authFactory, AuthError };
