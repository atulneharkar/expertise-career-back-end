// load all the things we need
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LinkedInStrategy = require('passport-linkedin');
var GithubStrategy = require('passport-github');

// load up the user model
import User from '../models/user';

// load the auth variables
import configAuth from './auth';

module.exports = function(passport) {

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
      done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
          done(err, user);
      });
  });

  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  passport.use(new FacebookStrategy({

    // pull in our app id and secret from our auth.js file
    clientID        : configAuth.facebookAuth.clientID,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : configAuth.facebookAuth.callbackURL,
    profileFields   : ['id', 'displayName', 'photos', 'name']

  },

  // facebook will send back the token and profile
  function(token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(function() {

      // find the user in the database based on their facebook id
      User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err);

        // if the user is found, then log them in
        if (user) {
          return done(null, user); // user found, return that user
        } else {
          // if there is no user found with that facebook id, create them
          var newUser = new User();

          // set all of the facebook information in our user model
          newUser.facebook.id    = profile.id; // set the users facebook id                   
          //newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
          newUser.facebook.name  = newUser.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned

          if(profile.photos) {
            newUser.avatar = profile.photos[0].value ? profile.photos[0].value : '';
          }

          // save our user to the database
          newUser.save(function(err) {
            if (err)
              throw err;

            // if successful, return the new user
            return done(null, newUser);
          });
        }

      });
    });

  }));

  // =========================================================================
  // TWITTER =================================================================
  // =========================================================================
  passport.use(new TwitterStrategy({

    consumerKey     : configAuth.twitterAuth.consumerKey,
    consumerSecret  : configAuth.twitterAuth.consumerSecret,
    callbackURL     : configAuth.twitterAuth.callbackURL

  },
  function(token, tokenSecret, profile, done) {

    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Twitter
    process.nextTick(function() {

      User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err);

        // if the user is found then log them in
        if (user) {
          return done(null, user); // user found, return that user
        } else {
          // if there is no user, create them
          var newUser = new User();

          // set all of the user data that we need
          newUser.twitter.id = profile.id;
          //newUser.twitter.token       = token;
          newUser.twitter.name = newUser.name = profile.displayName;

          if(profile.profile_image_url_https) {
            newUser.avatar = profile.profile_image_url_https;
          }

          // save our user into the database
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });

    });

  }));

  // =========================================================================
  // GOOGLE ==================================================================
  // =========================================================================
  passport.use(new GoogleStrategy({

    clientID        : configAuth.googleAuth.clientID,
    clientSecret    : configAuth.googleAuth.clientSecret,
    callbackURL     : configAuth.googleAuth.callbackURL,

  },
  function(token, refreshToken, profile, done) {

    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Google
    process.nextTick(function() {

      // try to find the user based on their google id
      User.findOne({ 'google.id' : profile.id }, function(err, user) {
        if (err)
          return done(err);

        // if a user is found, log them in
        if (user) {
          return done(null, user);
        } else {
          // if the user isnt in our database, create a new user
          var newUser = new User();

          // set all of the relevant information
          newUser.google.id = profile.id;
          // newUser.google.token = token;
          newUser.google.name = newUser.name = profile.displayName;

          if(profile.image.url) {
            newUser.avatar = profile.image.url;
          }

          // save the user
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });

  }));

  // =========================================================================
  // LinkedIn ==================================================================
  // =========================================================================
  passport.use(new LinkedInStrategy({

    consumerKey     : configAuth.linkedinAuth.consumerKey,
    consumerSecret  : configAuth.linkedinAuth.consumerSecret,
    callbackURL     : configAuth.linkedinAuth.callbackURL

  },
  function(token, refreshToken, profile, done) {

    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Linkedin
    process.nextTick(function() {

      // try to find the user based on their google id
      User.findOne({ 'linkedin.id' : profile.id }, function(err, user) {
        if (err)
          return done(err);

        // if a user is found, log them in
        if (user) {
          return done(null, user);
        } else {
          // if the user isnt in our database, create a new user
          var newUser = new User();

          // set all of the relevant information
          newUser.linkedin.id = profile.id;
          // newUser.linkedin.token = token;
          newUser.linkedin.name = newUser.name = profile.displayName;

          // save the user
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });

  }));

  // =========================================================================
  // Github ==================================================================
  // =========================================================================
  passport.use(new GithubStrategy({

    clientID        : configAuth.githubAuth.clientID,
    clientSecret    : configAuth.githubAuth.clientSecret,
    callbackURL     : configAuth.githubAuth.callbackURL,

  },
  function(token, refreshToken, profile, done) {

    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Github
    process.nextTick(function() {

      // try to find the user based on their google id
      User.findOne({ 'github.id' : profile.id }, function(err, user) {
        if (err)
          return done(err);

        // if a user is found, log them in
        if (user) {
          return done(null, user);
        } else {
          // if the user isnt in our database, create a new user
          var newUser = new User();

          // set all of the relevant information
          newUser.github.id    = profile.id;
          //      newUser.github.token = token;
          newUser.github.name = newUser.name = profile.displayName;

          if(profile.avatar_url) {
            newUser.avatar = profile.avatar_url;
          }

          // save the user
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });

  }));

};
