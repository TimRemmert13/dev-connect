const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const keys = require('../../config/keys');

const router = express.Router();

// load validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// load user model
const User = require('../../models/User');

/**
 * @route GET api/users/test
 * @desc Tests users route
 * @access Public
 */
router.get('/test', (req, res) => res.json({ msg: 'Users works' }));

/**
 * @route GET api/users/register
 * @desc Register User
 * @access Public
 */
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json({ email: 'Email already exists' });
      }
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm', // Default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (error, salt) => {
        bcrypt.hash(newUser.password, salt, (e, hash) => {
          if (e) throw e;
          newUser.password = hash;
          newUser.save()
            .then(nuser => res.json(nuser))
            .catch(err => console.log(err));
        });
      });
    });
});

/**
 * @route GET api/users/login
 * @desc Login User returning JWT token
 * @access Public
 */
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email })
    .then((user) => {
      // Check for user
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }

      // Check Password
      bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            // User matched create JWT payload
            const payload = { id: user.id, name: user.name, avatar: user.avatar };
            // Sign Token
            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  sucess: true,
                  token: `Bearer ${token}`,
                });
              },
            );
          } else {
            errors.password = 'Password incorrect';
            return res.status(400).json(errors);
          }
        });
    });
});

/**
 * @route GET api/users/current
 * @desc Register current user
 * @access Private
 */
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ 
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  });
});

module.exports = router;

