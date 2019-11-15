const models = require('../config/database');
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
        amount: amount,
        description: 'Sample Charge',
        currency: 'usd',
        customer: customer.id,
        receipt_email: 'corpsedev@gmail.com'
      }))

    .then(charge => {
      logger.debug(charge);
      res.redirect('/');
    })
    .catch(err => {
      logger.error(err);
      res.status(500).send({error: 'Purchase Failed'});
    });
};
exports.payment_get = (req, res) => {
  models.Payment.findAll({

    where: {id: req.params.id},
    limit: 1
  })
    .catch(err => logger.error(err));
  return res;
};
exports.payment_create = (req, res) => {
  let bodyvars = undefined;

  //AUTHORIZE ACTION
  bodyvars = {
    orderid: req.orderid,
    payment_number: req.payment_number,
    payment_type: req.payment_type,
    payment_amount: req.payment_amount
  };

  models.Payment.create(bodyvars);
  return res;
};

exports.payment_remove = (req, res) => {
  //AUTHORIZE ACTION
  models.Payment.destroy({
    where: {
      id: req.body.id
    }
  }).catch(err => logger.err(err));
  return res;
};
