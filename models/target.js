// BASIC SETUP
// ================================================
const fs = require('fs');

// GLOBAL VARIABLES
// ================================================
const rawTargets = require("../assets/targets.json");

// MODEL IMPLEMENTATION
// ================================================

exports.getAllTargets = function(){
  return rawTargets;
  // TODO: handle file io error
  // TODO: handle not found error
}

exports.updateAllTargets = function(targets){
  var res = "";
  // console.log(targets)
  fs.writeFileSync("assets/targets.json", JSON.stringify(targets), 'utf8', function(err){
    if (err){
      console.log('Error writing file: ' + targetsFilePath + '\n' + err);
      throw err;
    }
  });
  fs.readFileSync("assets/targets.json", 'utf8', function(err, data){
    if (err){
      console.log('Error reading file: ' + targetsFilePath + '\n' + err);
      throw err;
    } else {
      res = JSON.parse(data); //now it an object
    }
  });
  return res;
}

exports.getTarget = function(targetId){
  var target = rawTargets.find(function(t){
    return t.id == targetId;
  });
  if(!target){
    return {};
  }
  return target;
  // TODO: handle not found and duplicate id cases
}

exports.getAllMetrics = function(){
  var res = [];
  var tl = rawTargets;
  for(var i = 0; i < tl.length; i++){
    var metrics = tl[i].metrics;
    console.log(metrics)
    for(var j = 0; j < metrics.length; j++){
      if(res.indexOf(metrics[j]) == -1){
        res.push(metrics[j]);
      }
    }
  }
  return res;
}

exports.getTargetMetrics = function(targetId){
  var metrics = [];
  var target = rawTargets.find(function(t){
    return t.id == targetId;
  });
  if(target){
    metrics = target.metrics;
  }
  return metrics;
  // TODO: handle not found and duplicate id cases
}

exports.getTargetManualCMD = function(targetId){
  var manualcmd = [];
  var target = rawTargets.find(function(t){
    return t.id == targetId;
  });
  if(target && target.hasOwnProperty('manual_cmd')){
    manualcmd = target.manual_cmd;
  }
  return manualcmd;
  // TODO: handle not found and duplicate id cases
}

exports.updateTargetManualCMD = function(targetId, manual_cmd){
  var target = rawTargets.find(function(t){
    return t.id == targetId;
  });
  if(target){
    target["manual_cmd"] = manual_cmd;
  }
  return target.manual_cmd;
  // TODO: handle not found and duplicate id cases
}