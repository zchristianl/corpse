const Sequelize = require('sequelize');

const relations = require('./associations')

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
const Building = ProjectRequire.building(db, Sequelize);
const Client = ProjectRequire.client(db, Sequelize);
const Department = ProjectRequire.department(db, Sequelize);
const Institution = ProjectRequire.institution(db, Sequelize);
const Lab = ProjectRequire.lab(db, Sequelize);
const Location = ProjectRequire.location(db, Sequelize);
const User = ProjectRequire.user(db, Sequelize);




let models = {
  db,
  Building,
  Client,
  Department,
  Institution,
  Lab,
  Location,
  User
};


relations.run(models);







db.sync()
  .then(() => {
    logger.info('Database & tables created!');
  });



//Model Registration Step 2, Add variable to this list
module.exports = models;
