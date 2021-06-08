const passport = require('passport');
let LocalStrategy  = require('passport-local').Strategy;
const User = require('../models/User');

const customFields = {
    usernameField: 'email',
    passwordField: 'password'
};

// Configure the local strategy for use by Passport.
//
// The local strategy requires a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
let verifyCallback =  async function(email, password, done){

    try {
        await User.findOne({email}, function(err, user){
            // console.log(user);
        if(err){
            // console.log("Login error", err);
            return done(err);
        }
        if(!user){
            // console.log("no user", user);

            return done(null, false);
        }
        if(user.password !== password){
            return done(null, false);
        }
        return done(null, user, false);
    })  
    }catch (error) {
        return done(error);
    }
}

let localStrategy = new LocalStrategy(customFields, verifyCallback);

passport.use(localStrategy);

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser( async function(id, done) {
   await User.findById(id, function (err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  });