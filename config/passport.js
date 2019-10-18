const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const logger = require('../utils/logger');
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
          return done(null, false, { message: 'Incorrect credentials.' })
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if(err) throw err;
          if(isMatch){
            return done(null, user);
          } else {
            return done(null, false, {message: "Invalid username or password"});
          }
        });
      });
    }
  ));




  // passport.use(new LocalStrategy( 
  //   (email, password, done) => {
  //     logger.debug('in here');
  //     User.findOne({where: {'email': email}}).then((user) => {
  //       logger.debug('in here');
  //       if (!user) {
  //         return done(null, false, { message: 'Email does not exist' });
  //       }

  //       bcrypt.compare(password, user.password, (err, isMatch) => {
  //         if(err) throw err;
  //         if(isMatch){
  //           return done(null, user);
  //         } else {
  //           return done(null, false, {message: "Invalid username or password"});
  //         }
  //       });
  //     }).catch((err) => {
  //       console.log("Error:",err);
  //       return done(null, false, { message: 'Something went wrong with your login' });
  //     });
  //   }
  // ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
      if(user) {
        done(null, user.get());
      }
      else {
        done(user.errors,null);
      }
    });
  });
}