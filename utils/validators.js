/**
 * Validates the provided username, email, password, and confirm password.
 * @param {String} username - The username to validate.
 * @param {String} email - The email address to validate.
 * @param {String} password - The password to validate.
 * @param {String} confirmPassword - The confirm password to validate.
 * @returns {Object} An object containing the validation errors and a boolean indicating whether the input is valid.
 * @property {Object} errors - An object containing any validation errors.
 * @property {String} errors.username - An error message for the username, if it is invalid.
 * @property {String} errors.email - An error message for the email address, if it is invalid.
 * @property {String} errors.password - An error message for the password, if it is invalid.
 * @property {String} errors.confirmPassword - An error message for the confirm password, if it is invalid.
 * @property {Boolean} valid - A boolean indicating whether the input is valid (`true`) or invalid (`false`).
 */
module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword,
  profilePicture
) => {
  const errors = {};
  switch (true) {
    case username.trim() === '':
      errors.username = 'Username must not be empty!';
      break;
    case email.trim() === '':
      errors.email = 'E-mail must not be empty!';
      break;
    /**
     * A regular expression that checks that a string is a valid email address.
     * @type {RegExp}
     */
    case !email.match(
      /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i
    ):
      errors.email = 'Email must be a valid email address.';
      break;
    case password === '':
      errors.password = 'Password must not be empty or contain spaces!';
      break;
    /**
     * A regular expression that checks that a password meets the following requirements:
     * - At least 8 characters long
     * - Contains at least one uppercase letter
     * - Contains at least one lowercase letter
     * - Contains at least one number
     * - Contains at least one symbol
     * @type {RegExp}
     */
    case !password.match(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    ):
      errors.password =
        'Password must contain at least one uppercase case, one lowercase letter, one number and one symbol.';
      break;
    case password !== confirmPassword:
      errors.confirmPassword = 'Passwords must match!';
      break;
  }
  return { errors, valid: Object.keys(errors).length < 1 };
};

/**
 * Validates the provided username and password.
 * @param {String} username - The username to validate.
 * @param {String} password - The password to validate.
 * @returns {Object} An object containing the validation errors and a boolean indicating whether the input is valid.
 * @property {Object} errors - An object containing any validation errors.
 * @property {String} errors.username - An error message for the username, if it is invalid.
 * @property {String} errors.password - An error message for the password, if it is invalid.
 * @property {Boolean} valid - A boolean indicating whether the input is valid (`true`) or invalid (`false`).
 */
module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() === '') {
    errors.username = 'Username must not be empty!';
  }
  if (password.trim() === '') {
    errors.password = 'Password must not be empty!';
  }
  return { errors, valid: Object.keys(errors).length < 1 };
};
