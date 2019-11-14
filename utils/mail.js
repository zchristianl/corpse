var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
require('dotenv').config();

var transporter = exports.transporter = nodemailer.createTransport(smtpTransport({
  host: 'smtp.gmail.com', //mail.example.com (your server smtp)
  port: 465, // (specific port)
  secureConnection: false, //true or false
  auth: {
    user: process.env.AUTH_USER, //user@mydomain.com
    pass: process.env.AUTH_PASS //password from specific user mail
  }
}));

exports.send = async function(email, subject, htmlcontent, callback) {
  var mailOptions = {
    from: email,
    to: process.env.AUTH_USER,
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

exports.sendInvoice = async function(doc, filename, order, callback) {
  var mailOptions = {
    from: 'orders@ProteinCT.com',
    to: order.clientEmail,
    subject: 'Your Order From ProteinCT - #' + order.id,
    text: 'Thank you for your order!',
    attachments: [
      {
        filename: filename,
        content: doc
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