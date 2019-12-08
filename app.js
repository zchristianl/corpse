const express = require('express');
const models = require('./config/database');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const logger = require('./utils/logger');
const passport = require('passport');
const fs = require('fs');
const app = express();
const compileSass = require('compile-sass');

global.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next ? next() : true;
  } else {
    res.redirect('/users/login');
  }
};

global.ensureSeller = (req, res, next) => {
  if (req.isAuthenticated() && req.user.account_type === 'seller') {
    return next ? next() : true;
  } else {
    req.flash('danger', 'You do not have permission to access that URL.');
    res.redirect('back');
  }
};

global.ensureClient = (req, res, next) => {
  if (req.isAuthenticated() && req.user.account_type === 'client') {
    return next ? next() : true;
  } else {
    req.flash('danger', 'You do not have permission to access that URL.');
    res.redirect('back');
  }
};

// redirect bootstrap JS
app.use('/bjs', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
// redirect JS jQuery
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
// redirect Bootstrap CSS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
// redirect Popper for Bootstrap
app.use('/popper', express.static(__dirname + '/node_modules/popper.js/dist/umd'));

// Set public folders
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname + '/js'));

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

app.use('/payment/stripe_webhook', bodyParser.raw({ type: '*/*' }));
// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000 * 30,
    expires: false
  }
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
app.get('*', function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.get('/', global.ensureAuthenticated, (req, res) => {
  res.render('layout');
});

/*
* Register all Routes into app based on route file name
* */
let files = fs.readdirSync(path.join(__dirname, './routes'));

files.forEach((f) => {
  if (path.extname(f) === '.js') {
    let fileName = path.basename(f, '.js');
    app.use('/' + fileName, require('./routes/' + fileName + '.js'));
  }
});

compileSass.compileSassAndSave('scss/custom.scss', 'public/css');

app.listen(3000, () => {
  logger.info('App running on port 3000');
});

module.exports = app; 
