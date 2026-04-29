import jwt from "jsonwebtoken";

import type {
  GraphQLContext,
  PublicUser,
  TokenUser,
  UserDocument,
} from "../types";

const SESSION_DURATION_SECONDS = 60 * 60;

function readHeader(
  headers: Record<string, string | string[] | undefined> | undefined,
  name: string
): string | undefined {
  const value = headers?.[name];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function getSessionToken(context: GraphQLContext): string | null {
  const authHeader = readHeader(context.req?.headers, "authorization");
  const [scheme, token] = authHeader?.split(" ") ?? [];

  if (scheme?.toLowerCase() === "bearer" && token) {
    return token;
  }

  return null;
}

export function generateToken(user: UserDocument): string {
  const payload: TokenUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    profilePicture: user.profilePicture,
  };

  return jwt.sign(payload, process.env.SECRET_KEY as string, {
    expiresIn: `${SESSION_DURATION_SECONDS}s`,
  });
}

export function toPublicUser(user: UserDocument | PublicUser): PublicUser {
  const token = "token" in user ? user.token : undefined;

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    profilePicture: user.profilePicture,
    preferredLanguage: user.preferredLanguage ?? null,
    token,
  };
}
