var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
require('dotenv').config();

var transporter = exports.transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: process.env.SMTP_HOST, //mail.example.com (your server smtp)
  port: process.env.SMTP_PORT, // (specific port)
  secureConnection: process.env.SMTP_SECURE, //true or false
  auth: {
    user: process.env.AUTH_USER, //user@mydomain.com
    pass: process.env.AUTH_PASS //password from specific user mail
  }
}));

exports.send = async function(email, subject, htmlcontent, callback) {
  var mailOptions = {
    from: process.env.AUTH_USER,
    to: email,
    subject: subject,
    html: htmlcontent
  };

  transporter.sendMail(mailOptions, function(err, info){
    transporter.close();
    if(err) {
      callback(err, info);
    }
    else {
      callback(null, info);
    }
  });
};

exports.sendInvoice = async function(invoice, filename, order, callback) {
  var mailOptions = {
    from: 'orders@ProteinCT.com',
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

  transporter.sendMail(mailOptions, function(err, info){
    transporter.close();
    if(err) {
      callback(err, info);
    }
    else {
      callback(null, info);
    }
  });
};