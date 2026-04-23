import { ApolloServer } from "apollo-server";

import schema from "./graphql/schema.js";
import type { GraphQLContext } from "./types.js";

export function createApolloServer() {
  if (!process.env.SECRET_KEY) {
    throw new Error("Missing required environment variable: SECRET_KEY");
  }

  const isDevelopment = process.env.NODE_ENV !== "production";

  return new ApolloServer({
    schema,
    cache: "bounded",
    introspection: isDevelopment,
    ...(isDevelopment ? { playground: true } : {}),
    context: ({ req }): GraphQLContext => ({ req }),
  });
}
