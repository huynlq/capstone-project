// DOM Ready =============================================================

$(document).ready(function() {
  populateLanguage();
  if($('#txtEventIdEdit').val() == '' || $('#txtEventIdEdit').val() == 'undefine' || $('#txtEventIdEdit').val() == null || $('#txtEventIdEdit').val() == undefined) {
    $('#txtEventId').val(readCookie('eventId'));  
  } else {
    $('#txtEventId').val($('#txtEventIdEdit').val());
  }
  

  initiateSchedule();
  validateMap();
  $(":input").inputmask();

  var diffDays = document.getElementById("txtNumberOfDates").value;
  var table;
  for (var i = 1; i <= diffDays; i++) {
      table = $('#table-day-' + i).DataTable({
        "responsive": true,
        "aaSorting": [[0,'asc']],
        "aoColumnDefs": [
          { 'bSortable': false, 'aTargets': [ 0, 1, 2, 3, 4 ] }
       ]
      });

      $('#table-day-' + i + ' .edit-button').click(function () {
          var data = $('#table-day-' + i).DataTable().row( $(this).parents('tr') ).data();
          console.log("data");
          alert( data );
      });      
  }

});             

// Functions =============================================================

function initialize() {
    var defaultLat = 16.07565;
    var defaultLng = 108.16980899999999;
    if($('#txtMeetingAddressLat').val() != '') {
      defaultLat = $('#txtActivityLat').val();
      defaultLng = $('#txtActivityLng').val();
    }
    console.log('lat: ' + defaultLat);
    var mapOptions = {
        zoom: 17,
        center: new google.maps.LatLng(defaultLat, defaultLng),
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,              
    };            
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);            
    var input = document.getElementById('txtActivityPlace');
    var autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
        var lat = place.geometry.location.lat();
        var lng = place.geometry.location.lng();
        document.getElementById('txtActivityLat').value = lat;
        document.getElementById('txtActivityLng').value = lng;
        var marker = new google.maps.Marker({position: new google.maps.LatLng(lat, lng)});
        marker.setMap(map);
        var panPoint = new google.maps.LatLng(lat, lng);
        map.panTo(panPoint);
    });
}

function validateMap() {
  $.getJSON( '/events/activities/' + $('#txtEventId').val(), function( activityData ) {
    var mapFlag = true;
    for(var i = 0; i < activityData.length; i++) {
      if(activityData[i].latitude == undefined || activityData[i].latitude == 'undefined' || activityData[i].latitude == "") {
        mapFlag = false;
      }   
    }
    if(mapFlag == true) {
      google.maps.event.addDomListener(window, 'load', initialize);
    } else {
      turnOffMap();
    }
  });
}

function populateLanguage() {
  $('#header').html($EVENTCREATOR_HEADER);
  $('#header-desc').html($EVENTCREATOR_HEADER_DESC);
  $('#header-activity').html($EVENTCREATOR_HEADER_ACTIVITY);

  $('#form-date').html($EVENTCREATOR_ACTFORM_DATE);
  $('#form-time').html($EVENTCREATOR_ACTFORM_TIME);
  $('#form-place').html($EVENTCREATOR_ACTFORM_PLACE);
  $('#form-activity').html($EVENTCREATOR_ACTFORM_ACTIVITY);
  $('#form-note').html($EVENTCREATOR_ACTFORM_NOTE);
  $('#form-add').html($EVENTCREATOR_ACTFORM_ADD);
  $('#formSubmit').html($EVENTCREATOR_CONTINUE);
}

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

      content1 = '<li id="tab-day-' + i + '"><a data-toggle="tab" href="#day' + i + '">' + $EVENTCREATOR_ACTTAB_DAY + ' ' + i + '</a></li>';
      content2 = '<div id="day' + i + '" class="tab-pane fade"><h3 class="title-style-2">' + $EVENTCREATOR_ACTTAB_DAY + ' ' + i + ' (' + dateString + ')<span class="title-under"></span></h3><p>'
                  + '<div class="row clearfix">'
                    + '<div class="col-md-12 column">'
                      + '<table id="table-day-' + i + '" class="table table-style-1 table-bordered table-hover dt-responsive">'
                        + '<thead>'
                          + '<tr >'
                            + '<th class="text-center">' + $EVENTCREATOR_ACTFORM_TIME + '</th>'
                            + '<th class="text-center">' + $EVENTCREATOR_ACTFORM_PLACE + '</th>'
                            + '<th class="text-center">' + $EVENTCREATOR_ACTFORM_ACTIVITY + '</th>'
                            + '<th class="text-center">' + $EVENTCREATOR_ACTFORM_NOTE + '</th>'
                            + '<th class="text-center">' + $EVENTCREATOR_ACTTABLE_ACTION + '</th>'
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
        if(activityData == '' || activityData == null) {
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
    var lat = $('#txtActivityLat').val();
    var lng = $('#txtActivityLng').val();

    $('#table-day-' + day).DataTable().row.add( [
            time,
            place + '<div style="display:none"><p class="lat">' + lat + '</p><p class="lng">' + lng + '</p></div>',
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
    var lat = obj.latitude;
    var lng = obj.longitude;

    $('#table-day-' + day).DataTable().row.add( [
            time,
            place + '<div style="display:none"><p class="lat">' + lat + '</p><p class="lng">' + lng + '</p></div>',
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

function turnOffMap() {
  $('#map').html("");
  $('#map').attr("style","display:none");
  $('#btnTurnOffMap').html("");
  $('#btnTurnOffMap').attr("style","display:none");
  var input = document.getElementById('txtActivityPlace');
  var autocomplete = new google.maps.places.Autocomplete(input);
  google.maps.event.clearInstanceListeners(input);
  google.maps.event.clearInstanceListeners(autocomplete);
}

function goNext() {
  var eventId = readCookie("eventId");
  if(eventId != '') {
    // Save Activities Data

    var schedule = [];
    var activity = new Object();
    var diffDays = document.getElementById("txtNumberOfDates").value;
    var place = "";
    var lat = "";
    var lng = "";
    for (var i = 1; i <= diffDays; i++) {
      var oTable = $('#table-day-' + i).dataTable();
      oTable.fnGetData();
      for (var j = 0; j < oTable.fnGetData().length; j++) {
        activity + '<div style="display:none"><p class="lat">' + lat + '</p><p class="lng">' + lng + '</p></div>';
        place = oTable.fnGetData()[j][1].split('<div style="display:none"><p class="lat">')[0];
        lat = oTable.fnGetData()[j][1].split('<div style="display:none"><p class="lat">')[1].split('</p><p class="lng">')[0];
        lng = oTable.fnGetData()[j][1].split('</p><p class="lng">')[1].split('</p></div>')[0];
        activity = {
          day:        i,
          time:       oTable.fnGetData()[j][0],
          place:      place,
          latitude:   lat,
          longitude:  lng,
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