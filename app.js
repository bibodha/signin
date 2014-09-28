var express = require('express');
var app = express();
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var pg = require('pg.js');
var session = require('express-session');

//Database
var conString = process.env.DATABASE_URL || 'postgres://admin:test@localhost/clubhouse';

var db = '';

pg.connect(conString, function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err);
    }
    else {
      db = client;
      return console.log('connected to PostgreSQL');
    }
});

var config = require('./config/passport')(db, passport);
var routes = require('./routes/index');
var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//passport
app.use(session({secret: 'somesecretphrase',
                 saveUninitialized: true,
                 resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, callback){
    req.db = db;
    callback();
});

app.use('/', routes);
app.use('/users', users);
app.locals.edit = false;

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
