const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');
const { validateRegisterInput } = require('../../utils/validators');

module.exports = {
  Mutation: {
    async register(
      _, //párent argument
      { registerInput: { username, email, password, confirmPassword } } //args argument
    ) {
      //validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      //make sure username doesn't already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Username is taken.', {
          errors: {
            username: 'This username is taken!',
          },
        });
      }

      //make sure email doesn't already exist
      const uniqueEmail = await User.findOne({ email });
      if (uniqueEmail) {
        throw new UserInputError('Email is already registered.', {
          errors: {
            username: 'This email is already registered.',
          },
        });
      }

      //hash password and create an auth token
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();
      const token = jwt.sign(
        {
          id: res.id,
          email: res.email,
          username: res.username,
        },
        SECRET_KEY,
        { expiresIn: '1h' }
      );
      return {
        ...res._doc,
        id: res.id,
        token,
      };
    },
  },
};
