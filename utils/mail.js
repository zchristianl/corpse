exports.send = function(email, subject, htmlcontent, callback) {
  var nodemailer = require('nodemailer');
  var smtpTransport = require('nodemailer-smtp-transport');
  require('dotenv').config();

  var transporter = nodemailer.createTransport(smtpTransport({
      host: process.env.MAIL_HOST, //mail.example.com (your server smtp)
      port: process.env.MAIL_PORT, // (specific port)
      secureConnection: process.env.CONNECTION, //true or false
      auth: {
          user: process.env.AUTH_USER, //user@mydomain.com
          pass: process.env.AUTH_PASS //password from specific user mail
      }
  }));

  var mailOptions = {
      from: configMail.email,
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
}