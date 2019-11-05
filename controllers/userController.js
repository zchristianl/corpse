const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const models = require('../config/database');
const logger = require('../utils/logger');

exports.register_get = (req, res) => {
  res.render('register');
};

exports.portal_get = (req, res) => {
  res.render('portal');
};

exports.register_post = (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    logger.error(errors.array());
    res.render('register', {
      errors: errors.array() 
    });
  } else {

    const newUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    };
    
    const regInfo = {
      organization: req.body.organization,
      department: req.body.department,
      research_area: req.body.research_area,
      address1: req.body.address1,
      address2: req.body.address2,
      city: req.body.city,
      state: req.body.state,
      zip_code: req.body.zip,
      phone: req.body.phone,
      payment: req.body.payment
    };

    let {first_name, last_name, email, password} = newUser;

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if(err){
          logger.error(err);
        }
        models.User.create({
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: hash,
          account_type: 'client',
          phone: regInfo.phone
        })
          .then(user => makeAssociations(user, regInfo))
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
  passport.authenticate('local', {
    successRedirect: '/users/portal',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
};

exports.validate = (method) => {
  switch (method) {
  case 'createUser': {
    return  [
      check('first_name', 'First name is required').not().isEmpty(),
      check('last_name', 'Last name is required').not().isEmpty(),
      check('email', 'Email is required').not().isEmpty().isEmail().normalizeEmail(),
      check('password', 'Password is required').not().isEmpty(),
      check('password2', 'Confirm Password is required').not().isEmpty(),
      check('password2', 'Please make sure both password match').custom((value, {req}) => (value === req.body.password)),
      check('phone', 'Phone number is required').not().isEmpty(),
      check('phone', 'Please input phone number correctly').isMobilePhone(),
      check('city', 'City is required').not().isEmpty(),
      check('zip', 'Zip code is required').not().isEmpty()
    ]; 
  }
  }
};

exports.logout_post = (req, res) => {
  req.logout();
  req.flash('success', 'You have been logged out');
  res.redirect('/users/login');
};

const makeAssociations = (user, regInfo) => {
  models.Lab.create({
    userId: user.get('id'),
    pi_first: 'pi first',
    pi_last: 'pi last',
    pi_email: 'pi_email@gmail.com',
    phone: '18471234567'
  })
    .then(lab => {
      models.Location.create({
        userId: user.get('id'),
        labId: lab.get('id'),
        room: 12,
      })
        .then(location => {
          models.Building.create({
            locationId: location.get('id'),
            name: regInfo.department,
            address: regInfo.address1,
            zip_code: regInfo.zip_code
          })
            .then(() => {
              models.Institution.create({
                locationId: location.get('id'),
                name: regInfo.organization,
                address: regInfo.address1,
                city: regInfo.city,
                post_code: regInfo.zip_code,
                state: regInfo.state
              });
            });
        });
    })
    .then(() => {
      models.Department.create({
        userId: user.get('id'),
        name: regInfo.department
      });
    })
    .catch(err => logger.error(err));
};

exports.contact_post = () => {

}