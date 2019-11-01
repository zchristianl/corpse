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