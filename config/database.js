const Sequelize = require('sequelize');
const ProjectRequire = {};
const logger = require('../utils/logger');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

/*
* Register all models into ProjectRequire based on model name
* */

let files =fs.readdirSync(path.join(__dirname,'../models'));

files.forEach((f)=> {
  if (path.extname(f) === '.js') {
    let fileName = path.basename(f, '.js');
    ProjectRequire[fileName] = require('../models/' + fileName + '.js');
  }
});

// DB connection
const db = new Sequelize(process.env.DB_CONNECTIONSTRING);
/*
 * Model Registration Step 1
 * Declare variable and call (db, Sequelize) on it based on ProjectRequire
*/
const User = ProjectRequire.user(db, Sequelize);
const Inventory = ProjectRequire.inventory(db, Sequelize);

db.sync().then(function() {
  logger.info('Database tables synced. Oh Joy!');
}).catch(function(err) {
  logger.error(err, 'Something went wrong with the Database Update!');
});

//Model Registration Step 2, Add variable to this list
module.exports = {
  db,
  User,
  Inventory
};