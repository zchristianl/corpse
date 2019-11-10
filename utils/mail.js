require('dotenv').config();

exports.send = async function(email, subject, htmlcontent, callback) {
  var nodemailer = require('nodemailer');
  var smtpTransport = require('nodemailer-smtp-transport');
  require('dotenv').config();

  var transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp.gmail.com', //mail.example.com (your server smtp)
    port: 465, // (specific port)
    secureConnection: false, //true or false
    auth: {
      user: process.env.AUTH_USER, //user@mydomain.com
      pass: process.env.AUTH_PASS //password from specific user mail
    }
  }));

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