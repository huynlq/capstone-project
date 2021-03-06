// DOM Ready =============================================================

$(document).ready(function() {
  $('#eventId').html(readCookie('eventId'));

  initiateSchedule();
  initiateDonation();

  var diffDays = document.getElementById("txtNumberOfDates").value;
  var table;
  for (var i = 1; i <= diffDays; i++) {
      console.log(i);
      table = $('#table-day-' + i).DataTable({
        "responsive": true,
        "aaSorting": [[0,'asc']],
        "aoColumnDefs": [
          { 'bSortable': false, 'aTargets': [ 0, 1, 2, 3, 4 ] }
       ]
      });

      console.log("SUCCESS");
      $('#table-day-' + i + ' .edit-button').click(function () {
          var data = $('#table-day-' + i).DataTable().row( $(this).parents('tr') ).data();
          console.log("data");
          alert( data );
      });      
  }

  var dialog = $( "#edit-activity-form" ).dialog({
      autoOpen: false,
      modal: true,
      resizable: false,
      width: 500,
      height: 300,
      buttons: {
        "OK" : {
          text: "OK",
          id: "saveEditActivity",
          click: function(){}
        },
        "Cancel" : {
          text: "Cancel",
          click: function() {
            dialog.dialog( "close" );
          }
        }
      }                
    });  

});             

// Functions =============================================================

function remove(day) {

         
  
}

function editActivity(day, num) {
  $( "#saveEditActivity").unbind( "click" );
  $("#saveEditActivity").click(function() {
    saveEditActivity(day, num);
  });  
  $("#txtEditActivityTime")[0].value = $("#txtDay" + day + "-Time" + num)[0].innerHTML;
  
  $("#txtEditActivityPlace")[0].value = $("#txtDay" + day + "-Place" + num)[0].innerHTML;
  $("#txtEditActivityActivity")[0].value = $("#txtDay" + day + "-Activity" + num)[0].innerHTML;
  $("#txtEditActivityBudget")[0].value = $("#txtDay" + day + "-EstBudget" + num)[0].innerHTML;
  
  //document.getElementById('cancelEditActivity').onclick = closeDialog;               
  $("#edit-activity-form").dialog( "open" );              
}

function closeDialog(){
  $( "#edit-activity-form" ).dialog( "close" )
}

function saveEditActivity(data, that) {
  $('#table-day-' + day).DataTable().row(that).data(data);

  $("#txtDay" + day + "-Time" + num)[0].innerHTML = $("#txtEditActivityTime")[0].value;
  console.log("Parameter: " + "#txtDay" + day + "-Time" + num);
  console.log("Value: " + $("#txtDay" + day + "-Time" + num)[0].innerHTML);
  $("#txtDay" + day + "-Place" + num)[0].innerHTML = $("#txtEditActivityPlace")[0].value;
  $("#txtDay" + day + "-Activity" + num)[0].innerHTML = $("#txtEditActivityActivity")[0].value;
  $("#txtDay" + day + "-EstBudget" + num)[0].innerHTML = $("#txtEditActivityBudget")[0].value;
  $( "#edit-activity-form" ).dialog("close");
}

function initiateSchedule() {
  $.getJSON( '/events/details/' + $('#eventId').html(), function( data ) {
    var retrievedObject = data;
    var date = retrievedObject.eventDate;
    var dates = date.split(" - ");
    var date1 = new Date(dates[0]);
    var date2 = new Date(dates[1]);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; 
    document.getElementById("txtNumberOfDates").value = diffDays;
    var content1 = "";
    var content2 = "";
    for (var i = 1; i <= diffDays; i++) {
      content1 += '<li id="tab-day-' + i + '"><a data-toggle="tab" href="#day' + i + '">Day ' + i + '</a></li>';
      content2 += '<div id="day' + i + '" class="tab-pane fade"><h3>Day ' + i + '</h3><p>'
                  + '<div class="row clearfix">'
                    + '<div class="col-md-12 column">'
                      + '<table id="table-day-' + i + '" class="table table-bordered table-hover dt-responsive">'
                        + '<thead>'
                          + '<tr >'
                            + '<th class="text-center">Time</th>'
                            + '<th class="text-center">Place</th>'
                            + '<th class="text-center">Activity</th>'
                            + '<th class="text-center">Estimated Budget</th>'
                            + '<th class="text-center">Action</th>'
                          + '</tr>'
                        + '</thead>'
                        + '<tbody id="body-day' + i + '">'  
                        + '</tbody>'  
                        + '<tfoot id="body-add-day' + i + '">'    
                        + '<tr id="addr' + i + '">'
                            + '<td><input type="text" id="txtDay' + i + '-AddTime"  placeholder="Time" class="form-control"/></td>'
                            + '<td><input type="text" id="txtDay' + i + '-AddPlace" placeholder="Place" class="form-control"/></td>'
                            + '<td><input type="text" id="txtDay' + i + '-AddActivity" placeholder="Activity" class="form-control"/></td>'
                            + '<td><input type="text" id="txtDay' + i + '-AddEstBudget" placeholder="Estimated Budget" class="form-control"/></td>'
                            + '<td id="day' + i + '_addActivity"><a id="add_row' + i + '" class="btn btn-default glyphicon glyphicon-plus" onclick="addActivity(' + i + ')"></a></td>'
                          + '</tr>'                          
                        + '</tfoot>'
                      + '</table>'
                      
                    + '</div>'
                  + '</div>'
                  // + '<div id="day' + i + '_addActivity"><a id="add_row' + i + '" class="btn btn-default pull-left" onclick="addActivity(' + i + '), 2">Add Row</a></div>'
                  + '</p></div>';
    }
    document.getElementById("activityDates").innerHTML = content1;
    document.getElementById("activityContents").innerHTML = content2;


    $("#tab-day-1").addClass("active");
    $("#day1").addClass("active in");
    $('#tab-day-1').click();
  });  
}


