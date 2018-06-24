const isEmpty = require('./is-empty');
const Validator = require('validator');

module.exports = function validateProfileInput(data) {
  const errors = {};
  const profile = data;

  profile.handle = !isEmpty(profile.handle) ? profile.handle : '';
  profile.status = !isEmpty(profile.status) ? profile.status : '';
  profile.skills = !isEmpty(profile.skills) ? profile.skills : '';

  if (!Validator.isLength(profile.handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle needs to be between 2 and 4 characters';
  }

  if (Validator.isEmpty(profile.handle)) {
    errors.handle = 'Profile handle is required';
  }

  if (Validator.isEmpty(profile.status)) {
    errors.status = 'Profile status is required';
  }

  if (Validator.isEmpty(profile.skills)) {
    errors.skills = 'Profile skills is required';
  }

  if (!isEmpty(profile.website)) {
    if (!Validator.isURL(profile.website)) {
      errors.website = 'Not a valid URL';
    }
  }

  if (!isEmpty(profile.youtube)) {
    if (!Validator.isURL(profile.youtube)) {
      errors.youtube = 'Not a valid URL';
    }
  }

  if (!isEmpty(profile.twitter)) {
    if (!Validator.isURL(profile.twitter)) {
      errors.twitter = 'Not a valid URL';
    }
  }

  if (!isEmpty(profile.facebook)) {
    if (!Validator.isURL(profile.facebook)) {
      errors.facebook = 'Not a valid URL';
    }
  }

  if (!isEmpty(profile.linkedIn)) {
    if (!Validator.isURL(profile.linkedIn)) {
      errors.linkedIn = 'Not a valid URL';
    }
  }

  if (!isEmpty(profile.instagram)) {
    if (!Validator.isURL(profile.instagram)) {
      errors.instagram = 'Not a valid URL';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
