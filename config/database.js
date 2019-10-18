const Sequelize = require('sequelize');
const UserModel = require('../models/user');
const logger = require('../utils/logger');
require('dotenv').config();

// DB connection
const db = new Sequelize(process.env.DB_CONNECTIONSTRING);

const User = UserModel(db, Sequelize);

db.sync().then(function() {
  console.log('Nice! Database looks fine.');
}).catch(function(err) {
  console.log(err, "Something went wrong with the Database Update!");
});

module.exports = {
  db,
  User
};
