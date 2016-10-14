var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessions = require('client-sessions');

// var managerAPITest = require('./ManagerAPITest');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var sessionToken = process.argv[3];

// Middle ware for sessions

app.use(sessions({
  cookieName: "marasession",
  secret: sessionToken,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.use(function(req, res, next) {
	if (req.marasession && req.marasession.user) {
		User.findOne( { 'email': req.marasession.user.email} , function(err, user) {
			if (user) {
				req.user = user;
				delete req.user.sub;
				req.marasession.user = req.user;
			}
			next();
		});
	} else {
		next();
	}
});


app.use('/', routes);
app.use('/users', users);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/app/index.html');
});

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
  // var err = new Error('Not Found');
  // err.status = 404;
  // next(err);
// });

// // error handlers

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
  // app.use(function(err, req, res, next) {
    // res.status(err.status || 500);
    // res.render('error', {
      // message: err.message,
      // error: err
    // });
  // });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
  // res.status(err.status || 500);
  // res.render('error', {
    // message: err.message,
    // error: {}
  // });
// });


module.exports = app;
