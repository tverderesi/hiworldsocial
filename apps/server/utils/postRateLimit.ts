import { ApolloError } from "apollo-server";

import Post from "../models/Post.js";

const DEFAULT_POST_RATE_LIMIT_MAX_POSTS = 5;
const DEFAULT_POST_RATE_LIMIT_WINDOW_SECONDS = 60;

function readPositiveInteger(
  value: string | undefined,
  fallback: number
): number {
  const parsed = Number.parseInt(value ?? "", 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getPostRateLimitConfig() {
  return {
    maxPosts: readPositiveInteger(
      process.env.POST_RATE_LIMIT_MAX_POSTS,
      DEFAULT_POST_RATE_LIMIT_MAX_POSTS
    ),
    windowSeconds: readPositiveInteger(
      process.env.POST_RATE_LIMIT_WINDOW_SECONDS,
      DEFAULT_POST_RATE_LIMIT_WINDOW_SECONDS
    ),
  };
}

export async function enforcePostRateLimit(userId: string) {
  const { maxPosts, windowSeconds } = getPostRateLimitConfig();
  const now = Date.now();
  const windowStart = new Date(now - windowSeconds * 1000).toISOString();

  const recentPostCount = await Post.countDocuments({
    user: userId,
    createdAt: { $gte: windowStart },
  });

  if (recentPostCount < maxPosts) {
    return;
  }

  const oldestPostInWindow = await Post.findOne({
    user: userId,
    createdAt: { $gte: windowStart },
  })
    .sort({ createdAt: 1 })
    .select({ createdAt: 1 });

  const retryAfterSeconds = oldestPostInWindow?.createdAt
    ? Math.max(
        1,
        Math.ceil(
          (new Date(oldestPostInWindow.createdAt).getTime() +
            windowSeconds * 1000 -
            now) /
            1000
        )
      )
    : windowSeconds;

  const message = `Rate limit exceeded. You can create up to ${maxPosts} posts every ${windowSeconds} seconds. Try again in ${retryAfterSeconds} seconds.`;

  throw new ApolloError(message, "TOO_MANY_REQUESTS", {
    errors: {
      rateLimit: message,
    },
    retryAfterSeconds,
  });
}
