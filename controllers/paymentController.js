const logger = require('../utils/logger');
require('dotenv').config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = require('stripe')(stripeSecretKey);

exports.checkout_get = (req, res) => {
  res.render('checkout');
};

exports.checkout_post = (req, res) => {
  let amount = 500;
  stripe.customers.create({
    email: req.body.email,
    card: req.body.id
  })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: 'Sample Charge',
        currency: 'usd',
        customer: customer.id
      }))
    .then(charge => logger.debug(charge), res.redirect('/'))
    .catch(err => {
      logger.error(err);
      res.status(500).send({error: 'Purchase Failed'});
    });
};
  
// Access control
exports.ensureAthnticated = (req, res, next) => {
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
};