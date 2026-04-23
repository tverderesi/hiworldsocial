const { model, Schema } = require('mongoose');
/**
 * Represents a post in the database.
 * @typedef {Object} Post
 * @property {String} body - The content of the post.
 * @property {String} username - The username of the user who created the post.
 * @property {String} createdAt - The date and time at which the post was created.
 * @property {[{ body: String, createdAt: String, username: String }]} comments - The comments on the post.
 * @property {[{ username: String, createdAt: String }]} likes - The likes on the post.
 * @property {Schema.Types.ObjectId} user - The ID of the user who created the post.
 */
const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  profilePicture: String,
  comments: [
    {
      body: String,
      createdAt: String,
      username: String,
      profilePicture: String,
    },
  ],
  likes: [{ username: String, createdAt: String, profilePicture: String }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
});

module.exports = model('Post', postSchema);
