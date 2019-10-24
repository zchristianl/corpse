const express = require('express');
const models = require('./config/database');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const logger = require('./utils/logger');
const passport = require('passport');
const app = express();

// prepare server
// redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
// redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
// redirect
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Check DB connection
models.db
  .authenticate()
  .then(() => {
    logger.info('Connection has been established successfully.');
  })
  .catch(err => {
    logger.error('Unable to connect to the database:', err);
  });

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Passport config
require('./config/passport')(passport);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global for user
app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

app.get('/', (req, res) => {
  res.render('layout');
});

// Route files
let users = require('./routes/users');
app.use('/users', users);

app.listen(3000, () => {
  logger.info('App running on port 3000');
});