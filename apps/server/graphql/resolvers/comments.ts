import { AuthenticationError, UserInputError } from "apollo-server";

import Post from "../../models/Post.js";
import checkAuth from "../../utils/checkAuth.js";
import type { GraphQLContext, PostComment } from "../../types.js";

interface CreateCommentArgs {
  postId: string;
  body: string;
}

interface DeleteCommentArgs {
  postId: string;
  commentId: string;
}

const commentsResolvers = {
  Mutation: {
    async createComment(
      _: unknown,
      { postId, body }: CreateCommentArgs,
      context: GraphQLContext
    ) {
      const { username, profilePicture } = checkAuth(context);
      const post = await Post.findById(postId);

      switch (true) {
        case body.trim() === "":
          throw new UserInputError("Empty comment.", {
            errors: { body: "Comment body must not be empty." },
          });
        case !username:
          throw new Error(`user not found. ${username}`);
        case !post:
          throw new UserInputError("Post not found!");
        default:
          post.comments.unshift({
            body,
            profilePicture,
            username,
            createdAt: new Date().toISOString(),
          });

          await post.save();
          return post;
      }
    },

    async deleteComment(
      _: unknown,
      { postId, commentId }: DeleteCommentArgs,
      context: GraphQLContext
    ) {
      const { username } = checkAuth(context);
      const post = await Post.findById(postId);

      if (!post) {
        throw new UserInputError("Post not found!");
      }

      const commentIdx = post.comments.findIndex(
        (comment: PostComment) => comment.id === commentId
      );

      switch (true) {
        case commentIdx === -1:
          throw new UserInputError("Comment not found!");
        case post.comments[commentIdx]?.username !== username:
          throw new AuthenticationError(
            "Action not allowed. Comment wasn't made by the authenticated user."
          );
        default:
          post.comments.splice(commentIdx, 1);
          await post.save();
          return post;
      }
    },
  },
};

export default commentsResolvers;
