const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../config');
const { UserInputError } = require('apollo-server');
const User = require('../../models/User');

module.exports = {
  Mutation: {
    async register(
      _, //párent argument
      { registerInput: { username, email, password, confirmPassword } } //args argument
    ) {
      //todo validate user data

      //make sure user doesnt already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Username is taken.', {
          errors: {
            username: 'This username is taken!',
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
