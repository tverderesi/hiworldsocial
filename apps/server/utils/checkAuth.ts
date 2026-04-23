import { AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";
import "dotenv/config";

import type { GraphQLContext, TokenUser } from "../types.js";

export default function checkAuth(context: GraphQLContext): TokenUser {
  const authHeader = context.req.headers.authorization;

  if (!authHeader) {
    throw new Error("Authorization header must be provided.");
  }

  const token = authHeader.split("Bearer ")[1];

  if (!token) {
    throw new Error("Authentication token must be 'Bearer [token]' ");
  }

  try {
    return jwt.verify(token, process.env.SECRET_KEY as string) as TokenUser;
  } catch {
    throw new AuthenticationError("Invalid/Expired token");
  }
}
