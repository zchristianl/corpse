const models = require('../config/database');
const logger = require('../utils/logger');

exports.item_get = (req, res) => {
  models.Item.findAll({

    where: { id: req.params.id },
    include: [{
      model: models.Inventory
    }],
    limit: 1
  })
    .catch(err => logger.error(err));
  return res;
};
exports.item_create = (req, res) => {
  models.Item.create(
    {
      inventoryId: req.body.services,
      orderId: req.body.order_id,
    }
  );
  return res.sendStatus(200).end();
};

exports.item_modify = (req, res) => {
  //AUTHORIZE ACTION
  if (req.body.id) {
    models.Item.findOne({
      where: {
        id: req.body.id
      },

    }).then((entry) => {
      entry.update({
        inventoryid: req.inventoryid
      }).catch(err => logger.error(err));

    });

    if (!req.params.id) {
      return {};

    }

  }
  return res;
};

exports.item_remove = (req, res) => {
  //AUTHORIZE ACTION
  models.Item.destroy({
    where: {
      id: req.body.id
    }
  }).catch(err => logger.err(err));
  res.sendStatus(200);
  return;
};