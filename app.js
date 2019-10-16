const express = require('express');
const Sequelize = require('sequelize');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const logger = require('./utils/logger');
require('dotenv').config();

// DB connection
let sequelize = new Sequelize(process.env.DB_CONNECTIONSTRING);

// Check DB connection
sequelize
  .authenticate()
  .then(() => {
    logger.info('Connection has been established successfully.');
  })
  .catch(err => {
    logger.error('Unable to connect to the database:', err);
  });

let app = express();

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  res.send('ci with travis');
});


let server = app.listen(3000, () => {
  logger.info('App running on port 3000');
});

module.exports = server;
