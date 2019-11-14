const models = require('../config/database');
const logger = require('../utils/logger');
const mailer = require('../utils/mail');

exports.order_view_get = (req, res) => {
  models.Order.findAll({
    include: [
      { model: models.Item },
      { model: models.User }
    ]
  })
    .then(orders => res.render('order', {
      orders: orders
    }))
    .catch(err => logger.error(err));
};

exports.order_inquire_get = (req, res) => {
  res.render('inquire');
};

exports.create_invoice = (req, res) => {
  const { createInvoiceDownload, createInvoiceEmail } = require('../utils/createInvoice.js');
  // CREATE INVOICE HERE
  // USING ORDER USER ASSOCIATION
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
  // MAKE INVOICE NAME UNIQUE
  createInvoiceDownload(invoice, 'invoice.pdf');

  let order = {
    id: 1234,
    clientEmail: 'corpsedev@gmail.com',
  };
  // MAKE INVOICE NAME UNIQUE
  createInvoiceEmail(invoice, 'invoice.pdf', order, req, res);
};
exports.order_remove = (req, res) => {
  //AUTHORIZE ACTION
  models.Order.destroy({
    where: {
      id: req.body.id
    }
  }).then(res.redirect('NO_EXIST')).catch(err => logger.err(err));
};

exports.order_modify = (req, res) => {
  //AUTHORIZE ACTION
  if (req.body.id) {
    models.Order.findOne({
      where: {
        id: req.body.id
      },
      include: [{ model: models.User }, { model: models.Item }]

    }).then((entry) => {
      entry.update({
        amount: req.body.amount,
        state: req.body.state,
        type: req.body.type,
        user: req.body.user,
      }).then(() => { res.redirect('NO_EXIST'); }); // CALL item modify if needed.
    }).catch(err => logger.error(err));
    return;
  }

  if (!req.params.id) {
    res.redirect('NO_EXIST');
    return;
  }

  models.Order.findOne({
    where: {
      id: req.params.id
    }
  }).then((entry) => {
    res.render('NO_EXIST', {
      entry: entry
    });
  }).catch(err => logger.error(err));
};

exports.order_create = (req, res) => {
  if (!req.body.item_name) {
    res.render('NO_EXIST');
    return;
  }

  let bodyvars = undefined;

  //AUTHORIZE ACTION
  bodyvars = {
    amount: req.body.amount,
    state: req.body.state,
    type: req.body.type,
    user: req.body.user,
    item: req.body.items
  };

  models.Inventory.create(bodyvars).then(() => { res.redirect('NO_EXIST'); }); //CALL relvant Item creates if needed
};

// Send order confirmation email to client
exports.order_confirmation = (req, res, order) => {
  const output = `
      <h1>Thank you for your order!</h1>
      <h3>Order Details</h3>
      <ul>
        <li>Order Number: ${order.id}</li>
        <li>Date: ${order.createdAt}</li>
      </ul>
      <h3>Message</h3>
      <p>We will get back to you very soon, feel free to contact us at 1‑608-886-6718.</p>
    `;
  
  mailer.send('corpsedev@gmail.com', '[ProteinCT Order Confirmation]', output, (err, info) => {
    if(err){
      logger.error(err);
      req.flash('danger', 'There was an error. Please try again.');
      res.redirect('contact');
  
    } else {
      req.flash('success', 'Your message has been sent!');
      res.render('portal');
    }
    logger.info(info.messageId);
  });
};

