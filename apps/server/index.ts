import { ApolloServer } from "apollo-server";
import { config } from "dotenv";
import mongoose from "mongoose";

import resolvers from "./graphql/resolvers/index.js";
import typeDefs from "./graphql/typeDefs.js";
import type { GraphQLContext } from "./types.js";

config({ quiet: true });

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB;

if (!MONGODB_URI) {
  throw new Error("Missing required environment variable: MONGODB_URI");
}

if (!process.env.SECRET_KEY) {
  throw new Error("Missing required environment variable: SECRET_KEY");
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: "bounded",
  context: ({ req }): GraphQLContext => ({ req }),
});

mongoose.set("strictQuery", false);

await mongoose.connect(MONGODB_URI);
console.log("MongoDB connected.");

const { url } = await server.listen({ port: PORT });
console.log(`Server running at ${url}`);
