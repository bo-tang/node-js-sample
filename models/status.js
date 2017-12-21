// BASIC SETUP
// ================================================
const fs = require('fs');
const sshClient = require('ssh2').Client;
const request = require('request');

// GLOBAL VARIABLES
// ================================================
const rawTargets = require("../assets/targets.json");
// IMPORTANT: STATIC VARIABLE FOR ALL THE STATUS UPDATES
var allStatus = [];
// initialize allStatus
for(var i = 0; i < rawTargets.length; i++){
  var target = {
    "id": rawTargets[i].id,
    "name": rawTargets[i].name,
  };
  for(var j = 0; j < rawTargets[i].metrics.length; j++){
    target[rawTargets[i].metrics[j]] = "";
  }
  allStatus.push(target);
}

// MODEL IMPLEMENTATION
// ================================================
exports.getAllStatus = function(){
  var res = allStatus;
  // trigger all target status update
  for(var i = 0; i < res.length; i++){
    res[i] = exports.getTargetStatus(res[i].id);
  }
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
  var targetStatus = allStatus.find(function(s){
    return s.id == targetId;
  });
  if(!targetStatus){
    return {};
  }
  // trigger metrics update
  var metrics = exports.getTargetMetrics(targetId);
  for(var i = 0; i < metrics.length; i++){
    targetStatus[metrics[i]] = exports.getTargetMetricValue(targetId, metrics[i]);
  }
  return targetStatus;
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
  // // find the status with the targetId for the 1st appearance
  // var status = allStatus.find(function(s){
  //   return s.id == targetId;
  // });
  // if(!status){
  //   return res;
  // }
  // find the target object with the targetId for the 1st appearance
  var target = rawTargets.find(function(t){
    return t.id == targetId;
  });
  if(!target){
    return res;
  }
  // trigger update of each metric
  switch(metric){
    case "cpu":
      res = exports.getCPU(target);
      break;
    case "memory":
      res = exports.getMemory(target);
      break;
    case "disk":
      res = exports.getDisk(target);
      break;
    case "responseDelay":
      res = exports.getHttpResponse(target).responseDelay;
      break;
    case "httpCode":
      res = exports.getHttpResponse(target).httpCode;
      break;
    case "connections":
      res = exports.getConnections(target);
      break;
    default:
  }
  return res;
}

exports.getCPU = function(target){
  var res = "";
  for(var i = 0; i < allStatus.length; i++){
    if(allStatus[i].id == target.id){
      res = allStatus[i].cpu;
      break;
    }
  }
  var conn = new sshClient();
  conn.on('ready', function() {
    // console.log('Client :: ready');
    conn.exec('top -bn1 | grep load | awk \'{printf "%.2f", $(NF-0)}\'', function(err, stream) {
      if (err) throw err;
      stream.on('close', function(code, signal) {
        // console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
      }).on('data', function(data) {
        // console.log('STDOUT: ' + data);
        for(var i = 0; i < allStatus.length; i++){
          if(allStatus[i].id == target.id){
            allStatus[i].cpu = data;
            break;
          }
        }
      }).stderr.on('data', function(data) {
        // console.log('STDERR: ' + data);
      });
    });
  }).connect({
    host: target.host,
    port: 22,
    username: target.ssh_username,
    privateKey: fs.readFileSync(target.ssh_cred)
  });
  return res;
}

exports.getMemory = function(target){
  var res = "";
  for(var i = 0; i < allStatus.length; i++){
    if(allStatus[i].id == target.id){
      res = allStatus[i].memory;
      break;
    }
  }
  var conn = new sshClient();
  conn.on('ready', function() {
    // console.log('Client :: ready');
    conn.exec('free -m | awk \'NR==2{printf "%s/%sMB (%.2f%%)", $3,$2,$3*100/$2 }\'', function(err, stream) {
      if (err) throw err;
      stream.on('close', function(code, signal) {
        // console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
      }).on('data', function(data) {
        // console.log('STDOUT: ' + data);
        for(var i = 0; i < allStatus.length; i++){
          if(allStatus[i].id == target.id){
            allStatus[i].memory = data;
            break;
          }
        }
      }).stderr.on('data', function(data) {
        // console.log('STDERR: ' + data);
      });
    });
  }).connect({
    host: target.host,
    port: 22,
    username: target.ssh_username,
    privateKey: fs.readFileSync(target.ssh_cred)
  });
  return res;
}

exports.getDisk = function(target){
  var res = "";
  for(var i = 0; i < allStatus.length; i++){
    if(allStatus[i].id == target.id){
      res = allStatus[i].disk;
      break;
    }
  }
  var conn = new sshClient();
  conn.on('ready', function() {
    // console.log('Client :: ready');
    conn.exec('df -h | awk \'$NF=="/"{printf "%d/%dGB (%s)", $3,$2,$5}\'', function(err, stream) {
      if (err) throw err;
      stream.on('close', function(code, signal) {
        // console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
      }).on('data', function(data) {
        // console.log('STDOUT: ' + data);
        for(var i = 0; i < allStatus.length; i++){
          if(allStatus[i].id == target.id){
            allStatus[i].disk = data;
            break;
          }
        }
      }).stderr.on('data', function(data) {
        // console.log('STDERR: ' + data);
      });
    });
  }).connect({
    host: target.host,
    port: 22,
    username: target.ssh_username,
    privateKey: fs.readFileSync(target.ssh_cred)
  });
  return res;
}

exports.getHttpResponse = function(target){
  var res = {};
  for(var i = 0; i < allStatus.length; i++){
    if(allStatus[i].id == target.id){
      res.httpCode = allStatus[i].httpCode;
      res.responseDelay = allStatus[i].responseDelay;
      break;
    }
  }
  // update in allStatus
  request({url: target.url, time : true}, function(error, response, body) {
    for(var i = 0; i < allStatus.length; i++){
      if(allStatus[i].id == target.id){
        allStatus[i].httpCode = response.statusCode;
        allStatus[i].responseDelay = response.elapsedTime.toString() + 'ms';
        break;
      }
    }
  });
  return res;
}

exports.getConnections = function(target){
  return '122';
}