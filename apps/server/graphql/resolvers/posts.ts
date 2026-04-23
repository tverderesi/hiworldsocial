import { AuthenticationError, UserInputError } from "apollo-server";

import Post from "../../models/Post.js";
import checkAuth from "../../utils/checkAuth.js";
import { enforcePostRateLimit } from "../../utils/postRateLimit.js";
import { validatePostBody } from "../../utils/validators.js";
import type { GraphQLContext, PostLike } from "../../types.js";

interface PostArgs {
  postId: string;
}

interface CreatePostArgs {
  body: string;
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

const postsResolvers = {
  Query: {
    async getPosts() {
      try {
        return await Post.find().sort({ createdAt: -1 });
      } catch (error) {
        throw toError(error);
      }
    },

    async getPost(_: unknown, { postId }: PostArgs) {
      try {
        const post = await Post.findById(postId);

        if (!post) {
          throw new Error("Post not found.");
        }

        return post;
      } catch (error) {
        throw toError(error);
      }
    },
  },

  Mutation: {
    async createPost(
      _: unknown,
      { body }: CreatePostArgs,
      context: GraphQLContext
    ) {
      const user = checkAuth(context);
      const { valid, errors } = validatePostBody(body);

      if (!valid) {
        throw new UserInputError("Invalid post body.", { errors });
      }

      await enforcePostRateLimit(user.id);

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        profilePicture: user.profilePicture,
        createdAt: new Date().toISOString(),
      });

      return await newPost.save();
    },

    async deletePost(_: unknown, { postId }: PostArgs, context: GraphQLContext) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);

        if (!post) {
          throw new UserInputError("Post not found.");
        }

        if (user.username !== post.username) {
          throw new AuthenticationError(
            "You can't delete posts from another user!"
          );
        }

        await post.deleteOne();
        return "Post deleted successfully.";
      } catch (error) {
        throw toError(error);
      }
    },

    async likePost(_: unknown, { postId }: PostArgs, context: GraphQLContext) {
      const { username, profilePicture } = checkAuth(context);

      const post = await Post.findById(postId);

      if (!post) {
        throw new UserInputError("Post doesn't exist.");
      }

      if (post.likes.find((like: PostLike) => like.username === username)) {
        post.likes = post.likes.filter(
          (like: PostLike) => like.username !== username
        );
      } else {
        post.likes.push({
          username,
          createdAt: new Date().toISOString(),
          profilePicture,
        });
      }

      await post.save();
      return post;
    },
  },
};

export default postsResolvers;
