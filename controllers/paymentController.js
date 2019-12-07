const models = require('../config/database');
const logger = require('../utils/logger');
const {createInvoiceEmail } = require('../utils/createInvoice.js');
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
  return res.sendStatus(200).end();
};

/* 
  Create a stripe checkout session with items from an orderId
  Return a session the the payment view to redirect to stripe checkout
*/
exports.create_session = (req, res) => {
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
      // Need to add urls
      stripe.checkout.sessions.create({
        customer_email: req.user.email,
        payment_method_types: ['card'],
        line_items: checkout_items,
        success_url: 'http://localhost:3000/payment/success',
        cancel_url: 'http://localhost:3000/payment/cancel',
      }).then(session => {
        // store checkout id
        models.Order.findOne({
          where: {
            id: req.params.id
          }
        }).then(order => {
          order.update({
            checkout_id: session.id
          }).catch(err => {
            logger.error(err);
          });
        }).catch(err => {
          logger.error(err);
        });
        return session;
      }).then(session => {
        res.render('payment', {
          session: session
        });
      }).catch(err => {
        logger.error(err);
      });
    }).catch(err => {
      logger.error(err);
      req.flash('danger', 'There seems to be a problem. Please try again later.');
      res.redirect('client-dashboard');
    });
  });
};

/* 
  Stripe Webhook for payment 
*/
exports.stripe_webhook = (req, res) => {
  // endpoint for Stripe CLI
  // endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const endpointSecret = 'whsec_lbXafEi0NDelOinNP1XnaaXSFkmu0Hze';
  const sig = req.headers['stripe-signature'];

  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    handleCheckoutSession(session);
  }

  // Return a response to acknowledge receipt of the event
  res.json({received: true});
};

// redirect stripe success
exports.success_get = (req, res) => {
  res.render('success');
};

// redirect stripe cancel
exports.cancel_get = (req, res) => {
  res.render('cancel');
};

// Ipdate order status to COMPLETE
// On successful payment add payment info to order payment info.
// Call function to create Invoice
const handleCheckoutSession = (session) => {
  models.Order.findOne({
    where: {
      checkout_id: session.id
    }
  }).then(order => {
    order.update({
      state: 'COMPLETE'
    }).catch(err => {
      logger.error(err);
    });

    models.Payment.create({
      // Needs to change
      reference_number: 123456789,
      method: 'cc',
      // Session is in cents / 100 to save dollars
      amount: session.display_items[0].amount / 100,
      orderId: order.id
    });
  });
};

// Create and send an invoice for an order
exports.create_invoice = (req, res) => {
  let invoice_items = new Array();
  let shipping;
  let subtotal = 0;
  let clientEmail;

  models.Item.findAll({

    where: { orderId: req.params.id },
    include: [
      {
        model: models.Inventory
      }
    ]
  }).then(inventory_item => { 
    inventory_item.forEach((item) => {
      let items = {
        item: item.inventory.name,
        description: item.inventory.description,
        quantity: 1,
        amount: item.inventory.price * 100
      };
      subtotal += parseFloat(item.inventory.price) * 100;
      invoice_items.push(items);
    });
  
  }).then(() => {
    models.Order.findOne({
      where: {
        id: req.params.id
      }
    }).then(order => {
      models.User.findOne({
        where: {
          id: order.userId
        }
      }).then(user => {
        shipping = {
          name: user.first_name + ' ' + user.last_name,
          address: user.address.replace('\r', '').split('\n')[0],
          city: user.city,
          state: user.state,
          zip_code: user.zip
        };

        clientEmail = user.email;

        let invoice = {
          shipping: shipping,
          items: invoice_items,
          subtotal: subtotal,
          paid: 0,
          invoice_nr: req.params.id
        };

        let order = {
          id: req.params.id,
          clientEmail: clientEmail,
        };

        createInvoiceEmail(invoice, 'ProteinCTinvoice.pdf', order, req, res);
      }).catch(err => {logger.error(err);});
    }).catch(err => {logger.error(err);});
  }).catch(err => {logger.error(err);});
};