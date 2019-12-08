const models = require('../config/database');
const logger = require('../utils/logger');

exports.note_remove = (req, res) => {
  //AUTHORIZE ACTION
  models.Note.destroy({
    where: {
      id: req.body.id
    }
  }).catch(err => logger.err(err));
  res.sendStatus(200);
  return;
};

exports.note_create = (req, res) => {
  models.Note.create(
    {
      userId: req.body.user_id,
      orderId: req.body.order_id,
      message: req.body.message
    }
  );
  return res.sendStatus(200).end();
};