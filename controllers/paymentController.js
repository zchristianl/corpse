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

exports.create_invoice = (req, res) => {
  const {createInvoiceEmail } = require('../utils/createInvoice.js');
  // CREATE INVOICE HERE
  // USING ORDER USER ASSOCIATION
  models.Order.findOne({
    where: {
      id: req.params.id
    }
  }).then(order => {
    console.log(order.id);
    models.Item.findAll({
      where: {

      }
    }).then(items => {
      
    });

  });
  let invoice = {
    shipping: {
      name: 'CLIENT NAME',
      address: 'CLIENT ADDRESS',
      city: 'CLIENT CITY',
      state: 'CLIENT STATE',
      zip_code: 'CLIENT ZIP CODE'
    },
    items: [
      {
        item: 'DNA 100',
        description: 'DNA Synthesis',
        quantity: 1,
        amount: 100
      },
      {
        item: 'GENO SC',
        description: 'Genome Sequencing',
        quantity: 1,
        amount: 200
      }
    ],
    subtotal: 300,
    paid: 0,
    invoice_nr: 1234
  };

  //createInvoiceDownload(invoice, 'invoice.pdf');

  let order = {
    id: 1234,
    clientEmail: req.user.email,
  };
  // MAKE INVOICE NAME UNIQUE
  createInvoiceEmail(invoice, 'invoice.pdf', order, req, res);
};