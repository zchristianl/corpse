const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const models = require('../config/database');
const logger = require('../utils/logger');
require('dotenv').config();
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const async = require('async');
const crypto = require('crypto');

exports.register_get = (req, res) => {
  res.render('register');
};

exports.portal_get = (req, res) => {
  res.render('portal');
};

exports.register_post = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(errors.array());
    res.render('register', {
      errors: errors.array()
    });
  } else {
    // Check for existing user
    models.User.findOne({
      where: {
        'email': req.body.email
      }
    }).then(user => {
      if (user !== null) {
        req.flash('danger', 'A user with that email address already exists.');
        res.render('register');
      }
    }).catch(err => logger.error(err));

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
      zip: req.body.zip,
      phone: req.body.phone,
      payment: req.body.payment
    };

    let { first_name, last_name, email, password } = newUser;

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          logger.error(err);
        }
        models.User.create({
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: hash,
          account_type: 'client',
          phone: regInfo.phone,
          organization: regInfo.organization,
          department: regInfo.department,
          research_area: regInfo.research_area,
          address: (regInfo.address1 + '\n' + regInfo.address2),
          city: regInfo.city,
          state: regInfo.state,
          zip: regInfo.zip,
          payment: regInfo.payment,
          po_num: regInfo.po_num
        })
          .then(user => makeAssociations(user, regInfo))
          .then(() => {
            req.flash('success', 'You are now registered and can log in');
            res.redirect('/');
          })
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
    return [
      check('first_name', 'First name is required').not().isEmpty(),
      check('last_name', 'Last name is required').not().isEmpty(),
      check('email', 'Email is required').not().isEmpty().isEmail().normalizeEmail(),
      check('password', 'Password is required').not().isEmpty(),
      check('password2', 'Confirm Password is required').not().isEmpty(),
      check('password2', 'Please make sure both password match').custom((value, { req }) => (value === req.body.password)),
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

exports.forgot_get = (req, res) => {
  res.render('forgot', {
    user: req.user
  });
};

exports.forgot_post = (req, res, next) => {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      console.log(req.body.email);
      models.User.findOne({
        where: {
          email: req.body.email
        }
      }).then(user => {
        user.update({
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 3600000 // 1 hour
        }).then(user => {
          done(null, token, user);
        })
          .catch(err => {
            logger.error(err);
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/users/forgot');
          });
      });
    },
    function (token, user, done) {
      var transporter = nodemailer.createTransport(smtpTransport({
        host: 'smtp.gmail.com', //mail.example.com (your server smtp)
        port: 465, // (specific port)
        secureConnection: false, //true or false
        auth: {
          user: process.env.AUTH_USER, //user@mydomain.com
          pass: process.env.AUTH_PASS //password from specific user mail
        }
      }));

      var mailOptions = {
        to: user.email,
        from: 'account@proteinct.com',
        subject: 'Reset Your ProteinCT Password',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/users/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function (err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) return next(err);
    res.redirect('/users/forgot');
  });
};

exports.new_password = (req, res) => {
  models.User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
    .then(() => {
      res.render('reset', {
        user: req.user
      });
    })
    .catch(err => {
      logger.error(err);
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/user/forgot');
    });
};

exports.reset_confirm = (req, res) => {
  async.waterfall([
    function (done) {
      models.User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
        .then(user => {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
              if (err) {
                logger.error(err);
              }
              user.update({
                password: hash,
                resetPasswordToken: undefined,
                resetPasswordExpires: undefined
              })
                .then(user => {
                  done(null, user);
                })
                .catch(err => {
                  logger.error(err);
                  req.flash('error', 'Password reset token is invalid or has expired.');
                  return res.redirect('back');
                });
            });
          });
        });
    },
    function (user, done) {
      var transporter = nodemailer.createTransport(smtpTransport({
        host: 'smtp.gmail.com', //mail.example.com (your server smtp)
        port: 465, // (specific port)
        secureConnection: false, //true or false
        auth: {
          user: process.env.AUTH_USER, //user@mydomain.com
          pass: process.env.AUTH_PASS //password from specific user mail
        }
      }));
      var mailOptions = {
        to: user.email,
        from: 'account@proteinct.com',
        subject: 'Your ProteinCT password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your ProteinCT account ' + user.email + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, function (err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function (err) {
    logger.error(err);
    res.redirect('/users/login');
  });
};

exports.client_view_get = (req, res) => {
  models.User.findAll({
    where: {
      account_type: 'client'
    }
  }
  ).then(users => res.render('client', {
    users: users
  }));
};

exports.client_read_get = (req, res) => {
  models.User.findOne({
    where: {
      id: req.params.id
    }
  }).then(user => models.Order.findAll({
    where: {
      userId: user.id
    }
  }).then(orders => res.render('client-r', {
    user: user,
    orders: orders
  })));
};

exports.client_edit_get = (req, res) => {
  models.User.findOne({
    where: {
      id: req.params.id
    }
  }).then((client) => {
    res.render('client-cu', {
      client: client
    });
  }).catch(err => logger.error(err));
};

exports.client_create_get = (req, res) => {
  res.render('client-cu');
  return;
};

exports.client_edit_post = (req, res) => {
  if (req.body.id) {
    models.User.findOne({
      where: {
        id: req.body.id
      }
    }).then((entry) => {
      entry.update({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        organization: req.body.organization,
        reserach_area: req.body.research_area,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        phone: req.body.phone,
        payment: req.body.payment,
        po_num: req.body.po_num
      }).then(() => { res.redirect('/users/view/'); });
    }).catch(err => logger.error(err));
    return;
  }

  if (!req.params.id) {
    res.redirect('/users/view');
    return;
  }
};