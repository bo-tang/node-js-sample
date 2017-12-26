/**
* This is a script of functions used in the dashboard page
*
* Author: Bo Tang
*/

/////////////////////////// Event Listners /////////////////////////
$(document).ready(function() {
  // refresh the data every 5 seconds
  setInterval(reloadData, 5000);

  $("#btn-reload-targets").on("click", function(){
    $.ajax({
      type: "GET",
      url: "/target/all",
      dataType: "json",
      success: function(targets){
        // console.log(targets)
        $("#ta-targetsjson").val(JSON.stringify(targets, null, 4))
      }
    })
  })

  $("#btn-save-targets").on("click", function(){
    $.ajax({
      type: "POST",
      url: "/target/all",
      data: {"targets":JSON.parse($("#ta-targetsjson").val())},
      dataType: "json",
      success: function(targets){
        // console.log(targets)
        $("#ta-targetsjson").val(JSON.stringify(targets, null, 4))
      }
    })
  })

  $(".btn_manual_cmd").on("click", function(){
    var id = $(this).prop("id").split("-")[1];
    var name = $(this).prop("name");
    $.ajax({
      type: "GET",
      url: "/target/" + id + "/manualcmd",
      dataType: "json",
      success: function(manualcmd){
        // console.log(target)
        // activate tab if exist, otherwise create a new one
        if($('#tab-' + id).index() === -1){
          // create a new tab and its pane at the end of the tab list
          $('#tabs_hub').append('<li class="nav-item"><button type="button" class="close">&times;</button>'
            + '<a class="nav-link" id="tab-' + id + '" data-toggle="tab" href="#tabpane-' + id + '" role="tab" '
            + 'aria-controls="tabpane-' + id + '" aria-selected="false">' + name + '</a></li>');
          $('#tabs_content').append(
            '<div class="tab-pane" id="tabpane-' + id + '" role="tabpanel" aria-labelledby="tab-' + id + '">'
            + '<textarea id="ta-manualcmd-' + id + '" class="form-control col-xs-12">' + JSON.stringify(manualcmd, null, 4)
            + '</textarea><button id="btn-execute-manualcmd-' + id + '" type="button" class="btn btn-primary">Save &amp; Execute</button>'
            + '<button id="btn-reload-manualcmd-' + id + '" type="button" class="btn btn-outline-primary">Reload</button></div>');
        }
        $('#tab-' + id).tab('show');

        // add button event listeners
        $('#btn-reload-manualcmd-' + id).on("click", function(){
          $.ajax({
            type: "GET",
            url: "/target/" + id + "/manualcmd",
            dataType: "json",
            success: function(manualcmd){
              console.log(manualcmd)
              $("#ta-manualcmd-" + id).val(JSON.stringify(manualcmd, null, 4))
            }
          })
        })
      }
    })
  })



  $("#tabs_hub").on("click", ".close", function(){
    // remove the tab and its associated tabpanel
    var tabpane_id = $(this).parent("li").find("a").attr('href');
    var tab_index = $(this).parent("li").index();
    var tab_length = $('#tabs_hub li').length;
    // console.log(tabpane_id + " " + tab_index + " " + tab_length)
    if(tab_index == (tab_length - 1)){
      // show prev tab
      var showtab = $(this).parent("li").prev().find("a");
      // console.log(showtab.attr("id"));
      showtab.tab("show");
      // $(showtab.attr('href')).addClass("active");
    } else {
      // show next tab
      var showtab = $(this).parent("li").next().find("a");
      // console.log(showtab.text());
      showtab.tab("show");
      // $(showtab.attr('href')).addClass("active");
    }
    $(this).parent("li").remove();
    $(tabpane_id).remove();
  })

});

/////////////////////////// Useful Functions /////////////////////////

function reloadData(){
  $.ajax({
    type: "GET",
    url: "/status/all",
    dataType: "json",
    success: function(all_status){
      for(i = 0; i < all_status.length; i++){
        // console.log(all_status[i]);
        for(j = 0; j < Object.keys(all_status[i]).length; j++){
          var targetId = all_status[i].id;
          var attrName = Object.keys(all_status[i])[j];
          if(attrName == "id" || attrName == "name") continue;
          var attrVal = all_status[i][attrName];
          // update the value and style of the metric
          $("#text-" + targetId + "-" + attrName)
            .html(attrVal)
            .css(colorMetricValue(all_status[i], attrName, attrVal));
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