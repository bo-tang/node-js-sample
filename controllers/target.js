// Require model
const targetModel = require('../models/target');

// Display list of all targets
exports.get_all_targets = function(req, res) {
  var targetList = targetModel.getAllTargets(function(err, status){
    if (err) return handleError(err);
  });
  res.send(targetList);
};

// update all targets
exports.update_all_targets = function(req, res) {
  req.params.targets
  var newTargetList = targetModel.updateAllTargets(req.body.targets, function(err, status){
    if (err) return handleError(err);
  });
  res.send(newTargetList);
};