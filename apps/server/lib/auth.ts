import jwt from "jsonwebtoken";

import type {
  GraphQLContext,
  PublicUser,
  TokenUser,
  UserDocument,
} from "../types.js";

const SESSION_COOKIE_NAME = "session";
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

export function parseCookies(
  cookieHeader: string | undefined
): Record<string, string> {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(";").reduce<Record<string, string>>((cookies, part) => {
    const [rawName, ...rawValue] = part.trim().split("=");

    if (!rawName || rawValue.length === 0) {
      return cookies;
    }

    cookies[rawName] = decodeURIComponent(rawValue.join("="));
    return cookies;
  }, {});
}

export function getSessionToken(context: GraphQLContext): string | null {
  const authHeader = readHeader(context.req?.headers, "authorization");

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }

  const cookieHeader = readHeader(context.req?.headers, "cookie");
  const cookies = parseCookies(cookieHeader);

  return cookies[SESSION_COOKIE_NAME] ?? null;
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

function serializeCookie(value: string, maxAge: number): string {
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];

  if (process.env.NODE_ENV === "production") {
    parts.push("Secure");
  }

  return parts.join("; ");
}

export function setSessionCookie(context: GraphQLContext, token: string) {
  context.res?.setHeader("Set-Cookie", serializeCookie(token, SESSION_DURATION_SECONDS));
}

export function clearSessionCookie(context: GraphQLContext) {
  context.res?.setHeader("Set-Cookie", serializeCookie("", 0));
}

export function toPublicUser(user: UserDocument | PublicUser): PublicUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    profilePicture: user.profilePicture,
  };
}
