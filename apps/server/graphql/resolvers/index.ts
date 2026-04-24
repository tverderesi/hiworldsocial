import type { PostDocument } from "../../types";
import type { Resolvers } from "../generated";
import commentsResolvers from "./comments";
import postsResolvers from "./posts";
import usersResolvers from "./users";

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
