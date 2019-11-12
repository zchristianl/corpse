const logger = require('../utils/logger');
const mailer = require('../utils/mail');

exports.contact_seller = (req, res) => {
  res.render('contact');
};
  
exports.send_post = (req, res) => {
  const output = `
      <p>You have a message from a client</p>
      <h3>Contact Details</p>
      <ul>
        <li>Name: ${req.body.name}</li>
        <li>Research Area: ${req.body.research_area}</li>
        <li>Email: ${req.body.email}</li>
        <li>Subject: ${req.body.subject}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
    `;
  
  mailer.sendSeller(req.body.email, req.body.subject, output, (err, info) => {
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