// BASE SETUP
// ==============================================
const express = require('express');
const router  = express.Router();
const bodyParser = require('body-parser');

// REQUIRED CONTROLLER MODULES
// ==============================================
var targetController = require('../controllers/target');

// ROUTES
// ==============================================
// target list route
router.get('/all', targetController.get_all_targets);

// update target list route
router.post('/all', targetController.update_all_targets);

// metrics list route
router.get('/metrics', targetController.get_all_metrics);

// target status route
router.get('/:targetId', targetController.get_target);

// target status metrics route
router.get('/:targetId/metrics', targetController.get_target_metrics);

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