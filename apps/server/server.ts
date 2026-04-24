import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

import schema from "./graphql/schema.js";
import type { GraphQLContext } from "./types.js";

const allowedOrigins = [
  "https://hiworldsocial.vercel.app",
  "https://hiworldsocial.social",
  "http://localhost:3000",
  "http://localhost:5173",
];

export function createApolloServer() {
  if (!process.env.SECRET_KEY) {
    throw new Error("Missing required environment variable: SECRET_KEY");
  }

  const isDevelopment = process.env.NODE_ENV !== "production";

  return new ApolloServer({
    schema,
    cache: "bounded",
    introspection: isDevelopment,

    cors: {
      origin: allowedOrigins,
      credentials: true,
    },

    ...(isDevelopment ? { playground: true } : {}),

    context: ({ req }): GraphQLContext => ({ req }),
  });
}
