import jwt, { SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";

interface JwtPayload {
  id: string;
  username: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

// After the check above, TypeScript knows this is a string.
const JWT_SECRET_KEY: string = JWT_SECRET;

const JWT_EXPIRES_IN: SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES_IN as StringValue) || "7d";

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
}