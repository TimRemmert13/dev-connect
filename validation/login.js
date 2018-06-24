const isEmpty = require('./is-empty');
const Validator = require('validator');

module.exports = function validateLoginInput(data) {
  const errors = {};
  const form = data;

  form.email = !isEmpty(form.email) ? form.email : '';
  form.password = !isEmpty(form.password) ? form.password : '';

  if (!Validator.isEmail(form.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(form.email)) {
    errors.email = 'Email field is required';
  }

  if (Validator.isEmpty(form.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
