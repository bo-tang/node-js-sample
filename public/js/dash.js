/**
* This is a script of functions used in the dashboard page
*
* Author: Bo Tang
*/

/////////////////////////// Event Listners /////////////////////////
$(document).ready(function() {
  $("#button-reload_targets").on("click", function(){
    $.ajax({
      type: "GET",
      url: "/targets",
      dataType: "json",
      success: function(targets){
        console.log(targets)
        $("#textarea_targetsjson").val(JSON.stringify(targets, null, 4))
      }
    })
  })

  $("#button-save_targets").on("click", function(){
    $.ajax({
      type: "POST",
      url: "/targets",
      data: {"targets":JSON.parse($("#textarea_targetsjson").val())},
      dataType: "json",
      success: function(targets){
        console.log(targets)
        $("#textarea_targetsjson").val(JSON.stringify(targets, null, 4))
      }
    })
  })
});

/////////////////////////// Useful Functions /////////////////////////

function reloadData(){
  $.ajax({
    type: "GET",
    url: "/all",
    dataType: "json",
    success: function(all_status){
      for(i = 0; i < all_status.length; i++){
        // console.log(all_status[i]);
        for(j = 0; j < Object.keys(all_status[i]).length; j++){
          var targetId = all_status[i].id;
          var attrName = Object.keys(all_status[i])[j];
          if(attrName == "id" || attrName == "name") continue;
          var attrVal = all_status[i][attrName];
          var style = colorMetricValue(all_status[i], attrName, attrVal);
          // update the value and style of the metric
          $("#text-" + targetId + "-" + attrName)
            .html(all_status[i][attrName])
            .css(style);
        }
      }
    }
  });
}

/**
* return color style of the given metric name and value
* @param Object status stores the entire status object including the warning and error threshold map
* @param String attrName
* @param String attrVal
* @return Object style to be changed on text elements
*/
function colorMetricValue(status, attrName, attrVal){
  var style = {"color":"green","font-size":"16px","font-weight":"normal"};
  if(!attrName || !attrVal
    || typeof status.metricWarningThresMap[attrName] === "undefined"
    || typeof status.metricErrorThresMap[attrName] === "undefined"){
    return style;
  }
  // color internal error
  if(attrVal.indexOf("Error") !== -1){
    return {"color":"red","font-size":"20px","font-weight":"bold"};
  }
  // color metric value numbers
  var numAttrVal = 0;
  // console.log(targetId + " " + attrName + " " + attrVal);
  // check if the attribute value is above thresholds
  switch(attrName){
    case "cpu":
      numAttrVal = Number(attrVal.replace("%", ""));
      break;
    case "memory":
      var start = attrVal.indexOf("(") + 1;
      var end = attrVal.indexOf(")") - 1;
      numAttrVal = Number(attrVal.substr(start, end - start));
      break;
    case "disk":
      var start = attrVal.indexOf("(") + 1;
      var end = attrVal.indexOf(")") - 1;
      numAttrVal = Number(attrVal.substr(start, end - start));
      break;
    case "response_delay":
      numAttrVal = Number(attrVal.split(" ")[0]);
      break;
    case "http_statuscode":
      numAttrVal = Number(attrVal);
      break;
    case "apache_traffic":
      numAttrVal = Number(attrVal.split(" ")[0]);
      break;
    case "apache_load":
      numAttrVal = Number(attrVal);
      break;
    case "mysql_load":
      numAttrVal = Number(attrVal);
      break;
    default:
      numAttrVal = Number(attrVal);
  }
  if(numAttrVal > Number(status.metricWarningThresMap[attrName])){
    style = {"color":"orange","font-size":"18px","font-weight":"bold"};
  }
  if(numAttrVal > Number(status.metricErrorThresMap[attrName])){
    style = {"color":"red","font-size":"20px","font-weight":"bold"};
  }
  return style;
}