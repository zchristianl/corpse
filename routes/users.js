const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');
const {User} = require('../config/database');
const logger = require('../utils/logger');

// Register From
router.get('/register', (req, res) => {
  res.render('register');
});

// Register process
router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Email is required').not().isEmpty().isEmail().normalizeEmail(),
  check('username', 'Username is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty(),
  check('password2', 'Confirm Password is required').not().isEmpty(),
  check('password2', 'Please make sure both password match').custom((value, {req}) => (value === req.body.password))
],
(req, res) => {
  //Get errors
  const result = validationResult(req);
  const hasErrors = !result.isEmpty();
  if(hasErrors) {
    res.render('register', {
      errors: result.array()
    });
  } else {

    const newUser = {
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    };

    let {name, email, username, password} = newUser;

    // Encrypting password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, function(err, hash){
        if(err){
          logger.error(err);
        }
        User.create({
          name: name,
          email: email,
          username: username,
          password: hash
        })
          .then(() => {res.redirect('/'), req.flash('success', 'You are now registered and can log in');})
          .catch(err => logger.error(err));
      });
    });
  }
});

// Login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Login process
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

module.exports = router;