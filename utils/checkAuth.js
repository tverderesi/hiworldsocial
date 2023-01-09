const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');

require('dotenv').config();

/**
 * Extracts and verifies the user from the authorization header in the request context.
 * @param {Object} context - The request context object.
 * @property {Object} context.req - The request object.
 * @property {Object} context.req.headers - The headers of the request.
 * @property {String} context.req.headers.authorization - The authorization header of the request.
 * @throws {Error} If the authorization header is not provided.
 * @throws {AuthenticationError} If the authentication token is invalid or has expired.
 * @returns {Object} The user.
 */
module.exports = context => {
  //context = {...headers}
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    //Bearer ...
    const token = authHeader.split('Bearer ')[1]; //get the second string

    //Verify if token is valid
    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRET_KEY);
        return user;
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token');
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]' ");
  }
  throw new Error('Authorization header must be provided.');
};
