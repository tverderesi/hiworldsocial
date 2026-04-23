import commentsResolvers from "./comments.js";
import type { Resolvers } from "../generated.js";
import postsResolvers from "./posts.js";
import usersResolvers from "./users.js";
import type { PostDocument } from "../../types.js";

const resolvers: Resolvers = {
  Post: {
    likeCount: (parent: PostDocument) => parent.likes.length,
    commentCount: (parent: PostDocument) => parent.comments.length,
  },

  Query: {
    ...postsResolvers.Query,
    ...usersResolvers.Query,
  },

  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
};

export default resolvers;
