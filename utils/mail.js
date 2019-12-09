const SGmail = require('@sendgrid/mail');
const logger = require('../utils/logger');
require('dotenv').config();

SGmail.setApiKey(process.env.SENDGRIND_API_KEY);

exports.sendContact = function(message, req, res) {
  SGmail.send(message).then(sent => {
    if(sent) {
      req.flash('success', 'Your message has been sent!');
      res.redirect('/users/dashboard');
      //res.render('back', {user: req.user});
    } else {
      req.flash('danger', 'There was an error. Please try again.');
      res.render('contact');
    }
  }).catch(err => { logger.error(err); });
};

exports.sendOrderConfrim = function(email, order, itemVars) {
  const html = `
  <h1>Thank you for your order!</h1>
  <h3>Order Details</h3>
  <ul>
    <li>Order Number: ${itemVars.orderId}</li>
    <li>Date: ${order.createdAt}</li>
  </ul>
  <h3>Message</h3>
  <p>We will get back to you very soon, feel free to contact us at 1‑608-886-6718 if you have any questions.</p>
  `;

  const message = {
    to: email,
    from: 'orders@ProteinCT.com',
    subject: '[ ProteinCT Order Confirmation ]',
    html: html
  };

  SGmail.send(message).then(() => {
    return null;
  }).catch(err => { 
    logger.error(err); 
    return err;
  });
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
      res.redirect('/users/dashboard');
    } else {
      req.flash('danger', 'There was an error. Please try again.');
      res.render('back', {
        user: req.user
      });
    }
  }).catch(err => { 
    logger.error(err);
  });
};

exports.sendForgotPassword = function(req, user, token) {
  var message = {
    to: user.email,
    from: 'account@proteinct.com',
    subject: 'Reset Your ProteinCT Password',
    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
    'http://' + req.headers.host + '/users/reset/' + token + '\n\n' +
    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
  };

  SGmail.send(message).then(() => { 
    return null;
  }).catch(err => {
    logger.error(err);
    return err;
  });
};

exports.sendResetConfirm = function(user) {
  var message = {
    to: user.email,
    from: 'account@proteinct.com',
    subject: 'Your ProteinCT password has been changed',
    text: 'Hello,\n\n' +
    'This is a confirmation that the password for your ProteinCT account ' + user.email + ' has just been changed.\n'
  };

  SGmail.send(message).then(() => { 
    return null;
  }).catch(err => {
    logger.error(err); 
    return err;
  });
};
