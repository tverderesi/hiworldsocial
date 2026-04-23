const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB;

if (!MONGODB_URI) {
  throw new Error("Missing required environment variable: MONGODB_URI");
}

if (!process.env.SECRET_KEY) {
  throw new Error("Missing required environment variable: SECRET_KEY");
}

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});
mongoose.set("strictQuery", false);
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).then(() => {
  console.log("MongoDB connected.");
  server.listen({ port: PORT }).then((res) => {
    console.log(`Server running at ${res.url}`);
  });
});
