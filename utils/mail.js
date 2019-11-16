const SGmail = require('@sendgrid/mail');
const logger = require('../utils/logger');
require('dotenv').config();

SGmail.setApiKey(process.env.SENDGRIND_API_KEY);

exports.send = function(message, req, res) {
  SGmail.send(message).then(sent => {
    if(sent) {
      req.flash('success', 'Your message has been sent!');
      res.render('portal', {user: req.user});
    } else {
      req.flash('danger', 'There was an error. Please try again.');
      res.render('contact');
    }
  }).catch(err => { logger.error(err); });
};

exports.sendInvoice = async function(invoice, filename, order, req, res) {
  var message = {
    from: 'billing@ProteinCT.com',
    to: order.clientEmail,
    subject: '[ Invoice From ProteinCT ]',
    text: 'Attached is an invoice for your order #' + order.id,
    attachments: [
      {
        filename: filename,
        content: invoice
      }
    ]
  };

  SGmail.send(message).then(sent => {
    if(sent){
      req.flash('info', 'An invoice has been sent to ' + order.clientEmail);
      res.render('portal', {user: req.user});
    } else {
      req.flash('danger', 'There was an error. Please try again.');
      res.redirect('/');
    }
  }).catch(err => { logger.error(err); });
};