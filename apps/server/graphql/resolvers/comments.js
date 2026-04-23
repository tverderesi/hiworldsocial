const { UserInputError, AuthenticationError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../utils/checkAuth");

module.exports = {
  Mutation: {
    /**
     * Creates a new comment on a post.
     *
     * @param {Object} _ - The parent object. In a GraphQL API, this is often empty.
     * @param {Object} args - The arguments for the mutation.
     * @param {string} args.postId - The ID of the post to add the comment to.
     * @param {string} args.body - The body of the comment.
     * @param {Object} context - The context object, containing the authenticated user's credentials.
     * @returns {Object} The updated post object.
     * @throws {UserInputError} If the comment body is an empty string.
     * @throws {Error} If the authenticated user cannot be found.
     * @throws {UserInputError} If the post cannot be found.
     */
    createComment: async (_, { postId, body }, context) => {
      // Retrieve the authenticated user's credentials
      const { username, profilePicture } = checkAuth(context);

      post = await Post.findById(postId);
      // Check for different conditions and throw appropriate errors if necessary
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
          // Add the new comment to the beginning of the post's comments array
          post.comments.unshift({
            body,
            profilePicture,
            username,
            createdAt: new Date().toISOString(),
          });
          // Save the updated post to the database
          await post.save();
          // Return the updated post
          return post;
      }
    },
    /**
     * Deletes a comment from a post.
     *
     * @param {Object} _ - The parent object. In a GraphQL API, this is often empty.
     * @param {Object} args - The arguments for the mutation.
     * @param {string} args.postId - The ID of the post containing the comment to delete.
     * @param {string} args.commentId - The ID of the comment to delete.
     * @param {Object} context - The context object, containing the authenticated user's credentials.
     * @returns {Object} The updated post object.
     * @throws {UserInputError} If the post cannot be found.
     * @throws {UserInputError} If the comment cannot be found.
     * @throws {AuthenticationError} If the authenticated user did not make the comment.
     */
    deleteComment: async (_, { postId, commentId }, context) => {
      // Retrieve the authenticated user's credentials from the context object
      const { username } = checkAuth(context);

      // Find the post by its ID
      const post = await Post.findById(postId);

      // Find the index of the comment within the post's comments array
      const commentIdx = post.comments.findIndex(
        (comment) => comment.id === commentId
      );

      // Use a switch statement to handle different cases
      switch (true) {
        // If the post cannot be found, throw a UserInputError
        case !post:
          throw new UserInputError("Post not found!");
        // If the comment cannot be found, throw a UserInputError
        case commentIdx === -1:
          throw new UserInputError("Comment not found!");
        // If the authenticated user did not make the comment, throw an AuthenticationError
        case post.comments[commentIdx].username !== username:
          throw new AuthenticationError(
            "Action not allowed. Comment wasn't made by the authenticated user."
          );
        // If none of the above cases are true, delete the comment
        default:
          post.comments.splice(commentIdx, 1);
          // Save the updated post to the database
          await post.save();
          // Return the updated post
          return post;
      }
    },
  },
};
