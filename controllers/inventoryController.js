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
  //global.ensureAuthenticated(req, res);
  if (!req.params.id) {
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

  models.Inventory.findOne({
    where: {
      id: req.params.id
    }
  }).then(entry => {
    if (entry) {
      entry.update(bodyvars).then(() => { res.redirect('/inventory/'); });
    }
  });

};

exports.inventory_create = (req, res) => {
  //global.ensureAuthenticated(req, res);
  let bodyvars = undefined;

  //AUTHORIZE ACTION
  bodyvars = {
    name: req.body.item_name,
    category: req.body.category,
    type: req.body.type,
    //description: req.body.description,
    cost: req.body.cost,
    price: req.body.price
  };

  models.Inventory.create(bodyvars).then(() => { res.redirect('/inventory/'); });
};

exports.inventory_remove = (req, res) => {
  //global.ensureAuthenticated(req, res);
  //AUTHORIZE ACTION
  models.Inventory.destroy({
    where: {
      id: req.params.id
    }
  }).then(item => res.render('/inventory/', { item: item })).catch(err => logger.err(err));
};