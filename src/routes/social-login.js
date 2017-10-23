import passport from 'passport';
import express from 'express';

const socialRoutes = express.Router();

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

// google
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
socialRoutes.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
socialRoutes.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/user/list',
    failureRedirect : '/'
  }));

// facebook
// route for facebook authentication and login
socialRoutes.get('/auth/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email'] }));

// handle the callback after facebook has authenticated the user
socialRoutes.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect : '/user/list',
    failureRedirect : '/'
  }));

// twitter
// route for twitter authentication and login
socialRoutes.get('/auth/twitter', passport.authenticate('twitter'));

// handle the callback after twitter has authenticated the user
socialRoutes.get('/auth/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect : '/user/list',
    failureRedirect : '/'
  }));

// linkedin
// route for linkedin authentication and login
socialRoutes.get('/auth/linkedin', passport.authenticate('linkedin'));

// handle the callback after linkedin has authenticated the user
socialRoutes.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', {
    successRedirect : '/user/list',
    failureRedirect : '/'
  }));

// github
// route for twitgithubter authentication and login
socialRoutes.get('/auth/github', passport.authenticate('github'));

// handle the callback after github has authenticated the user
socialRoutes.get('/auth/github/callback',
  passport.authenticate('github', {
    successRedirect : '/user/list',
    failureRedirect : '/'
  }));

export default socialRoutes;