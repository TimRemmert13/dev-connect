const isEmpty = require('./is-empty');
const Validator = require('validator');

module.exports = function validateExperienceInput(data) {
  const errors = {};
  const exp = data;

  exp.title = !isEmpty(exp.title) ? exp.title : '';
  exp.company = !isEmpty(exp.company) ? exp.company : '';
  exp.from = !isEmpty(exp.from) ? exp.from : '';

  if (Validator.isEmpty(exp.title)) {
    errors.title = 'Job title field is required';
  }

  if (Validator.isEmpty(exp.company)) {
    errors.company = 'company field is required';
  }

  if (Validator.isEmpty(exp.from)) {
    errors.from = 'From date field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
