// BASE SETUP
// ==============================================
const express = require('express');
const router  = express.Router();

// REQUIRED CONTROLLER MODULES
// ==============================================
var statusController = require('../controllers/status');

// ROUTES
// ==============================================
// all status route
router.get('/all', statusController.get_all_status);

// target status route
router.get('/:targetId', statusController.get_target_status);

// target manualcmd results route
router.get('/:targetId/manualcmd_results', statusController.get_target_manualcmd_results);

// target metric status route
router.get('/:targetId/:metric', statusController.get_target_metric_value);

// target manualcmd route
router.put('/:targetId/manualcmd', statusController.exec_target_manualcmd);

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