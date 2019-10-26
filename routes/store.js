const express = require('express');
const router = express.Router();
require('dotenv').config();
const logger = require('../utils/logger');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

logger.debug(stripeSecretKey + " " + stripePublicKey);

// Require the Stripe library with a test secret key.
const stripe = require('stripe')(stripeSecretKey);

// Store
router.get('/checkout', (req, res) => {
  res.render('checkout');
});

// Payment
router.post('/checkout', (req, res) => {
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
    .then(charge => res.send(charge))
    .catch(err => {
      logger.error(err);
      res.status(500).send({error: 'Purchase Failed'});
    });
});

// Access control
function ensureAthnticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;