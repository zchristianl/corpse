const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const CookieStrategy = require('passport-cookie');
const {User} = require('../config/database');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    User.findOne({
      where: {
        'email': email
      }
    }).then(function (user) {
      if (user == null) {
        return done(null, false, { message: 'Incorrect credentials'});
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          return done(null, false, {message: 'Invalid username or password'});
        }
      });
    });
  },
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findByPk(id).then(function(user) {
      if(user) {
        done(null, user.get());
      }
      else {
        done(user.errors,null);
      }
    });
  });

  passport.use(new CookieStrategy(
    function(token, done) {
      User.findByToken({ token: token }, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user);
      });
    }
  ));
};

