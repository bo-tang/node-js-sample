// BASE SETUP
// ==============================================
const express = require('express');
const router  = express.Router();

// REQUIRED CONTROLLER MODULES
// ==============================================
var statusController = require('../controllers/status');
// var instance_controller = require('../controllers/instance');
// var metric_controller = require('../controllers/metric');

// ROUTES
// ==============================================
// Home page route
router.get('/', statusController.dashboard);

// all status route
router.get('/all', statusController.all_status);

// target list route
router.get('/targets', statusController.target_list);

// target status route
router.get('/:targetId', statusController.target_status);

// target status metrics route
router.get('/:targetId/metrics', statusController.target_metric_list);

// target metric status route
router.get('/:targetId/:metric', statusController.target_metric_value);

// VALIDATE PARAMETERS
// ==============================================
// //route middleware to validate :targetId
// router.param('targetId', function(req, res, next, name) {
//     // do validation on name here
//     // blah blah validation
//     var targetId = 1;
//     // log something so we know its working
//     console.log('doing targetId validations on ' + targetId);

//     // once validation is done save the new item in the req
//     req.params.targetId = targetId;
//     // go to the next thing
//     next(); 
// });

// // route middleware to validate :metric
// router.param('metric', function(req, res, next, name) {
//     // do validation on name here
//     // blah blah validation
//     var metric = 'cpu';
//     // log something so we know its working
//     console.log('doing metric validations on ' + metric);

//     // once validation is done save the new item in the req
//     req.metric = metric;
//     // go to the next thing
//     next(); 
// });

module.exports = router;