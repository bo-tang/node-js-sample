// Require model
const statusModel = require('../models/status');
const targetModel = require('../models/target');

// Render the dashboard page
exports.dashboard = function (req, res){
  var data = {};
  // var metrics = statusModel.getAllMetrics(function(err, status){
  //       if (err) return handleError(err);
  //     });
  var targets = targetModel.getAllTargets(function(err, doc) {
      if (err) return next(err);
      res.json(doc);
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
    var row = statusModel.getTargetStatus(targets[i].id, function(err, doc) {
      if (err) return next(err);
      res.json(doc);
    });
    rowsArray.push(row);
  }
  data.rows = rowsArray;
  data.targets = targets;
  // console.log(data);
  // ejs engine picks pages in /views folder by default
  res.render('dashboard', data);
};
