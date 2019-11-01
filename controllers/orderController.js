const models = require('../config/database');
const logger = require('../utils/logger');

exports.order_get = (req,res) => {
  models.Order.findAll()
    .then(orders => res.render('NO_EXIST',{
      What: orders
    }))
    .catch(err => logger.error(err));
};

