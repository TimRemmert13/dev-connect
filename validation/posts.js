const isEmpty = require('./is-empty');
const Validator = require('validator');

module.exports = function validatePostInput(data) {
  const errors = {};
  const post = data;

  post.text = !isEmpty(post.text) ? post.text : '';

  if (!Validator.isLength(post.text, { min: 10, max: 300 })) {
    errors.text = 'Post must be between 10 and 30 characters';
  }

  if (Validator.isEmpty(post.text)) {
    errors.text = 'Text field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
