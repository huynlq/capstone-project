// DOM Ready =============================================================

$(document).ready(function() {
  if($('#txtEventIdEdit').val() == '' || $('#txtEventIdEdit').val() == 'undefine' || $('#txtEventIdEdit').val() == null || $('#txtEventIdEdit').val() == undefined) {
    $('#txtEventId').val(readCookie('eventId'));  
  } else {
    $('#txtEventId').val($('#txtEventIdEdit').val());
  }
  

  initiateSchedule();
  $(":input").inputmask();

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

});             

// Functions =============================================================

function initiateSchedule() {
  $.getJSON( '/events/details/' + $('#txtEventId').val(), function( data ) {
    var retrievedObject = data;
    var date = retrievedObject.eventDate;
    var dates = date.split(" - ");
    var date1 = new Date(dates[0]);
    var date2 = new Date(dates[1]);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; 
    var dateString = "";
    var currentDate;
    document.getElementById("txtNumberOfDates").value = diffDays;
    var content = "";
    var content1 = "";
    var content2 = "";
    for (var i = 1; i <= diffDays; i++) {
      currentDate = addDays(date1, i-1);
      dateString = currentDate.getDate() + '/' + currentDate.getMonth() + '/' + currentDate.getFullYear();
      content += '<option>' + i + ' (' + dateString + ')</option>';

      content1 = '<li id="tab-day-' + i + '"><a data-toggle="tab" href="#day' + i + '">Day ' + i + '</a></li>';
      content2 = '<div id="day' + i + '" class="tab-pane fade"><h3 class="title-style-2">Day ' + i + ' (' + dateString + ')<span class="title-under"></span></h3><p>'
                  + '<div class="row clearfix">'
                    + '<div class="col-md-12 column">'
                      + '<table id="table-day-' + i + '" class="table table-style-1 table-bordered table-hover dt-responsive">'
                        + '<thead>'
                          + '<tr >'
                            + '<th class="text-center">Time</th>'
                            + '<th class="text-center">Place</th>'
                            + '<th class="text-center">Activity</th>'
                            + '<th class="text-center">Note</th>'
                            + '<th class="text-center">Action</th>'
                          + '</tr>'
                        + '</thead>'
                        + '<tbody id="body-day' + i + '">'  
                        + '</tbody>'
                      + '</table>'
                    + '</div>'
                  + '</div>'
                  // + '<div id="day' + i + '_addActivity"><a id="add_row' + i + '" class="btn btn-default pull-left" onclick="addActivity(' + i + '), 2">Add Row</a></div>'
                  + '</p></div>';

        $("#activityDates").html($("#activityDates").html() + content1);
        $("#activityContents").html($("#activityContents").html() + content2);        
    }
    $('#txtActivityDate').html(content);
    $("#tab-day-1").addClass("active");
    $("#day1").addClass("active in");
    $('#tab-day-1').click();

    for (var i = 1; i <= diffDays; i++) {
      $('#table-day-' + i).DataTable({
          "order": [[ 0, "asc" ]]
        }); 
    }

    $.getJSON( '/events/activities/' + $('#txtEventId').val(), function( activityData ) {
      if(activityData == '') {
        activityData = JSON.parse(localStorage.getItem('activityItem'));
        if(activityData == '') {
          //ABSOLUTELY NOTHING
        } else {
          for (var i = 0; i < activityData.length; i++) {
            if(activityData[i].day <= diffDays) {
              addingActivity(activityData[i]);
            }          
          }          
        }
      } else {
        for (var i = 0; i < activityData.length; i++) {
          if(activityData[i].day <= diffDays) {
            addingActivity(activityData[i]);
          }          
        }
      }
    });
  });  
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function addActivity() {
    var day = $('#txtActivityDate').val().split(' ')[0];
    var time = $('#txtActivityTime').val();
    var place = $('#txtActivityPlace').val();
    var activity = $('#txtActivity').val();
    var note = $('#txtActivityNote').val();

    $('#table-day-' + day).DataTable().row.add( [
            time,
            place,
            activity,
            note,
            '<center><a class="btn btn-danger" onclick="deleteActivity(' + day + ', this)"><i class="fa fa-remove"></i></a></center>'
        ] ).draw( false );

    $('#txtActivityTime').val('');
    $('#txtActivityPlace').val('');
    $('#txtActivity').val('');
    $('#txtActivityNote').val('');
}

function addingActivity(obj) {
    var day = obj.day;
    var time = obj.time;
    var place = obj.place;
    var activity = obj.activity;
    var note = obj.note;

    $('#table-day-' + day).DataTable().row.add( [
            time,
            place,
            activity,
            note,
            '<center><a class="btn btn-danger" onclick="deleteActivity(' + day + ', this)"><i class="fa fa-remove"></i></a></center>'
        ] ).draw( false );

    $('#txtActivityTime').val('');
    $('#txtActivityPlace').val('');
    $('#txtActivity').val('');
    $('#txtActivityNote').val('');
}

function deleteActivity(day, that) {
  $('#table-day-' + day).DataTable()
            .row( $(that).parents('tr') )
            .remove()
            .draw();
}

function goNext() {
  var eventId = readCookie("eventId");
  if(eventId != '') {
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
          note:       oTable.fnGetData()[j][3]
        }
        schedule.push(activity);
      } 
    }
    localStorage.setItem("activityItem", JSON.stringify(schedule));          

    var rootURL = window.location.origin?window.location.origin+'/':window.location.protocol+'/'+window.location.host+'/';

    window.location = rootURL + "events/creator_preview";  
  } else {
    alert('Something goes horribly wrong, please restart the event creator process.')
  }  
}  