function editActivity2(day, that) {
  var table = $('#table-day-' + day).DataTable();
  var data = $('#table-day-' + day).DataTable().row( $(that).parents('tr') ).data();
  console.log("Before: " + data);
  $("#saveEditActivity").unbind( "click" );
  $("#saveEditActivity").click(function() {
    var dataObj = {
      "0": $("#txtEditActivityTime")[0].value,
      "1": $("#txtEditActivityPlace")[0].value,
      "2": $("#txtEditActivityActivity")[0].value,
      "3": $("#txtEditActivityBudget")[0].value,
      "4": data[4]
    }
    data[0] = $("#txtEditActivityTime")[0].value;
    data[1] = $("#txtEditActivityPlace")[0].value;
    data[2] = $("#txtEditActivityActivity")[0].value;
    data[3] = $("#txtEditActivityBudget")[0].value;
    console.log("Modified Data: " + dataObj);
    $('#table-day-' + day).DataTable().row($(that).parents('tr')).data(dataObj);
    console.log("Closing");
    $("#edit-activity-form").dialog( "close" );            
  });  
  $("#txtEditActivityTime")[0].value = data[0];          
  $("#txtEditActivityPlace  ")[0].value = data[1];
  $("#txtEditActivityActivity")[0].value = data[2];
  $("#txtEditActivityBudget")[0].value = data[3];
  
  //document.getElementById('cancelEditActivity').onclick = closeDialog;               
  $("#edit-activity-form").dialog( "open" );
}


function addActivity(day) {
  var day1 = '<a id="edit_day' + day + '" class="btn btn-default glyphicon glyphicon-edit edit-button" onclick="editActivity2(' + day + ', this)"></a><a id="remove-day-' + day + '" class="btn btn-default glyphicon glyphicon-remove remove-button" onclick="var row = $(this).closest(\'tr\');var nRow = row[0];$(\'#table-day-' + day + '\').dataTable().fnDeleteRow(nRow);"></a>';
  var addedRow = $('#table-day-' + day).DataTable().row.add( [
    document.getElementById("txtDay" + day + "-AddTime").value,
    document.getElementById("txtDay" + day + "-AddPlace").value,
    document.getElementById("txtDay" + day + "-AddActivity").value,
    document.getElementById("txtDay" + day + "-AddEstBudget").value,
    day1
] ).draw( false );

  document.getElementById("body-add-day" + day).innerHTML = 
    '<tr id="addr' + day + '">' + 
    '<td><input type="text" id="txtDay' + day + '-AddTime"  placeholder="Time" class="form-control"/></td>' +
    '<td><input type="text" id="txtDay' + day + '-AddPlace" placeholder="Place" class="form-control"/></td>' +
    '<td><input type="text" id="txtDay' + day + '-AddActivity" placeholder="Activity" class="form-control"/></td>' +
    '<td><input type="text" id="txtDay' + day + '-AddEstBudget" placeholder="Estimated Budget" class="form-control"/></td>' +
    '<td id="day' + day + '_addActivity"><a id="add_row' + day + '" class="btn btn-default glyphicon glyphicon-plus" onclick="addActivity(' + day + ')"></a></td>' +
    '</tr>';
}

function removeActivity(day, num) {
  var element = document.getElementById('addr' + day + '-' + num);
  element.outerHTML = '';
}

function initiateDonation() {
  var content1 = "";
  var content2 = "";
  
    content1 += '<div class="row clearfix">'
                  + '<div class="col-md-12 column">'
                    + '<table class="table table-bordered table-hover" id="tab_logic">'
                      + '<tbody id="donation-body">'
                        + '<tr id="donation-row-1">'
                          + '<td><input type="text" id="donation-item-1"  placeholder="Donation Item" class="form-control"/></td>'
                          + '<td><input type="text" id="donation-number-1" placeholder="Number Required" class="form-control"/></td>'
                          + '<td><input type="text" id="donation-unit-1" placeholder="Unit" class="form-control"/></td>'
                          + '<td><input type="text" id="donation-minimum-1" placeholder="Sponsor Minimum" class="form-control"/></td>'
                          + '<td id="add-donation"><a id="add-donation-button" class="btn btn-default glyphicon glyphicon-plus" onclick="addOtherDonation(1)"></a></td>'
                        + '</tr>'
                        + '<tr id="donation-row-2"></tr>'
                      + '</tbody>'
                    + '</table>'
                  + '</div>'
                + '</div>';
  
  document.getElementById("otherDonationContents").innerHTML = content1;
}

