// BASE SETUP
// ==============================================
const express = require('express');
const router  = express.Router();
const app     = express()
const port    = process.env.PORT || 5000;
// Set static files
app.use(express.static(__dirname + '/public'));
// Set directory to contain the templates ('views')
app.set('views', __dirname + '/views');
// Set view engine
app.set('view engine', 'ejs');

// REQUIRED MODULE ROUTES
// ==============================================
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
router.use('/', status);   // will be changed in the future if more pages built
router.use('/status', status);

// IMPORTANT: apply the routes to our application
app.use('/', router);

// START THE SERVER
// ==============================================
app.listen(port);
console.log('Magic happens on port ' + port);