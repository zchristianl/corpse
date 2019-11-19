const logger = require('../utils/logger');
const mailer = require('../utils/mail');

exports.contact_seller = (req, res) => {
  res.render('contact');
};

// Send email to seller
exports.send_post = (req, res) => {
  const output = `
      <p>You have a message from a client</p>
      <h3>Contact Details</h3>
      <ul>
        <li>Name: ${req.body.name}</li>
        <li>Research Area: ${req.body.researchArea}</li>
        <li>Email: ${req.body.email}</li>
        <li>Subject: ${req.body.subject}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
    `;
  
  mailer.send(req.body.email, req.body.subject, output, (err, info) => {
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