const SGmail = require('@sendgrid/mail');
const logger = require('../utils/logger');
const fs = require('fs');
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

exports.sendInvoice = async function(pdf, filename, order, req, res) {

  var base64File = new Buffer(pdf).toString('base64');

  const message = {
    to: order.clientEmail,
    from: 'billing@ProteinCT.com',
    subject: '[ Invoice From ProteinCT ]',
    text: 'Attached is an invoice for your order #' + order.id,
    attachments: [
      {
        filename: filename,
        content: base64File,
        type: 'application/pdf',
        disposition: 'attachment',
        contentId: 'invoice'
      },
    ],
  };

  SGmail.send(message).then(sent => {
    if(sent){
      req.flash('success', 'An invoice has been sent to ' + order.clientEmail);
      res.render('portal', {user: req.user});
    } else {
      req.flash('danger', 'There was an error. Please try again.');
      res.redirect('/');
    }
  }).catch(err => { 
    logger.error(err);
  });
};