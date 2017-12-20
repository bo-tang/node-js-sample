const rawTargets = require("../assets/targets.json");

exports.getAllStatus = function(){
  var res = [];
  var tl = exports.getTargetList();
  tl.forEach(function(t){
    var tRes = {"id": t.id, "name": t.name};
    var targetStatus = exports.getTargetStatus(t.id);
    tRes.status = targetStatus.status;
    res.push(tRes);
  });
  return res;
}

exports.getAllMetrics = function(){
  var res = [];
  var tl = exports.getTargetList();
  for(var i = 0; i < tl.length; i++){
    var metrics = tl[i].metrics;
    for(var j = 0; j < metrics.length; j++){
      if(res.indexOf(metrics[j]) == -1){
        res.push(metrics[j]);
      }
    }
  }
  return res;
}

exports.getTargetStatus = function(targetId){
  var res = {};
  res.id = targetId;
  res.status = {};
  var metrics = exports.getTargetMetrics(targetId);
  metrics.forEach(function(m){
    res.status[m] = exports.getTargetMetricValue(targetId, m);
  });
  return res;
}

exports.getTargetList = function(){
  return rawTargets;
  // TODO: handle file io error
  // TODO: handle not found error
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

exports.getTargetMetricValue = function(targetId, metric){
  var res = "";
  switch(metric){
    case "cpu":
      res = exports.getCPU(targetId);
      break;
    case "memory":
      res = exports.getMemory(targetId);
      break;
    case "disk":
      res = exports.getDisk(targetId);
      break;
    case "responseDelay":
      res = exports.getResponseDelay(targetId);
      break;
    case "httpCode":
      res = exports.getHttpCode(targetId);
      break;
    case "connections":
      res = exports.getConnections(targetId);
      break;
    default:
  }
  return res;
}

exports.getCPU = function(targetId){
  return '0.05';
}

exports.getMemory = function(targetId){
  return '23%';
}

exports.getDisk = function(targetId){
  return '1322MB';
}

exports.getResponseDelay = function(targetId){
  return '108ms';
}

exports.getHttpCode = function(targetId){
  return '200';
}

exports.getConnections = function(targetId){
  return '122';
}