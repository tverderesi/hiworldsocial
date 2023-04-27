/**
 * A module that handles user authentication.
 *
 * @module auth/resolvers/users
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
require('dotenv').config();

const User = require('../../models/User');
const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../utils/validators');

/**
 * Generates a JSON web token for a user.
 *
 * @param {Object} user - The user object.
 * @param {string} user.id - The ID of the user.
 * @param {string} user.email - The email of the user.
 * @param {string} user.username - The username of the user.
 * @returns {string} The generated JSON web token.
 */
const generateToken = user =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      profilePicture: user.profilePicture,
    },
    process.env.SECRET_KEY,
    { expiresIn: '1h' }
  );

module.exports = {
  Mutation: {
    /**
     * GraphQL mutation for logging in a user.
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @returns {Object} An object containing the user's information and a token.
     * @throws {UserInputError} If the provided login information is invalid.
     */
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);
      const user = await User.findOne({ username });

      if (!valid) {
        throw new UserInputError('Wrong credentials.', { errors });
      }

      if (!user) {
        errors.general = 'User not found!';
        throw new UserInputError('User not found.', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new UserInputError('Wrong credentials.', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user.id,
        token,
      };
    },

    /**
     * GraphQL mutation for registering a new user.
     * @param {Object} registerInput - An object containing the registration information for the new user.
     * @param {string} registerInput.username - The username for the new user.
     * @param {string} registerInput.email - The email for the new user.
     * @param {string} registerInput.password - The password for the new user.
     * @param {string} registerInput.confirmPassword - The password confirmation for the new user.
     * @returns {Object} An object containing the user's information and a token.
     * @throws {UserInputError} If the provided registration information is invalid or the username or email is already in use.
     */
    async register(
      _, // parent argument
      {
        registerInput: {
          username,
          email,
          password,
          confirmPassword,
          profilePicture,
        },
      } // args argument
    ) {
      // validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      // make sure username doesn't already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Username is taken.', {
          errors: {
            username: 'This username is taken!',
          },
        });
      }

      // make sure email doesn't already exist
      const uniqueEmail = await User.findOne({ email });
      if (uniqueEmail) {
        throw new UserInputError('Email is already registered.', {
          errors: {
            username: 'This email is already registered.',
          },
        });
      }

      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
        profilePicture,
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res.id,
        token,
      };
    },
  },
};
