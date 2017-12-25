// BASE SETUP
// ==============================================
const express = require('express');
const router  = express.Router();

// REQUIRED CONTROLLER MODULES
// ==============================================
var dashboardController = require('../controllers/dashboard');

// ROUTES
// ==============================================
// all status route
router.get('/', dashboardController.dashboard);

module.exports = router;