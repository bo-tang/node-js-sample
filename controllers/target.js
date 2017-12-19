// var Target = require('../models/target');

exports.index = function(req, res) {
    res.send('NOT IMPLEMENTED: Target Home Page');
};

// Display list of all targets
exports.target_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Target list');
};

// Display status of a specific target
exports.target_status = function(req, res) {
    res.send('NOT IMPLEMENTED: Status for Target: ' + req.targetId);
};

// Display list of all metrics of a specific target
exports.target_metric_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Metric list for Target: ' + req.targetId);
};

// Display a specific metric of a specific target
exports.target_metric_status = function(req, res) {
    res.send('NOT IMPLEMENTED: Metric: ' + req.metric + ' for Target: ' + req.targetId);
};