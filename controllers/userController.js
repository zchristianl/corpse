const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const models = require('../config/database');
const logger = require('../utils/logger');
require('dotenv').config();
const async = require('async');
const crypto = require('crypto');
const mailer = require('../utils/mail');
const orderMethods = require('./orderController');

exports.register_get = (req, res) => {
  res.render('register');
};

exports.dashboard_get = (req, res) => {
  orderMethods.order_view_get_core_wrapper(req,res,req.user.account_type == 'seller' ? 'seller-dashboard': 'client-dashboard');

  /* if (req.user.account_type == 'seller') {

    models.Order.findAll({
      where: {
        state: 'NEW'
      },
      include: [
        {
          model: models.Item, include: [{
            model: models.Inventory
          }]
        },
        { model: models.User }
      ], order: [
        ['createdAt', 'DESC']
      ]
    })
      .then((orders) => {
        orders.forEach((o) => {
          let sum = 0;
          o.items.forEach((itm) => { sum += parseFloat(itm.inventory.price); });
          o.amount = sum;
        });
        res.render('seller-dashboard', {
          orders: orders
        });
      })
      .catch(err => logger.error(err));

  } else {

    models.Order.findAll({
      where: {
        userId: req.user.id
      },
      include: [
        {
          model: models.Item, include: [{
            model: models.Inventory
          }]
        },
        { model: models.User }
      ], order: [
        ['createdAt', 'DESC']
      ]
    })
      .then((orders) => {
        orders.forEach((o) => {
          let sum = 0;
          o.items.forEach((itm) => { sum += parseFloat(itm.inventory.price); });
          o.amount = sum;
        });
        res.render('client-dashboard', {
          orders: orders
        });
      })
      .catch(err => logger.error(err)); *****************/

  /* models.Order.findAll({
       model: models.Item, include: [{
        model: models.Inventory
      }], order: [
        ['createdAt', 'DESC']
      ]
    }).then((orders) => {
      orders.forEach((o) => {
        let sum = 0;
        o.items.forEach((itm) => { sum += parseFloat(itm.inventory.price); });
        o.amount = sum;
      });
      res.render('order', {
        orders: orders
      });
    }); */

  //}
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
        email: req.body.email
      }
    }).then(user => {
      if (user !== null) {
        req.flash('danger', 'A user with that email address already exists.');
        res.render('register');
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
                res.redirect('/users/login');
              })
              .catch(err => logger.error(err));
          });
        });
      }
    });
  }
};

exports.client_new_post = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(errors.array());
    res.render('client-cu', {
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
    };

    const regInfo = {
      organization: req.body.organization,
      department: req.body.department,
      research_area: req.body.research_area,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      phone: req.body.phone,
      po_num: req.body.po_num
    };

    let { first_name, last_name, email } = newUser;
    models.User.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      account_type: 'client',
      phone: regInfo.phone,
      organization: regInfo.organization,
      department: regInfo.department,
      research_area: regInfo.research_area,
      address: regInfo.address,
      city: regInfo.city,
      state: regInfo.state,
      zip: regInfo.zip,
      po_num: regInfo.po_num
    })
      .then(user => makeAssociations(user, regInfo))
      .then(() => {
        req.flash('success', 'Client registered successfully!');
        res.redirect('/users/view');
      })
      .catch(err => logger.error(err));
  }
};

exports.login_get = (req, res) => {
  res.render('login');
};

exports.login_post = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/dashboard',
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
      check('email', 'Email is required').not().isEmpty().isEmail(),
      check('password', 'Password is required').not().isEmpty(),
      check('password2', 'Confirm Password is required').not().isEmpty(),
      check('password2', 'Please make sure both password match').custom((value, { req }) => (value === req.body.password)),
      check('phone', 'Phone number is required').not().isEmpty(),
      check('phone', 'Please input phone number correctly').isMobilePhone(),
      check('city', 'City is required').not().isEmpty(),
      check('zip', 'Zip code is required').not().isEmpty()
    ];
  }
  case 'clientCreateUser': {
    return [
      check('first_name', 'First name is required').not().isEmpty(),
      check('last_name', 'Last name is required').not().isEmpty(),
      check('email', 'Email is required').not().isEmpty().isEmail().normalizeEmail(),
      check('phone', 'Phone number is required').not().isEmpty(),
      check('phone', 'Please input phone number correctly').isMobilePhone(),
      check('city', 'City is required').not().isEmpty(),
      check('zip', 'Zip code is required').not().isEmpty()
    ];
  }
  case 'forgot': {
    return check('email', 'Email is required').not().isEmpty();
  }
  case 'changePassword': {
    return [
      check('password', 'Password is required').not().isEmpty(),
      check('password2', 'Confirm Password is required').not().isEmpty(),
      check('password2', 'Please make sure both password match').custom((value, { req }) => (value === req.body.password))
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
  models.Department.create({
    userId: user.get('id'),
    name: regInfo.department
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
        });
      }).catch(err => {
        logger.error(err);
        req.flash('danger', 'No account with that email address exists.');
        return res.redirect('/users/forgot');
      });
    },
    function (token, user, done) {
      var err = mailer.sendForgotPassword(req, user, token);
      req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
      done(err, 'done');
    }
  ], function (err) {
    if (err) return next(err);
    res.redirect('/users/forgot');
  });
};

