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
      res.status(500).send({ error: 'Purchase Failed' });
    });
};
exports.payment_get = (req, res) => {
  models.Payment.findAll({

    where: { id: req.params.id },
    limit: 1
  })
    .catch(err => logger.error(err));
  return res;
};
exports.payment_create = (req, res) => {
  let bodyvars = undefined;

  //AUTHORIZE ACTION
  bodyvars = {
    orderId: req.body.order_id,
    reference_number: req.body.reference,
    method: req.body.method,
    amount: req.body.amount
  };

  models.Payment.create(bodyvars).catch(err => logger.error(err));
  return res.sendStatus(200).end();
};

exports.payment_remove = (req, res) => {
  //AUTHORIZE ACTION
  models.Payment.destroy({
    where: {
      id: req.body.id
    }
  }).catch(err => logger.error(err));
  return res;
};

// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys

async function create_session() {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      name: 'T-shirt',
      description: 'Comfortable cotton t-shirt',
      images: ['https://example.com/t-shirt.png'],
      amount: 500,
      currency: 'usd',
      quantity: 1,
    }],
    success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://example.com/cancel',
  });
  return session;
}

exports.checkout = (req, res) => {
  create_session().then(session => {
    console.log(session);
    res.render('payment', {
      session: session
    });
  });
};
