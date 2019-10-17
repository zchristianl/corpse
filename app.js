const express = require('express');
const {db, User} = require('./config/database');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const logger = require('./utils/logger');

// Check DB connection
db
  .authenticate()
  .then(() => {
    logger.info('Connection has been established successfully.');
  })
  .catch(err => {
    logger.error('Unable to connect to the database:', err);
  });

const app = express();

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
  User.findOrCreate({ where: { name: 'testname2', username: 'testusername2', password: 'testpass2', email: 'testemail2' }});
  logger.debug(User.findAll());
});

const server = app.listen(3000, () => {
  logger.info('App running on port 3000');
});

module.exports = server;
