const models = require('../config/database');
const logger = require('../utils/logger');

exports.order_get = (req, res) => {
  models.Order.findAll()
    .then(orders => res.render('NO_EXIST', {
      orders: orders
    }))
    .catch(err => logger.error(err));
};

exports.create_invoice = (req, res) => {
  const createInvoice  = require('../utils/createInvoice.js');
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
  createInvoice.createInvoiceDownload(invoice, 'invoice.pdf');

  let order = {
    orderNumber: 123,
    clientEmail: 'client@gmail.com',
  };
  // MAKE INVOICE NAME UNIQUE
  createInvoice.createInvoiceEmail(invoice, 'invoice.pdf', order);
};