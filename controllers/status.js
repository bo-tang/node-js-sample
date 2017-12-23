// Require model
const statusModel = require('../models/status');
const targetModel = require('../models/target');

// Render the dashboard page
exports.dashboard = function (req, res){
  var data = {};
  // var metrics = statusModel.getAllMetrics(function(err, status){
  //       if (err) return handleError(err);
  //     });
  var targets = targetModel.getAllTargets(function(err, status){
      if (err) return handleError(err);
    });
  // compose colums array
  // var columnsArray = ["id", "name"];
  // for(var i = 0; i < metrics.length; i++){
  //   columnsArray.push(metrics[i]);
  // }
  // data.columns = columnsArray;
  // compose rows array
  var rowsArray = [];
  for(var i = 0; i < targets.length; i++){
    var row = statusModel.getTargetStatus(targets[i].id, function(err, status){
        if (err) return handleError(err);
      });
    rowsArray.push(row);
  }
  data.rows = rowsArray;
  data.targets = targets;
  // console.log(data);
  // ejs engine picks pages in /views folder by default
  res.render('dashboard', data);
};

// Display all status of all targets
// example: ["id":1, "name":"Hiretual", "status":{}]
exports.all_status = function(req, res) {
  var allStatus = statusModel.getAllStatus(function(err, status){
    if (err) return handleError(err);
  });
  res.send(allStatus);
};

// Display status of a specific target
exports.target_status = function(req, res) {
  console.log(req.params.targetId)
  var targetStatus = statusModel.getTargetStatus(req.params.targetId, function(err, status){
    if (err) return handleError(err);
  });
  res.send(targetStatus);
};

// Display list of all metrics of a specific target
exports.target_metric_list = function(req, res) {
  var targetMetrics = statusModel.getTargetMetrics(req.params.targetId, function(err, status){
    if (err) return handleError(err);
  });
  res.send(targetMetrics);
};

// Display a specific metric of a specific target
exports.target_metric_value = function(req, res) {
  var targetMetricValue = statusModel.getTargetMetricValue(req.params.targetId, req.params.metric, function(err, status){
    if (err) return handleError(err);
  });
  res.send(targetMetricValue);
};