exports.new_password = (req, res) => {
  models.User.findOne({
    where: {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { [models.Op.gt]: Date.now() }
    }
  })
    .then(() => {
      res.render('reset', {
        user: req.user
      });
    })
    .catch(err => {
      logger.error(err);
      req.flash('danger', 'Password reset token is invalid or has expired.');
      return res.redirect('/user/forgot');
    });
};

exports.reset_confirm = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(errors.array());
    res.render('reset', {
      errors: errors.array()
    });
  } else {
    async.waterfall([
      function (done) {
        models.User.findOne({
          where: {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { [models.Op.gt]: Date.now() }
          }
        })
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
                    req.flash('danger', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                  });
              });
            });
          });
      },
      function (user, done) {
        var err = mailer.sendResetConfirm(user);
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      }
    ], function (err) {
      logger.error(err);
      res.redirect('/users/login');
    });
  }
};

exports.client_view_get = (req, res) => {
  if (Object.keys(req.query).length === 0) {
    req.term = undefined;
  } else {
    req.term = req.query;
  }
  client_view_get_internal(req, res);
};

function client_view_get_internal(req, res) {
  let search = req.query;
  models.User.findAll({
    include: [{model: models.Order,
      include: [{model: models.Item, include: [{
        model: models.Inventory
      }]},{model: models.Payment}]
    }],
    where: {
      account_type: 'client',
      [models.Op.or]: [
        {
          first_name: {
            [models.Op.like]: search && search.term ? '%' + search.term + '%' : '%%'
          }
        },
        {
          last_name: {
            [models.Op.like]: search && search.term ? '%' + search.term + '%' : '%%'
          }
        },
        {
          email: {
            [models.Op.like]: search && search.term ? '%' + search.term + '%' : '%%'
          }
        },
        {
          organization: {
            [models.Op.like]: search && search.term ? '%' + search.term + '%' : '%%'
          }
        },
        {
          research_area: {
            [models.Op.like]: search && search.term ? '%' + search.term + '%' : '%%'
          }
        },
        {
          address: {
            [models.Op.like]: search && search.term ? '%' + search.term + '%' : '%%'
          },
        }, {
          zip: {
            [models.Op.like]: search && search.term ? '%' + search.term + '%' : '%%'
          }
        }
      ]
    }, order: [
      ['last_name', 'ASC']
    ]
  }).then((users) => {

    users.forEach((u)=>{
      let sum = 0;
      let sub = 0;
      u.orders.forEach((o)=>{
        o.items.forEach((itm)=>{
          sum += parseFloat(itm.inventory.price);
        });

        o.payments.forEach((p)=>{
          sub += parseFloat(p.amount);
        });
      });
      u.due = sum;
      u.paid = sub;
    });
    res.render('client', {
      users: users
    });
  });
}

exports.client_read_get = (req, res) => {
  models.User.findOne({
    where: {
      id: req.params.id
    }
  }).then((client) => {
    orderMethods.order_view_get_core_wrapper(req,res,'client-r',req.params.id,['client',{client:client}]);
  });
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

exports.client_delete_post = (req, res) => {
  //AUTHORIZE ACTION
  models.User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(() => res.send(JSON.stringify({ redirect: '/users/view', status: 200 })))
    .catch(err => logger.error(err));
};

exports.contact_seller = (req, res) => {
  models.User.findOne({
    where: {
      id: req.user.id
    }
  }).then(user => {
    res.render('contact', {
      user: user,
    });
  });
};

// Send email to seller
exports.send_post = (req, res) => {
  const output = `
      <p>You have a message from a client</p>
      <h3>Contact Details</h3>
      <ul>
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
        <li>Research Area: ${req.body.researchArea}</li>
        <li>Subject: ${req.body.subject}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
    `;

  var message = {
    to: process.env.SELLER_EMAIL,
    from: 'contact@proteinct.com',
    subject: req.body.subject,
    html: output
  };

  mailer.sendContact(message, req, res);
};

exports.edit_account_get = (req, res) => {
  models.User.findOne({
    where: {
      id: req.user.id
    }
  }).then((user) => {
    res.render('edit-account', {
      user: user
    });
  }).catch(err => logger.error(err));
};

exports.edit_account_post = (req, res) => {
  models.User.findOne({
    where: {
      id: req.user.id
    }
  }).then(user => {
    user.update({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      organization: req.body.organization,
      department: req.body.department,
      research_area: req.body.research_area,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      phone: req.body.phone,
      po_num: req.body.po_num
    }).then(() => {
      req.flash('success', 'Your account has been successfully updated!');
      res.render('account', {
        user: user
      });
    })
      .catch(err => logger.error(err));
  })
    .catch(err => logger.error(err));
};

exports.account_get = (req, res) => {
  models.User.findOne({
    where: {
      id: req.user.id
    }
  }).then((user) => {
    res.render('account', {
      user: user
    });
  }).catch(err => logger.error(err));
};

exports.edit_account_password = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('edit-account', {
      errors: errors.array(),
      client: req.user,
      user: req.user
    });
  } else {
    models.User.findOne({
      where: {
        id: req.user.id
      }
    })
      .then(user => {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) {
              logger.error(err);
            }
            user.update({
              password: hash,
            })
              .then(() => {
                req.flash('success', 'You password has been changed!');
                res.render('account', {
                  user: user
                });
              })
              .catch(err => { logger.error(err); });
          });
        });
      });
  }
};