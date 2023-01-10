/**
 * This module exports the resolvers for all GraphQL types.
 *
 * @module resolvers
 */

// Import the resolvers for each type
const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');

module.exports = {
  /**
   * A set of resolvers for a GraphQL "Post" type
   * @module Post
   */

  Post: {
    /**
     * Resolver for the "likeCount" field of the "Post" type.
     * @function
     * @param {Object} parent - The parent object containing the "likes" field.
     * @returns {number} The number of likes the post has received.
     */
    likeCount: parent => {
      return parent.likes.length;
    },
    /**
     * Resolver for the "commentCount" field of the "Post" type.
     * @function
     * @param {Object} parent - The parent object containing the "comments" field.
     * @returns {number} The number of comments on the post.
     */
    commentCount: parent => {
      return parent.comments.length;
    },
  },

  /**
   * The resolvers for the Query type.
   *
   * @type {Object}
   */
  Query: {
    // Add the Query resolvers for the Post type
    ...postsResolvers.Query,
  },
  /**
   * The resolvers for the Mutation type.
   *
   * @type {Object}
   */
  Mutation: {
    // Add the Mutation resolvers for the User type
    ...usersResolvers.Mutation,
    // Add the Mutation resolvers for the Post type
    ...postsResolvers.Mutation,
    // Add the Mutation resolvers for the Comment type
    ...commentsResolvers.Mutation,
  },
};
