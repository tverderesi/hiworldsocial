const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = 5000 || process.env.PORT;

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true }).then(() => {
  console.log("MongoDB connected.");
  server.listen({ port: PORT }).then((res) => {
    console.log(`Server running at ${res.url}`);
  });
});
