const Sequelize = require('sequelize');
const relations = require('./associations');
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
const Op = Sequelize.Op;
/*
 * Model Registration Step 1
 * Declare variable and call (db, Sequelize) on it based on ProjectRequire
*/
const Department = ProjectRequire.department(db, Sequelize);
const User = ProjectRequire.user(db, Sequelize);
const Inventory = ProjectRequire.inventory(db, Sequelize);
const Order = ProjectRequire.order(db, Sequelize);
const Item = ProjectRequire.item(db,Sequelize);
const Payment = ProjectRequire.payment(db,Sequelize);
const Note = ProjectRequire.note(db, Sequelize);

//Model Registration Step 2, Add variable to this list
let models = {
  db,
  Op,
  Department,
  User,
  Inventory,
  Order,
  Item,
  Payment,
  Note
};

relations.run(models);

db.options.logging = false;

db.sync().then(function() {
  logger.info('Database table sync successful. Rock on, son!');
}).catch(function(err) {
  logger.error(err, 'Database table sync failed.');
});

module.exports = models;