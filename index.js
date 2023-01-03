const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const gql = require('graphql-tag');

const { MONGODB } = require('./config');
const Post = require('./modules/Post');

const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }
  type Query {
    getPosts: [Post]
  }
`;

const resolvers = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find();
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

mongoose.connect(MONGODB, { useNewUrlParser: true }).then(() => {
  console.log('MongoDB connected.');
  server.listen({ port: 5000 }).then(res => {
    console.log(`Server running at ${res.url}`);
  });
});
