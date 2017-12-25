// BASE SETUP
// ==============================================
const express = require('express');
const router  = express.Router();
const app     = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const port    = process.env.PORT || 5000;
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(methodOverride());
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
// Set static files
app.use(express.static(__dirname + '/public'));
// Set directory to contain the templates ('views')
app.set('views', __dirname + '/views');
// Set view engine
app.set('view engine', 'ejs');

// REQUIRED MODULE ROUTES
// ==============================================
var dashboard = require('./routes/dashboard');
var target = require('./routes/target');
var status = require('./routes/status');

// ROUTES
// ==============================================
// route middleware that will happen on every request
router.use(function(req, res, next) {
    // log each request to the console
    console.log(req.method, req.url);
    // continue doing what we were doing and go to the route
    next();
});

app.use(function (err, req, res, next) {
 console.error(err.stack);
 response.status(500).send(err.message);
});

// route to specific modules
router.use('/', dashboard);   // will be changed in the future if more pages built
router.use('/target', target);
router.use('/status', status);

// IMPORTANT: apply the routes to our application
app.use('/', router);

// START THE SERVER
// ==============================================
app.listen(port);
console.log('Magic happens on port ' + port);

function logErrors (err, req, res, next) {
  console.error(err.stack)
  next(err)
}

function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}

function errorHandler (err, req, res, next) {
  res.status(500)
  res.render('error', { error: err })
}