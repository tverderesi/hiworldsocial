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
