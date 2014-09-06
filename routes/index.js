var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login', {message: req.flash('loginMessage')});
});

// process the login form
router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/login',// redirect back to the login page if there is an error
        failureFlash : true
    }));

// =====================================
// LOGOUT ==============================
// =====================================
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
  if (req.isAuthenticated()){
    return next();
  } else {
  // if they aren't redirect them to the home page
    res.redirect('/login');
  }
};

module.exports = router;
