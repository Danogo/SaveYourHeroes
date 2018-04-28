const express = require('express'),
      User = require('../models/user'),
      passport = require('passport'),
      router = express.Router();

//handling GET request to root path
router.get('/', (req, res) => {
  //render landing page
  res.render('landingPage');
});

//======= Authentication routes ===========

//handling GET request for /register route, NEW - show form to create new user
router.get('/register', (req, res) => {
  res.render('register');
});

//handling POST request for /register route, CREATE - create new user and redirect to camps
router.post('/register', (req, res) => {
  //create user account using register method from passport-local-mongoose -
  // - added through plugin in user model
  //password is hashed/salted in db
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      //display proper message(coming from mongoose object) about occuring problem
      return res.render('register', {errorMsg: err.message});
    } //auth of a user, try to login (authenticate also invokes req.login under the hood)
      passport.authenticate('local')(req, res, () => res.redirect("/camps"));
  })
});

//handling GET request for /login route, NEW - display form to log in
router.get('/login', (req, res) => {
  res.render('login');
});

//handling POST request for /login route, login logic
router.post('/login', passport.authenticate('local', {
  successRedirect: '/camps',
  failureRedirect: '/login'
}), (req, res) => {});

//handling get request for /logout route, logoute logic
router.get('/logout', (req, res) => {
  req.flash('success', 'You have been logged out successfully!');
  req.logout();
  res.redirect('/');
});

module.exports = router;
