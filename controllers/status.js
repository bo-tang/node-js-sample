// Require model
const statusModel = require('../models/status');

// Display all status of all targets
// example: ["id":1, "name":"Hiretual", "status":{}]
exports.get_all_status = function(req, res) {
  var allStatus = statusModel.getAllStatus(function(err, doc) {
    if (err) return next(err);
    res.json(doc);
  });
  res.send(allStatus);
};

// Display status of a specific target
exports.get_target_status = function(req, res) {
  console.log(req.params.targetId)
  var targetStatus = statusModel.getTargetStatus(req.params.targetId, function(err, doc) {
    if (err) return next(err);
    res.json(doc);
  });
  res.send(targetStatus);
};

// Display a specific metric of a specific target
exports.get_target_metric_value = function(req, res) {
  var targetMetricValue = statusModel.getTargetMetricValue(req.params.targetId, req.params.metric, function(err, doc) {
    if (err) return next(err);
    res.json(doc);
  });
  res.send(targetMetricValue);
};