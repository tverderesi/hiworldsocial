import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

import schema from "./graphql/schema.js";
import type { GraphQLContext } from "./types.js";

export function getAllowedOrigins() {
  return Array.from(
    new Set(
      [
        process.env.CLIENT_URL,
        process.env.APP_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://hiworld.social",
        "http://server.hiworld.social",
      ].filter((origin): origin is string => Boolean(origin))
    )
  );
}

export function createApolloServer() {
  if (!process.env.SECRET_KEY) {
    throw new Error("Missing required environment variable: SECRET_KEY");
  }

  const isDevelopment = process.env.NODE_ENV !== "production";

  return new ApolloServer({
    schema,
    cache: "bounded",
    introspection: isDevelopment,
    plugins: isDevelopment
      ? [
          ApolloServerPluginLandingPageGraphQLPlayground({
            endpoint: "/graphql",
          }),
        ]
      : [],
    context: ({ req, res }): GraphQLContext => ({ req, res }),
  });
}