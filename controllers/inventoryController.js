const models = require('../config/database');
const logger = require('../utils/logger');

// Display all
exports.inventory_get = (req, res) => {
  models.Inventory.findAll()
    .then(items => res.render('inventory',{
      items: items
    }))
    .catch(err => logger.error(err));
};

//WARNING UNSUPPORTED VIEW
exports.inventory_select = (req, res) => {
  models.Inventory.find({
    where: {
      id: req.params.id
    }
  })
    .then(item => res.render('NO_EXIST', {item: item}))
    .catch(err => logger.error(err));

};

exports.inventory_modify = (req, res) => {
  global.ensureAuthenticated(req, res);
  let MODIFY_CONSTANT = true; //IMPORTANT NOTE THIS IS FOR REQUEST BODY!!!!!
  let bodyvars = {
    name: req.body.name,
    category: req.body.category,
    type: req.body.type,
    description: req.body.description,
    cost: req.body.cost,
    price: req.body.price
  };
  let dbcall = MODIFY_CONSTANT ?  models.Inventory.update : models.Inventory.create;
  dbcall(bodyvars).then(inventory=>res.render('NO_EXIST', {inventory:inventory})).catch(err=>logger.error(err));

};