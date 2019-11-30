const models = require('../config/database');
const logger = require('../utils/logger');
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

function create_session(req, res) {
  // array of items for stripe checkout
  let checkout_items = new Array();
  models.Item.findOne({
    where: {
      orderId: req.params.id
    }
  }).then(item => {
    models.Inventory.findOne({
      where: {
        id: item.inventoryId
      }
    }).then(inventory_item => {
      // create an object for stripe checkout
      let checkout_item = {
        name: inventory_item.name,
        description: inventory_item.description,
        amount: inventory_item.price * 100,
        currency: 'usd',
        quantity: 1,
      };
      checkout_items.push(checkout_item);
      return checkout_items;
    }).then(checkout_items => {
      console.log(checkout_items);
      stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: checkout_items,
        success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://example.com/cancel',
      }).then(session => {
        res.render('payment', {
          session: session
        });
      });
    }).catch(err => {
      logger.error(err);
      req.flash('danger', 'There seems to be a problem. Please try again later.');
      res.redirect('client-dashboard');
    });
  });
}

exports.checkout = (req, res) => {
  create_session(req, res);
};
