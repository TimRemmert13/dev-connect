const isEmpty = require('./is-empty');
const Validator = require('validator');

module.exports = function validateExperienceInput(data) {
  const errors = {};
  const edu = data;

  edu.school = !isEmpty(edu.school) ? edu.school : '';
  edu.degree = !isEmpty(edu.degree) ? edu.degree : '';
  edu.fieldOfStudy = !isEmpty(edu.fieldOfStudy) ? edu.fieldOfStudy : '';
  edu.from = !isEmpty(edu.from) ? edu.from : '';

  if (Validator.isEmpty(edu.school)) {
    errors.school = 'School field is required';
  }

  if (Validator.isEmpty(edu.degree)) {
    errors.degree = 'Degree field is required';
  }

  if (Validator.isEmpty(edu.from)) {
    errors.from = 'From date field is required';
  }

  if (Validator.isEmpty(edu.fieldOfStudy)) {
    errors.fieldOfStudy = 'Field of study field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
