const { AuthenticationError, UserInputError } = require('apollo-server');
const Post = require('../../models/Post');
const checkAuth = require('../../utils/checkAuth');

module.exports = {
  /**
   * The resolvers for the Query type.
   *
   * @type {Object}
   */
  Query: {
    /**
     * Retrieves all posts, sorted by creation date in descending order.
     *
     * @returns {Array} An array of post objects.
     * @throws {Error} If there is an error while querying the database.
     */
    async getPosts() {
      try {
        // Retrieve all posts from the database, sorted by creation date in descending order
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        // If there is an error, throw it
        throw new Error(err);
      }
    },
    /**
     * Retrieves a post by its ID.
     *
     * @param {Object} _ - The parent object. In a GraphQL API, this is often empty.
     * @param {Object} args - The arguments for the query.
     * @param {string} args.postId - The ID of the post to retrieve.
     * @returns {Object} The post object.
     * @throws {Error} If there is an error while querying the database.
     * @throws {Error} If the post cannot be found.
     */
    async getPost(_, { postId }) {
      try {
        // Retrieve the post by its ID
        const post = await Post.findById(postId);
        if (post) {
          // If the post exists, return it
          return post;
        } else {
          // If the post does not exist, throw an error
          throw new Error('Post not found.');
        }
      } catch (err) {
        // If there is an error, throw it
        throw new Error(err);
      }
    },
  },

  Mutation: {
    /**
     * Creates a new post.
     *
     * @param {Object} _ - The parent object. In a GraphQL API, this is often empty.
     * @param {Object} args - The arguments for the mutation.
     * @param {string} args.body - The body of the post.
     * @param {Object} context - The context of the request.
     * @param {Object} context.req - The request object.
     * @param {string} context.req.headers.authorization - The authorization header.
     * @returns {Object} The created post object.
     * @throws {AuthenticationError} If the request is not authenticated.
     */
    async createPost(_, { body }, context) {
      // Get the authenticated user
      const user = checkAuth(context);
      // Create a new post
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });
      // Save the post to the database and return it
      const post = await newPost.save();
      return post;
    },
    /**
     * Deletes a post.
     *
     * @param {Object} _ - The parent object. In a GraphQL API, this is often empty.
     * @param {Object} args - The arguments for the mutation.
     * @param {string} args.postId - The ID of the post to delete.
     * @param {Object} context - The context of the request.
     * @param {Object} context.req - The request object.
     * @param {string} context.req.headers.authorization - The authorization header.
     * @returns {string} A message indicating that the post was deleted successfully.
     * @throws {AuthenticationError} If the request is not authenticated.
     * @throws {Error} If there is an error while querying the database.
     * @throws {AuthenticationError} If the authenticated user is not the owner of the post.
     */
    async deletePost(_, { postId }, context) {
      // Get the authenticated user
      const user = checkAuth(context);
      try {
        // Retrieve the post by its ID
        const post = await Post.findById(postId);
        // Check if the authenticated user is the owner of the post
        if (user.username === post.username) {
          // If the authenticated user is the owner of the post, delete it
          await post.delete();
          // Return a message indicating that the post was deleted successfully
          return 'Post deleted successfully.';
        } else {
          // If the authenticated user is not the owner of the post, throw an error
          throw new AuthenticationError(
            "You can't delete posts from another user!"
          );
        }
      } catch (err) {
        // If there is an error, throw it
        throw new Error(err);
      }
    },
    /**
     * Like a post.
     *
     * @param {Object} _ - The first parameter is not used.
     * @param {Object} param1 - The second parameter contains the postId.
     * @param {Object} context - The third parameter is the context object.
     * @returns {Object} - The updated post object.
     * @throws {UserInputError} - If the post doesn't exist.
     */
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find(like => like.username === username)) {
          //Post was already liked, unlike it.
          post.likes = post.likes.filter(like => like.username !== username);
        } else {
          //Not Liked, like post
          post.likes.push({ username, createdAt: new Date().toISOString() });
        }
        await post.save();
        return post;
      } else throw new UserInputError("Post doesn't exist.");
    },
  },
};
