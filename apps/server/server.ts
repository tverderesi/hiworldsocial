import { ApolloServer } from "apollo-server";

import resolvers from "./graphql/resolvers/index.js";
import typeDefs from "./graphql/typeDefs.js";
import type { GraphQLContext } from "./types.js";

export function createApolloServer() {
  if (!process.env.SECRET_KEY) {
    throw new Error("Missing required environment variable: SECRET_KEY");
  }

  const isDevelopment = process.env.NODE_ENV !== "production";

  return new ApolloServer({
    typeDefs,
    resolvers,
    cache: "bounded",
    introspection: isDevelopment,
    ...(isDevelopment ? { playground: true } : {}),
    context: ({ req }): GraphQLContext => ({ req }),
  });
}
