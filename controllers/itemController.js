const models = require('../config/database');
const logger = require('../utils/logger');

exports.item_get = (req, res) => {
  models.Item.findAll({

    where: {id: req.params.id},
    include: [{
      model: models.Inventory
    }],
    limit: 1
  })
    .catch(err => logger.error(err));
  return res;
};
exports.item_create = (req, res) => {
  let bodyvars = undefined;

  //AUTHORIZE ACTION
  bodyvars = {
    inventoryid: req.inventoryid,
    orderid: req.orderid
  };

  models.Item.create(bodyvars);
  return res;
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
  return res;};
exports.item_remove = (req, res) => {
  //AUTHORIZE ACTION
  models.Item.destroy({
    where: {
      id: req.body.id
    }
  }).catch(err => logger.err(err));
  return res; //Make 200
};