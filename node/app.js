var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var multer = require('multer');
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var app = express();

var appset = require('./appset');

// connect mongodb
mongoose.connect(appset.mongodbUrl + appset.dbName);

// view engine setups
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// var done = false;
// app.use(multer({dest:'./public/upload/'}).single('image'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
// extended - true : any type,  false : key value pair
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(session({
    secret: ''+new Date().getTime(),
    cookie: {secure: false},
    resave: true,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'appset')));
app.use(express.static(path.join(__dirname, 'public')));
//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", appset.url_client);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Content-Range, Content-Disposition, Content-Description");
    res.header('Access-Control-Allow-Credentials', true);
    next();
}
app.use(allowCrossDomain);

// api routing
var api_login = require('./routes/api/login');
var api_signup = require('./routes/api/signup');
var api_profile = require('./routes/api/profile');
var api_password = require('./routes/api/password');
var api_member = require('./routes/api/member');
var api_bookmark = require('./routes/api/bookmark');
var api_board = require('./routes/api/board');
app.use('/api/login', api_login);
app.use('/api/signup', api_signup);
app.use('/api/profile', api_profile);
app.use('/api/password', api_password);
app.use('/api/member', api_member);
app.use('/api/bookmark', api_bookmark);
app.use('/api/board', api_board);

// page routing
var routes = require('./routes/index');
var login = require('./routes/login');
app.use('/', routes);
app.use('/login', login);

// test routing
// var test = require('./routes/test/mongoose/mongoose');
var test = require('./routes/test/test1');
app.use('/test1', test);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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
