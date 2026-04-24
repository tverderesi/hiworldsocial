import jwt from "jsonwebtoken";
import "dotenv/config";

import { getSessionToken } from "../lib/auth";
import { createAuthenticationError } from "../lib/graphqlErrors";
import type { GraphQLContext, TokenUser } from "../types";

export default function checkAuth(context: GraphQLContext): TokenUser {
  const token = getSessionToken(context);

  if (!token) {
    throw createAuthenticationError("Authentication required.");
  }

  try {
    return jwt.verify(token, process.env.SECRET_KEY as string) as TokenUser;
  } catch {
    throw createAuthenticationError("Invalid/Expired token");
  }
}
