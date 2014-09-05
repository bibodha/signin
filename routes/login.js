// app/login.js
var express = require('express');
var router = express.Router();
var passport = require('passport');
	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	router.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login');
	});

	// process the login form
	router.post('/login', function(){
      passport.authenticate('local-login', {
  		successRedirect : '/', // redirect to the secure profile section
  		failureRedirect : '/' // redirect back to the signup page if there is an error
  	})
  });

	// =====================================
	// LOGOUT ==============================
	// =====================================
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
};

module.exports = router;
