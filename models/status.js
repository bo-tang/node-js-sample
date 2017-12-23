// BASIC SETUP
// ================================================
const fs = require('fs');
const sshClient = require('ssh2').Client;
const request = require('request');
const os = require('os');

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
    "metricWarningThresMap": rawTargets[i].metricWarningThresMap,
    "metricErrorThresMap": rawTargets[i].metricErrorThresMap,
  };
  // for(var j = 0; j < rawTargets[i].metrics.length; j++){
  //   target[rawTargets[i].metrics[j]] = "";
  // }
  allStatus.push(target);
}
// cache last record of rps data
var lastRPSData = {};
// initialize lastRPSData
for(var i = 0; i < rawTargets.length; i++){
  lastRPSData[rawTargets[i].id] = "";
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
  var tl = rawTargets;
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
    case "response_delay":
      res = exports.getHttpResponse(target).response_delay;
      break;
    case "http_statuscode":
      res = exports.getHttpResponse(target).http_statuscode;
      break;
    case "apache_traffic":
      res = exports.getApacheTraffic(target);
      break;
    case "apache_load":
      res = exports.getApacheLoad(target);
      break;
    case "mysql_load":
      res = exports.getMysqlLoad(target);
      break;
    default:
  }
  return res;
}

///////////////////////// IMPLEMENTATIONS OF METRICS RETRIEVAL /////////////////////////////////////

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
    conn.exec('top -bn1 | grep "Cpu(s)" | cut -d " " -f2 | awk \'{print $0 "%"}\'', function(err, stream) {
      if (err) throw err;
      stream.on('close', function(code, signal) {
        // console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
      }).on('data', function(data) {
        // console.log('STDOUT: ' + data);
        for(var i = 0; i < allStatus.length; i++){
          if(allStatus[i].id == target.id && target.metrics.indexOf("cpu") !== -1){
            allStatus[i].cpu = data.toString();
            break;
          }
        }
      }).stderr.on('data', function(data) {
        // console.log('STDERR: ' + data);
        for(var i = 0; i < allStatus.length; i++){
          if(allStatus[i].id == target.id && target.metrics.indexOf("mysql_load") !== -1){
            allStatus[i].mysql_load = "Internal Error";
            break;
          }
        }
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
    conn.exec('free -h | awk \'NR==2{printf "%s/%s (%.2f%%)", $3,$2,$3*100/$2 }\'', function(err, stream) {
      if (err) throw err;
      stream.on('close', function(code, signal) {
        // console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
      }).on('data', function(data) {
        // console.log('STDOUT: ' + data);
        for(var i = 0; i < allStatus.length; i++){
          if(allStatus[i].id == target.id && target.metrics.indexOf("memory") !== -1){
            allStatus[i].memory = data.toString();
            break;
          }
        }
      }).stderr.on('data', function(data) {
        // console.log('STDERR: ' + data);
        for(var i = 0; i < allStatus.length; i++){
          if(allStatus[i].id == target.id && target.metrics.indexOf("mysql_load") !== -1){
            allStatus[i].mysql_load = "Internal Error";
            break;
          }
        }
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
    conn.exec('df -h | awk \'$NF=="/"{printf "%s/%s (%s)", $3,$2,$5}\'', function(err, stream) {
      if (err) throw err;
      stream.on('close', function(code, signal) {
        // console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
      }).on('data', function(data) {
        // console.log('STDOUT: ' + data);
        for(var i = 0; i < allStatus.length; i++){
          if(allStatus[i].id == target.id && target.metrics.indexOf("disk") !== -1){
            allStatus[i].disk = data.toString();
            break;
          }
        }
      }).stderr.on('data', function(data) {
        // console.log('STDERR: ' + data);
        for(var i = 0; i < allStatus.length; i++){
          if(allStatus[i].id == target.id && target.metrics.indexOf("mysql_load") !== -1){
            allStatus[i].mysql_load = "Internal Error";
            break;
          }
        }
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
      res.http_statuscode = allStatus[i].http_statuscode;
      res.response_delay = allStatus[i].response_delay;
      break;
    }
  }
  // update in allStatus
  request({url: target.url, time : true}, function(error, response, body) {
    for(var i = 0; i < allStatus.length; i++){
      if(allStatus[i].id == target.id){
        if(target.metrics.indexOf("http_statuscode") !== -1 && typeof response.statusCode !== "undefined"){
          allStatus[i].http_statuscode = response.statusCode.toString();
        }
        if(target.metrics.indexOf("response_delay") !== -1 && typeof response.elapsedTime !== "undefined"){
          allStatus[i].response_delay = response.elapsedTime.toString() + ' ms';
        }
        break;
      }
    }
  });
  return res;
}

exports.getApacheTraffic = function(target){
  var res = "";
  for(var i = 0; i < allStatus.length; i++){
    if(allStatus[i].id == target.id){
      res = allStatus[i].apache_traffic;
      break;
    }
  }
  var conn = new sshClient();
  conn.on('ready', function() {
    // console.log('Client :: ready');
    // get apache request per second by counting access.log line changes (d1, d2)
    // get apache load by counting apache processes (d3)
    conn.exec('echo | awk -v d1=$(sed -n \'$=\' ' + target.log_path + ') -v d2=$(date +%s) \'{print d1 " " d2}\'', function(err, stream) {
      if (err) throw err;
      stream.on('close', function(code, signal) {
        // console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
      }).on('data', function(data) {
        // console.log('STDOUT: ' + data);
        var rps = 0;
        // calculate request per second
        if(lastRPSData[target.id] === ""){
          lastRPSData[target.id] = data.toString().replace(os.EOL, '');
        } else {
          var last = lastRPSData[target.id].split(" ");
          var curr = data.toString().split(" ");
          if(Number(curr[0]) >= Number(last[0]) && (Number(curr[1]) > Number(last[1]))){
            rps = (Number(curr[0]) - Number(last[0])) / (Number(curr[1]) - Number(last[1]));
            lastRPSData[target.id] = data.toString().replace(os.EOL, '');
          }
        }
        for(var i = 0; i < allStatus.length; i++){
          if(allStatus[i].id == target.id && target.metrics.indexOf("apache_traffic") !== -1){
            allStatus[i].apache_traffic = rps.toFixed(2) + ' req/s';
            break;
          }
        }
      }).stderr.on('data', function(data) {
        // console.log('STDERR: ' + data);
        for(var i = 0; i < allStatus.length; i++){
          if(allStatus[i].id == target.id && target.metrics.indexOf("mysql_load") !== -1){
            allStatus[i].mysql_load = "Internal Error";
            break;
          }
        }
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

exports.getApacheLoad = function(target){
  var res = "";
  for(var i = 0; i < allStatus.length; i++){
    if(allStatus[i].id == target.id){
      res = allStatus[i].apache_load;
      break;
    }
  }
  var conn = new sshClient();
  conn.on('ready', function() {
    // console.log('Client :: ready');
    // get apache request per second by counting access.log line changes (d1, d2)
    // get apache load by counting apache processes (d3)
    conn.exec('ps aux | grep apache2 | wc -l', function(err, stream) {
      if (err) throw err;
      stream.on('close', function(code, signal) {
        // console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
      }).on('data', function(data) {
        // console.log('STDOUT: ' + data);
        for(var i = 0; i < allStatus.length; i++){
          if(allStatus[i].id == target.id && target.metrics.indexOf("apache_load") !== -1){
            allStatus[i].apache_load = data.toString().replace(os.EOL, '');
            break;
          }
        }
      }).stderr.on('data', function(data) {
        // console.log('STDERR: ' + data);
        for(var i = 0; i < allStatus.length; i++){
          if(allStatus[i].id == target.id && target.metrics.indexOf("mysql_load") !== -1){
            allStatus[i].mysql_load = "Internal Error";
            break;
          }
        }
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

exports.getMysqlLoad = function(target){
  var res = "";
  for(var i = 0; i < allStatus.length; i++){
    if(allStatus[i].id == target.id){
      res = allStatus[i].mysql_load;
      break;
    }
  }
  var conn = new sshClient();
  conn.on('ready', function() {
    // console.log('Client :: ready');
    conn.exec('mysqladmin status ' + target.mysql_cred + '| cut -d " " -f5', function(err, stream) {
      if (err) throw err;
      stream.on('close', function(code, signal) {
        // console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
      }).on('data', function(data) {
        // console.log('STDOUT: ' + data);
        for(var i = 0; i < allStatus.length; i++){
          if(allStatus[i].id == target.id && target.metrics.indexOf("mysql_load") !== -1){
            allStatus[i].mysql_load = data.toString();
            break;
          }
        }
      }).stderr.on('data', function(data) {
        console.log('STDERR: ' + data);
        for(var i = 0; i < allStatus.length; i++){
          if(allStatus[i].id == target.id && target.metrics.indexOf("mysql_load") !== -1){
            allStatus[i].mysql_load = "Internal Error";
            break;
          }
        }
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