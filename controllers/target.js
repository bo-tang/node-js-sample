// Require model
const targetModel = require('../models/target');

// Display list of all targets
exports.get_all_targets = function(req, res) {
  var targetList = targetModel.getAllTargets();
  res.send(targetList);
};

// update all targets
exports.update_all_targets = function(req, res) {
  req.params.targets
  var newTargetList = targetModel.updateAllTargets(req.body.targets, function(err, doc) {
    if (err) return next(err);
    res.json(doc);
  });
  res.send(newTargetList);
};

// Display a target info by id
exports.get_target = function(req, res) {
  var target = targetModel.getTarget(req.params.targetId, function(err, doc) {
    if (err) return next(err);
    res.json(doc);
  });
  res.send(target);
};

// Display union list of the  metrics for all the targets
exports.get_all_metrics = function(req, res) {
  var metricsList = targetModel.getAllMetrics(function(err, doc) {
    if (err) return next(err);
    res.json(doc);
  });
  res.send(metricsList);
};

// Display list of all metrics of a specific target
exports.get_target_metrics = function(req, res) {
  var targetMetrics = targetModel.getTargetMetrics(req.params.targetId, function(err, doc) {
    if (err) return next(err);
    res.json(doc);
  });
  res.send(targetMetrics);
};

// Display list of all manual commands of a specific target
exports.get_target_manualcmd = function(req, res) {
  var targetManualCMD = targetModel.getTargetManualCMD(req.params.targetId, function(err, doc) {
    if (err) return next(err);
    res.json(doc);
  });
  res.send(targetManualCMD);
};