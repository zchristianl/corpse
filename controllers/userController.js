const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const models = require('../config/database');
const logger = require('../utils/logger');

exports.register_get = (req, res) => {
  res.render('register');
};

exports.register_post = (req, res) => {
  //Get errors
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    logger.error(errors.array());
    res.render('register', {
      errors: errors.array() 
    });
  } else {

    const newUser = {
      fist_name: req.body.first_name,
      email: req.body.email,
      password: req.body.password
    };

    let {first_name, email, password} = newUser;
    logger.debug('in here');
    // Encrypting password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, function(err, hash){
        if(err){
          logger.error(err);
        }
        models.User.create({
          first_name: first_name,
          email: email,
          password: hash
        })
          .then(() => {res.redirect('/'), req.flash('success', 'You are now registered and can log in');})
          .catch(err => logger.error(err));
      });
    });
  }
};

exports.login_get = (req, res) => {
  res.render('login');
};

exports.login_post = (req, res, next) => {
  console.log(req);
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
};

exports.validate = (method) => {
  switch (method) {
  case 'createUser': {
    return  [
      check('first_name', 'First name is required').not().isEmpty(),
      check('email', 'Email is required').not().isEmpty().isEmail().normalizeEmail(),
      check('password', 'Password is required').not().isEmpty(),
      check('password2', 'Confirm Password is required').not().isEmpty(),
      check('password2', 'Please make sure both password match').custom((value, {req}) => (value === req.body.password))
    ]; 
  }
  }
};

exports.logout_post = (req, res) => {
  req.logout();
  req.flash('success', 'You have been logged out');
  res.redirect('/users/login');
};