function addOtherDonation(i) {
  var item = document.getElementById('donation-item-' + i).value;
  var num = document.getElementById('donation-number-' + i).value;
  var unit = document.getElementById('donation-unit-' + i).value;
  var min = document.getElementById('donation-minimum-' + i).value;
  var content1 = 
      '<td id="donation-item-' + i + '">' + 
        item +         
      '</td>' +
      '<td id="donation-number-' + i + '">' + 
        num +         
      '</td>' +
      '<td id="donation-unit-' + i + '">' + 
        unit +         
      '</td>' +
      '<td id="donation-minimum-' + i + '">' + 
        min +         
      '</td>' +
      '<td>' +
        '<input type="hidden" name="otherDonationItem" value="' + item + '" />' +
        '<input type="hidden" name="otherDonationNumber" value="' + num + '" />' +
        '<input type="hidden" name="otherDonationUnit" value="' + num + '" />' +
        '<input type="hidden" name="otherDonationMinimum" value="' + num + '" />' +
        '<a class="btn btn-default glyphicon glyphicon-remove" onclick="removeOtherDonation(' + i +')"></a>' + 
      '</td>';
  document.getElementById("donation-row-" + i).innerHTML = content1;
  console.log(num);

  var content2 = 
    '<td><input type="text" id="donation-item-' + (i + 1) + '"  placeholder="Donation Item" class="form-control"/></td>'
    + '<td><input type="text" id="donation-number-' + (i + 1) + '" placeholder="Number Required" class="form-control"/></td>'
    + '<td><input type="text" id="donation-unit-' + (i + 1) + '" placeholder="Unit" class="form-control"/></td>'
    + '<td><input type="text" id="donation-minimum-' + (i + 1) + '" placeholder="Sponsor Minimum" class="form-control"/></td>'
    + '<td id="add-donation"><a id="add-donation-button" class="btn btn-default glyphicon glyphicon-plus" onclick="addOtherDonation(' + (parseInt(i) + 1) + ')"></a></td>'
  document.getElementById("donation-row-" + (i + 1)).innerHTML = content2;

  var content3 = '<tr id="donation-row-' + (i + 2) + '"></tr>';
  document.getElementById("donation-body").innerHTML += content3;

  document.getElementById("txtNumberOfDonation").value = i;
}

function removeOtherDonation(i) {
  var element = document.getElementById("donation-row-" + i);
  element.outerHTML = '';
}     

function goNext() {
  var eventId = readCookie("eventId");
  if(eventId != '') {

    // Save Requirement Data
    var content = {
      volunteerMax: $('#txtVolunteersMax').val(),
      volunteerMin: $('#txtVolunteersMin').val(),
      budget: $('#txtBudget').val()
    }
    $.ajax({
        type: 'PUT',
        data: content,
        url: '/events/updateevent/' + eventId,
        dataType: 'JSON'
    }).done(function( response ) {    
      if (response.msg !== '') 
        alert(response.msg);
    });

    // Save Donations Data

    var donateNo = parseInt(document.getElementById("txtNumberOfDonation").value);
    var otherDonationItem = [];
    var otherDonationNumber = [];
    var donations = [];
    for (var i = 0; i < donateNo; i++) {
      if(document.getElementById("donation-row-" + (i + 1)) != null) {
        // otherDonationItem.push(document.getElementById("donation-item-" + (i + 1)).innerHTML);
        // otherDonationNumber.push(document.getElementById("donation-number-" + (i + 1)).innerHTML);              
        donations.push({
          donationItem    : $('#donation-item-' + (i + 1)).html(),
          donationNumber  : $('#donation-number-' + (i + 1)).html(),
          donationUnit    : $('#donation-unit-' + (i + 1)).html(),
          donationMinimum : $('#donation-minimum-' + (i + 1)).html()
        });
      }
    }
    localStorage.setItem("donationItem", JSON.stringify(donations));


    // Save Activities Data

    var schedule = [];
    var activity = new Object();
    var diffDays = document.getElementById("txtNumberOfDates").value;
    for (var i = 1; i <= diffDays; i++) {
      var oTable = $('#table-day-' + i).dataTable();
      oTable.fnGetData();
      for (var j = 0; j < oTable.fnGetData().length; j++) {
        activity = {
          day:        i,
          time:       oTable.fnGetData()[j][0],
          place:      oTable.fnGetData()[j][1],
          activity:   oTable.fnGetData()[j][2],
          estBudget:  oTable.fnGetData()[j][3]
        }
        schedule.push(activity);
      } 
    }
    localStorage.setItem("activityItem", JSON.stringify(schedule));          

    window.location = "creator_preview";  
  } else {
    alert('Something goes horribly wrong, please restart the event creator process.')
  }  
}  