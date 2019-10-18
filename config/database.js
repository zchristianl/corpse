const Sequelize = require('sequelize');
const UserModel = require('../models/user');
const logger = require('../utils/logger');
require('dotenv').config();

// DB connection
const db = new Sequelize(process.env.DB_CONNECTIONSTRING);

const User = UserModel(db, Sequelize);

db.sync().then(function() {
  logger.info('Nice! Database looks fine.');
}).catch(function(err) {
  logger.error(err, 'Something went wrong with the Database Update!');
});

module.exports = {
  db,
  User
};
