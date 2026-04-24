import { AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";
import "dotenv/config";

import { getSessionToken } from "../lib/auth.js";
import type { GraphQLContext, TokenUser } from "../types.js";

export default function checkAuth(context: GraphQLContext): TokenUser {
  const token = getSessionToken(context);

  if (!token) {
    throw new AuthenticationError("Authentication required.");
  }

  try {
    return jwt.verify(token, process.env.SECRET_KEY as string) as TokenUser;
  } catch {
    throw new AuthenticationError("Invalid/Expired token");
  }
}
