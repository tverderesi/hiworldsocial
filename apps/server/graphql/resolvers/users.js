/**
 * A module that handles user authentication.
 *
 * @module auth/resolvers/users
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
require("dotenv").config();

const User = require("../../models/User");
const {
  validateRegisterInput,
  validateLoginInput,
  validateUsername,
  validatePassword,
} = require("../../utils/validators");

/**
 * Generates a JSON web token for a user.
 *
 * @param {Object} user - The user object.
 * @param {string} user.id - The ID of the user.
 * @param {string} user.email - The email of the user.
 * @param {string} user.username - The username of the user.
 * @returns {string} The generated JSON web token.
 */
const generateToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      profilePicture: user.profilePicture,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
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
        throw new UserInputError("Wrong credentials.", { errors });
      }

      if (!user) {
        errors.general = "User not found!";
        throw new UserInputError("User not found.", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new UserInputError("Wrong credentials.", { errors });
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
        throw new UserInputError("Errors", { errors });
      }

      // make sure username doesn't already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is taken.", {
          errors: {
            username: "This username is taken!",
          },
        });
      }

      // make sure email doesn't already exist
      const uniqueEmail = await User.findOne({ email });
      if (uniqueEmail) {
        throw new UserInputError("Email is already registered.", {
          errors: {
            username: "This email is already registered.",
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
    /**
     * Update user profile.
     *
     * @param {Object} _ - The parent object (unused).
     * @param {Object} updateProfileInput - The input object containing profile update fields.
     * @param {string} updateProfileInput.oldUsername - The old username of the user.
     * @param {string} updateProfileInput.newUsername - The new username to update (optional).
     * @param {string} updateProfileInput.email - The new email to update (optional).
     * @param {string} updateProfileInput.oldPassword - The old password for authentication.
     * @param {string} updateProfileInput.newPassword - The new password to update (optional).
     * @param {string} updateProfileInput.profilePicture - The new profile picture to update (optional).
     * @returns {Object} - The updated user object.
     * @throws {UserInputError} - If the user is not found, credentials are wrong, or validation errors occur.
     */

    async updateUser(
      _,
      {
        updateProfileInput: {
          oldUsername,
          newUsername,
          email,
          oldPassword,
          newPassword,
          confirmPassword,
          profilePicture,
        },
      }
    ) {
      // Find the user in the database
      console.log(oldUsername, oldPassword, newUsername, newPassword, email);
      const user = await User.findOne({ username: oldUsername });

      // Check if user exists
      if (!user) {
        throw new UserInputError("User not found.", {
          errors: {
            username: "User not found.",
          },
        });
      }

      const match = await bcrypt.compare(oldPassword, user.password);
      if (!match) {
        throw new UserInputError("Wrong credentials.", {
          errors: {
            password: "Wrong credentials.",
          },
        });
      }

      // Update user's username if it's different
      if (newUsername && newUsername !== user.username) {
        // Validate username
        const { valid: usernameValid, errors: usernameErrors } =
          validateUsername(newUsername);
        if (!usernameValid) {
          throw new UserInputError("Errors", { errors: usernameErrors });
        }

        // Check if username is already taken
        const existingUser = await User.findOne({ username: newUsername });
        if (existingUser && existingUser.email !== email) {
          throw new UserInputError("Username is taken.", {
            errors: {
              username: "Username is taken.",
            },
          });
        }

        user.username = newUsername;
      }

      // Update user's email if it's different
      if (email && email !== user.email) {
        // Validate email
        const { valid: emailValid, errors: emailErrors } = validateEmail(email);
        if (!emailValid) {
          throw new UserInputError("Errors", { errors: emailErrors });
        }

        // Check if email is already taken
        const existingEmail = await User.findOne({ email });
        if (existingEmail && existingEmail.username !== user.username) {
          throw new UserInputError("Email is already registered.", {
            errors: {
              email: "This email is already registered to another account.",
            },
          });
        }

        user.email = email;
      }

      // Update user's password if it's different
      if (oldPassword && newPassword) {
        // Validate old password
        const { valid: passwordValid, errors: passwordErrors } =
          validatePassword(oldPassword, user.password);
        if (!passwordValid) {
          throw new UserInputError("Errors", { errors: passwordErrors });
        }

        // Verify if new password matches confirm password
        if (newPassword !== confirmPassword) {
          throw new UserInputError("Passwords do not match.", {
            errors: {
              confirmPassword: "Passwords do not match.",
            },
          });
        }

        // Validate new password
        const { valid: newPasswordValid, errors: newPasswordErrors } =
          validatePassword(newPassword);
        if (!newPasswordValid) {
          throw new UserInputError("Errors", { errors: newPasswordErrors });
        }

        // Hash and update password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
      }

      // Update user's profile picture if it's different
      if (profilePicture && profilePicture !== user.profilePicture) {
        user.profilePicture = profilePicture;
      }

      // Save changes to the database
      const res = await user.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res.id,
        token,
        __v: res.__v++,
      };
    },
  },
  Query: {
    async getUser(_, { username }) {
      try {
        const user = await User.findOne({ username });
        if (user) {
          return user;
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getUsers() {
      try {
        const users = await User.find();

        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
