const { model, Schema } = require('mongoose');

/**
 * Represents a user in the database.
 * @typedef {Object} User
 * @property {String} username - The user's username.
 * @property {String} password - The user's password.
 * @property {String} email - The user's email address.
 * @property {String} createdAt - The date and time at which the user was created.
 */
const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  profilePicture: String,
});

module.exports = model('User', userSchema);
