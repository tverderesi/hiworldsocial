const gql = require("graphql-tag");
/**
 * Represents a post.
 * @typedef {Object} Post
 * @property {ID!} id - The unique identifier for the post.
 * @property {String!} body - The content of the post.
 * @property {String!} createdAt - The date and time at which the post was created.
 * @property {String!} username - The username of the user who created the post.
 * @property {[Comment]!} comments - The comments on the post.
 * @property {[Like]!} likes - The likes on the post.
 */

/**
 * Represents a comment.
 * @typedef {Object} Comment
 * @property {ID!} id - The unique identifier for the comment.
 * @property {String!} username - The username of the user who posted the comment.
 * @property {String!} createdAt - The date and time at which the comment was created.
 * @property {String!} body - The content of the comment.
 */

/**
 * Represents a like.
 * @typedef {Object} Like
 * @property {ID!} id - The unique identifier for the like.
 * @property {String!} createdAt - The date and time at which the like was created.
 * @property {String!} username - the username which liked the post.
 */

/**
 * * Represents the input for the register mutation.
 * @typedef {Object} RegisterInput
 * @property {String!} username - The desired username.
 * @property {String!} password - The desired password.
 * @property {String!} confirmPassword - The password confirmation.
 * @property {String!} email - The user's email address.
 */

/**
 * Represents the root query for the GraphQL API.
 * @typedef {Object} Query
 * @property {[Post]} getPosts - Returns a list of all posts.
 * @property {Post} getPost(postId: ID!) - Returns a single post with the given ID.
 */

/**
 * Represents a user.
 * @typedef {Object} User
 * @property {ID!} id - The unique identifier for the user.
 * @property {String!} email - The user's email address.
 * @property {String!} token - The JSON web token for the user.
 * @property {String!} username - The user's username.
 * @property {String!} createdAt - The date and time at which the user was created.
 */
/**
 * Represents the root mutation for the GraphQL API.
 * @typedef {Object} Mutation
 * @property {User!} register(registerInput: RegisterInput) - Registers a new user with the given input.
 * @property {User!} login(username: String!, password: String!) - Logs in an existing user with the given username and password.
 * @property {Post!} createPost(body: String!) - Creates a new post with the given body.
 * @property {String!} deletePost(postId: ID!) - Deletes the post with the given ID.
 * @property {Post!} createComment(postId: String!, body: String!) - Creates a new comment on the post with the given ID and body.
 * @property {Post!} deleteComment(postId: String!, commentId: String!) - Deletes the comment with the given ID from the post with the given ID.
 * @property {Post!} likePost(postId: ID!) - Likes the post with the given ID.
 */

const typeDefs = gql`
  type Like {
    id: ID!
    createdAt: String!
    username: String!
    profilePicture: String!
  }

  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
    profilePicture: String!
  }

  type Comment {
    id: ID!
    username: String!
    createdAt: String!
    body: String!
    profilePicture: String!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
    profilePicture: String!
  }
  input UpdateProfileInput {
    username: String!
    email: String!
    oldPassword: String
    newPassword: String
    profilePicture: String
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
    getUser(username: String!): User
    getUsers: [User]
  }

  type User {
    id: ID!
    username: String!
    password: String!
    email: String!
    token: String!
    createdAt: String!
    profilePicture: String!
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: String!, commentId: String!): Post!
    likePost(postId: ID!): Post!
    updateUser(updateProfileInput: UpdateProfileInput!): User!
  }
`;

module.exports = typeDefs;
