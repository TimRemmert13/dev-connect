const isEmpty = require('./is-empty');
const Validator = require('validator');

module.exports = function validateRegisterInput(data) {
  const errors = {};

  // Js params passed by ref so create var and manipulate and return that
  const user = data;

  user.name = !isEmpty(user.name) ? user.name : '';
  user.email = !isEmpty(user.email) ? user.email : '';
  user.password = !isEmpty(user.password) ? user.password : '';
  user.password2 = !isEmpty(user.password2) ? user.password2 : '';

  if (!Validator.isLength(user.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(user.name)) {
    errors.name = 'Name field is required';
  }

  if (Validator.isEmpty(user.email)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isEmail(user.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(user.password)) {
    errors.password = 'Password field is required';
  }

  if (!Validator.isLength(user.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(user.password2)) {
    errors.password2 = 'Confirm password field is required';
  }

  if (!Validator.equals(user.password, user.password2)) {
    errors.password2 = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
