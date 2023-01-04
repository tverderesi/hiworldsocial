module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  if (username.trim() === '') {
    errors.username = 'Username must not be empty!';
  }
  if (email.trim() === '') {
    errors.email = 'E-mail must not be empty!';
  } else {
    const regEx =
      /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address.';
    }
  }
  if (password.trim() === '') {
    errors.password = 'Password must not be empty or contain spaces!';
  } else {
    const pwRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d])[\w\d]{8,}$/;
    if (!password.match(pwRegEx)) {
      errors.password =
        'Password must contain at least one uppercase case, one lowercase letter, one number and one symbol.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords must match!';
    }
  }
  return { errors, valid: Object.keys(errors).length < 1 };
};
