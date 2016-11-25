// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Node Modules
// Import and Node Modules (from package.json) that the app will use)
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var express = require('express');
var favicon = require('serve-favicon');
var db = require('./mongoose/connection');
var request = require('request');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var fs = require('fs');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Route Naming and Importing
// Define routes that will be used
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var routes = require('./routes/index');
var test = require('./routes/test');
var view = require('./routes/view');
var edit = require('./routes/edit');
var appform = require('./routes/miketest');
var vettingworksheet = require('./routes/vettingworksheet');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Init the Express App Engine
// Start Express and serve the favicon
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var app = express();
app.use(favicon(__dirname + '/public/images/favicon.ico'));

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// View Engine
// Setup view engine relative path, register partials, and declare Handlebars as the
// view engine to generate HTML for the client
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.set('view options', { layout: 'layout' });

hbs.registerHelper("debug", function(optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);

    if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Middleware
// Use any middleware for the application that is needed. bodyParse allows parsing to
// and from JSON, cookieParser allows reading and writing cookies, set path to relative
// directory on server
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Middleware the will -ALWAYS- be executed
// This method logs the HTTP Request type and the IPv6 of the user
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.use(function(req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('[ ' + req.method + ' ] request made from ' + 'IP: ' + ip);
    next();
});


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Assign URI to Routes
// Use routes now that app has been initiated and all middleware is defined
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.use('/', routes);
app.use('/test', test);
//app.use('/mt', miketest);
app.use('/view', view);
app.use('/edit', edit);
app.use('/application', appform);
app.use('/vettingworksheet', vettingworksheet);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Server Side Libraries
// Links to jQuery and Boots strap files
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/javascript', express.static(__dirname + '/public/javascripts'));
app.use('/fonts/', express.static(__dirname + '/node_modules/bootstrap/dist/fonts'));

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Error handlers
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// 4XX Code
// 400 - Bad request
app.use(function(req, res, next) {
    var err = new Error('Bad request');
    err.status = 400;
    next(err);
});

// 401 - Unauthorized
app.use(function(req, res, next) {
    var err = new Error('Unauthorized');
    err.status = 401;
    next(err);
});

// 404 - Not found
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler, will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler, no stacktrace leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;