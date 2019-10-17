const Sequelize = require('sequelize');
const UserModel = require('../models/user');
const logger = require('../utils/logger');
require('dotenv').config();

// DB connection
const db = new Sequelize(process.env.DB_CONNECTIONSTRING);

const User = UserModel(db, Sequelize);

db.sync()
  .then(() => {
    logger.info('Database & tables created!');
  });

module.exports = {
  db,
  User
};
