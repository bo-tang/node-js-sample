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
  console.log(targets)
  fs.writeFile("assets/targets.json", JSON.stringify(targets), 'utf8', function(err){
    if (err){
      console.log('Error writing file: ' + targetsFilePath + '\n' + err);
      throw err;
    }
  });
  fs.readFile("assets/targets.json", 'utf8', function(err, data){
    if (err){
      console.log('Error reading file: ' + targetsFilePath + '\n' + err);
      throw err;
    } else {
      res = JSON.parse(data); //now it an object
    }
  });
  return res;
}