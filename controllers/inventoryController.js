const models = require('../config/database');
const logger = require('../utils/logger');

// Display all
exports.inventory_get = (req, res) => {
  models.Inventory.findAll()
    .then(items => res.render('inventory', {
      items: items
    }))
    .catch(err => logger.error(err));
};

//WARNING UNSUPPORTED VIEW
exports.inventory_select = (req, res) => {
  models.Inventory.findOne({
    where: {
      id: req.params.id
    }
  })
    .then(item => res.render('NO_EXIST', { item: item }))
    .catch(err => logger.error(err));

};

exports.inventory_modify = (req, res) => {
  if (req.body.id) {
    models.Inventory.findOne({
      where: {
        id: req.body.id
      }
    }).then((entry) => {
      entry.update({
        name: req.body.item_name,
        category: req.body.category,
        type: req.body.type,
        description: req.body.description,
        cost: req.body.cost,
        price: req.body.price
      }).then(() => { res.redirect('/inventory/'); });
    }).catch(err => logger.error(err));
    return;
  }

  if (!req.params.id) {
    res.redirect('/inventory');
    return;
  }

  models.Inventory.findOne({
    where: {
      id: req.params.id
    }
  }).then((entry) => {
    res.render('inventory-cu', {
      entry: entry
    });
  }).catch(err => logger.error(err));
};

exports.inventory_create = (req, res) => {
  if (!req.body.item_name) {
    res.render('inventory-cu');
    return;
  }
  
  let bodyvars = undefined;

  //AUTHORIZE ACTION
  bodyvars = {
    name: req.body.item_name,
    category: req.body.category,
    type: req.body.type,
    description: req.body.description,
    cost: req.body.cost,
    price: req.body.price
  };

  models.Inventory.create(bodyvars).then(() => { res.redirect('/inventory'); });
};

exports.inventory_remove = (req, res) => {
  //AUTHORIZE ACTION
  models.Inventory.destroy({
    where: {
      id: req.params.id
    }
  }).then(res.redirect('/inventory')).catch(err => logger.err(err));
};