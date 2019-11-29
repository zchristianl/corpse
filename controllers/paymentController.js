const models = require('../config/database');
const logger = require('../utils/logger');
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.checkout_get = (req, res) => {
  console.log(req.params.id);
  // create_session(req, res);
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

async function create_session(req, res) {
  console.log(req.params.id);
  let checkout_items = [];
  // Build an item list of all items in an order
  models.Item.findOne({
    where: {
      orderId: req.params.id
    }
  }).then(items => {
    for(const item in items) {
      models.Inventory.findOne({
        where: {
          id: item.inventoryId
        }
      }).then(inventory_item => {
        let checkout_item = {
          name: inventory_item.name,
          description: inventory_item.description,
          amount: inventory_item.price * 100,
          currency: 'usd',
          quantity: 1,
        };
        checkout_items.push(checkout_item);
      });
    }
    console.log(checkout_items);
    // Create session with list
    const session = stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: checkout_items,
      success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://example.com/cancel',
    });
    return session;  
  }).catch(err => {
    logger.error(err);
    req.flash('danger', 'Error when try to pay!');
    res.redirect('client-dashboard');
  });
}

exports.checkout = (req, res) => {
  create_session().then(session => {
    res.render('payment', {
      session: session
    });
  });
};
