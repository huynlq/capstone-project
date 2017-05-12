// DOM Ready =============================================================

$(document).ready(function() {
  populateLanguage();
  if($('#txtEventIdEdit').val() == '' || $('#txtEventIdEdit').val() == 'undefine' || $('#txtEventIdEdit').val() == null || $('#txtEventIdEdit').val() == undefined) {
    $('#txtEventId').val(readCookie('eventId'));  
  } else {
    $('#txtEventId').val($('#txtEventIdEdit').val());
  }
  
  initiateDonations();
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
  $('#header-donation').html($EVENTCREATOR_DONATEFORM_HEADER);
  $('#header-activity').html($EVENTCREATOR_ACTFORM_HEADER);

  $('.form-donation-item').html($EVENTCREATOR_DONATEFORM_ITEM);
  $('.form-donation-unit').html($EVENTCREATOR_DONATEFORM_UNIT);
  $('.form-donation-quantity').html($EVENTCREATOR_DONATEFORM_QUANTITY);
  $('.form-donation-minimum').html($EVENTCREATOR_DONATEFORM_MINIMUM);
  $('#formDonationAdd').html($EVENTCREATOR_ACTFORM_ADD);

  $('#form-date').html($EVENTCREATOR_ACTFORM_DATE);
  $('#form-time').html($EVENTCREATOR_ACTFORM_TIME);
  $('#form-place').html($EVENTCREATOR_ACTFORM_PLACE);
  $('#form-activity').html($EVENTCREATOR_ACTFORM_ACTIVITY);
  $('#form-note').html($EVENTCREATOR_ACTFORM_NOTE);
  $('#form-add').html($EVENTCREATOR_ACTFORM_ADD);
  $('#formSubmit').html($EVENTCREATOR_CONTINUE);
}

function initiateDonations() {
  $('#donationTable').DataTable();
  
  // if($('#txtEventIdEdit').val() == '' || $('#txtEventIdEdit').val() == undefined || $('#txtEventIdEdit').val() == 'undefined' || $('#txtEventIdEdit').val() == null || $('#txtEventIdEdit') == 'null') {
    
  // } else {    
  //   $.getJSON( '/events/donationrequire/' + $('#txtEventId').val(), function( data ) {
  //     $.each(data, function(){
  //       $('#donationTable').DataTable().row.add( [
  //               this.item,
  //               this.unit,
  //               '<input type="text" class="form-control donation-quantity" value="' + this.quantity + '" />',
  //               '<input type="text" class="form-control donation-minimum" value="' + this.minimum + '" />',
  //               ' '
  //           ] ).draw( false );
  //     });
  //   });
  // }
  refreshDonationTable();
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
      content += '<option value="' + i + '">' + i + ' (' + dateString + ')</option>';

      content1 = '<li id="tab-day-' + i + '"><a data-toggle="tab" onClick="setDate(' + i + ')" href="#day' + i + '">' + $EVENTCREATOR_ACTTAB_DAY + ' ' + i + '</a></li>';
      content2 = '<div id="day' + i + '" class="tab-pane fade"><h3 class="title-style-2">' + $EVENTCREATOR_ACTTAB_DAY + ' ' + i + ' (' + dateString + ')<span class="title-under"></span></h3><p>'
                  + '<div class="row clearfix">'
                    + '<div class="col-md-12 column">'
                      + '<table id="table-day-' + i + '" class="table table-bordered table-hover dt-responsive">'
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

    refreshActivityTable();

    // $.getJSON( '/events/activities/' + $('#txtEventId').val(), function( activityData ) {
    //   if(activityData == '') {
    //     activityData = JSON.parse(localStorage.getItem('activityItem'));
    //     if(activityData == '' || activityData == null) {
    //       //ABSOLUTELY NOTHING
    //     } else {
    //       for (var i = 0; i < activityData.length; i++) {
    //         if(activityData[i].day <= diffDays) {
    //           addingActivity(activityData[i]);
    //         }          
    //       }          
    //     }
    //   } else {
    //     for (var i = 0; i < activityData.length; i++) {
    //       if(activityData[i].day <= diffDays) {
    //         addingActivity(activityData[i]);
    //       }          
    //     }
    //   }
    // });
  });  
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function addActivity() {
  if(validateActivity() == true) {
    var eventId = $('#txtEventId').val();
    var day = $('#txtActivityDate').val().split(' ')[0];
    var time = $('#txtActivityTime').val();
    var place = $('#txtActivityPlace').val();
    var activity = $('#txtActivity').val();
    var note = $('#txtActivityNote').val();
    var lat = $('#txtActivityLat').val();
    var lng = $('#txtActivityLng').val();

    var activity = {
      eventId:    eventId,
      day:        day,
      time:       time,
      place:      place,
      activity:   activity,
      note:       note,
      latitude:   lat,
      longitude:  lng
    };

    $.ajax({
      type: 'POST',
      data: activity,
      url: '/events/addactivity',
      async: false,
      dataType: 'JSON'
    }).done(function( response ) {
        if (response.msg === '') {
          refreshActivityTable();
        } else {
          showAlert('error', $LAYOUT_ERROR + response.msg);
        }
    });
  }    
}

function addDonation() {
  var item = $('#txtDonationItem').val();
  var unit = $('#txtDonationUnit').val();
  var quantity = $('#txtDonationQuantity').val();
  var minimum = $('#txtDonationMinimum').val();

  var eventId = $('#txtEventId').val();
  var donation = {
    eventId:      eventId,
    item:         item,
    unit:         unit,
    quantity:     quantity,
    minimum:      minimum,
    dateCreated:  new Date()
  };

  $.ajax({
    type: 'POST',
    data: donation,
    url: '/events/adddonationrequire',
    async: false,
    dataType: 'JSON'
  }).done(function( response ) {
      if (response.msg === '') {
        refreshDonationTable();
      } else {
        showAlert('error', $LAYOUT_ERROR + response.msg);
      }
  });
}

function refreshActivityTable() {
  $('#txtActivityTime').val('');
  $('#txtActivityPlace').val('');
  $('#txtActivity').val('');
  $('#txtActivityNote').val('');  
  $('#txtActivityLat').val('');
  $('#txtActivityLng').val('');
  var eventId = $('#txtEventId').val();
  var diffDays = document.getElementById("txtNumberOfDates").value;  
  $.getJSON( '/events/activities/' + $('#txtEventId').val(), function( activityData ) {
    for(var i = 1; i <= diffDays; i++) {
      $('#table-day-' + i).DataTable().clear().draw();
    }

    for(var i = 0; i < activityData.length; i++) {
      $('#table-day-' + activityData[i].day).DataTable().row.add([
        activityData[i].time,
        activityData[i].place,
        activityData[i].activity,
        activityData[i].note,
        '<center>' +
          '<a class="btn btn-info" onclick="showEditActivity(\'' + activityData[i]._id + '\')"><i class="fa fa-edit"></i></a>' +
          '<a class="btn btn-danger" onclick="deleteActivity(\'' + activityData[i]._id + '\')"><i class="fa fa-remove"></i></a>' +
        '</center>'
      ]).draw( false );
    }
  });
}

function showEditActivity(_id) {
  $.getJSON( '/events/activities/id/' + _id, function( data ) {
    $('#txtActivityTime').val(data.time);
    $('#txtActivityPlace').val(data.place);
    $('#txtActivity').val(data.activity);
    $('#txtActivityNote').val(data.note);
    $('#txtActivityLat').val(data.latitude);
    $('#txtActivityLng').val(data.longitude);
    initialize();
    populateActivityButtons(_id);
  });
}

function populateActivityButtons(_id) {
  if(_id == "") {
    $('#txtActivityTime').val('');
    $('#txtActivityPlace').val('');
    $('#txtActivity').val('');
    $('#txtActivityNote').val('');
    $('#txtActivityLat').val('');
    $('#txtActivityLng').val('');
    $('#activityForm').attr('onsubmit', 'addActivity()');
    $('#activityButtonForm').html('<button id="#form-add" type="submit" style="float:right" class="btn btn-info">' + $EVENTCREATOR_ACTFORM_ADD + '</button>');
  } else {
    $('#activityForm').attr('onsubmit', 'editActivity(\'' + _id + '\')');
    $('#activityButtonForm').html('<button type="submit" style="float:right" class="btn btn-success"><i class="fa fa-check"></i></button><button onclick="populateActivityButtons(\'\')" style="float:right" class="btn btn-danger"><i class="fa fa-remove"></i></button>');
  }
}

function refreshDonationTable() {
  $('#txtDonationItem').val("");
  $('#txtDonationUnit').val("");
  $('#txtDonationQuantity').val("");
  $('#txtDonationMinimum').val("");    
  var eventId = $('#txtEventId').val();
  $('#donationTable').DataTable().clear().draw();
  $.getJSON( '/events/donationrequire/' + $('#txtEventId').val(), function( data ) {
    $.each(data, function(){
      $('#donationTable').DataTable().row.add( [
              this.item,
              this.unit,
              parseInt(this.quantity).toLocaleString(),
              parseInt(this.minimum).toLocaleString(),
              '<center>' +
                '<a class="btn btn-info" onclick="showEditDonation(\'' + this._id + '\')"><i class="fa fa-edit"></i></a>' +
                '<a class="btn btn-danger" onclick="deleteDonation(\'' + this._id + '\')"><i class="fa fa-remove"></i></a>' +
              '</center>'
          ] ).draw( false );
    });
  });
}

function showEditDonation(_id) {
  $.getJSON( '/events/donationrequire/id/' + _id, function( data ) {
    $('#txtDonationItem').val(data.item);
    $('#txtDonationUnit').val(data.unit);
    $('#txtDonationQuantity').val(data.quantity);
    $('#txtDonationMinimum').val(data.minimum);
    $('#txtDonationItem').attr('readonly','readonly');
    $('#txtDonationUnit').attr('readonly','readonly');
    populateDonationButtons(_id);
  });
}

function editActivity(_id) {
  var day = $('#txtActivityDate').val().split(' ')[0];
  var time = $('#txtActivityTime').val();
  var place = $('#txtActivityPlace').val();
  var activity = $('#txtActivity').val();
  var note = $('#txtActivityNote').val();
  var lat = $('#txtActivityLat').val();
  var lng = $('#txtActivityLng').val();

  var activity = {
    day:        day,
    time:       time,
    place:      place,
    activity:   activity,
    note:       note,
    latitude:   lat,
    longitude:  lng
  };

  $.ajax({
    type: 'PUT',
    data: activity,
    url: '/events/updateactivity/' + _id,
    async: false,
    dataType: 'JSON'
  }).done(function( response ) {
      if (response.msg === '') {
        refreshActivityTable();
        populateActivityButtons('');
      } else {
        showAlert('error', $LAYOUT_ERROR + response.msg);
      }
  });
}

function deleteActivity(_id) {
  $.ajax({
    type: 'DELETE',
    url: '/events/removeactivitiesbyid/' + _id,
    async: false
  }).done(function( response ) {
      if (response.msg === '') {
        refreshActivityTable();
        populateActivityButtons('');
      } else {
        showAlert('error', $LAYOUT_ERROR + response.msg);
      }
  });  
}

function populateDonationButtons(_id) {
  if(_id == "") {
    $('#txtDonationItem').val("");
    $('#txtDonationUnit').val("");
    $('#txtDonationQuantity').val("");
    $('#txtDonationMinimum').val("");
    $('#txtDonationItem').removeAttr('readonly');
    $('#txtDonationUnit').removeAttr('readonly');
    $('#donationForm').attr('onsubmit', 'addDonation()');
    $('#donationButtonForm').html('<button id="formDonationAdd" type="submit" style="float:right" class="btn btn-info">' + $EVENTCREATOR_ACTFORM_ADD + '</button>');
  } else {
    $('#donationForm').attr('onsubmit', 'editDonation(\'' + _id + '\')');
    $('#donationButtonForm').html('<button type="submit" style="float:right" class="btn btn-success"><i class="fa fa-check"></i></button><button onclick="populateDonationButtons(\'\')" style="float:right" class="btn btn-danger"><i class="fa fa-remove"></i></button>');
  }
}

function editDonation(_id) {
  var item = $('#txtDonationItem').val();
  var unit = $('#txtDonationUnit').val();
  var quantity = $('#txtDonationQuantity').val();
  var minimum = $('#txtDonationMinimum').val();

  var eventId = $('#txtEventId').val();
  var donation = {
    eventId:      eventId,
    item:         item,
    unit:         unit,
    quantity:     quantity,
    minimum:      minimum,
    dateCreated:  new Date()
  };

  $.ajax({
    type: 'PUT',
    data: donation,
    url: '/events/editdonationrequire/' + _id,
    async: false,
    dataType: 'JSON'
  }).done(function( response ) {
      if (response.msg === '') {
        refreshDonationTable();
        populateDonationButtons('');
      } else {
        showAlert('error', $LAYOUT_ERROR + response.msg);
      }
  });
}

function deleteDonation(_id) {
  $.ajax({
    type: 'DELETE',
    url: '/events/deleterequireddonation/' + _id,
    async: false
  }).done(function( response ) {
      if (response.msg === '') {
        refreshDonationTable();
        populateDonationButtons('');
      } else {
        showAlert('error', $LAYOUT_ERROR + response.msg);
      }
  });  
}

// function addingActivity(obj) {
//     var day = obj.day;
//     var time = obj.time;
//     var place = obj.place;
//     var activity = obj.activity;
//     var note = obj.note;
//     var lat = obj.latitude;
//     var lng = obj.longitude;

//     $('#table-day-' + day).DataTable().row.add( [
//             time,
//             place + '<div style="display:none"><p class="lat">' + lat + '</p><p class="lng">' + lng + '</p></div>',
//             activity,
//             note,
//             '<center><a class="btn btn-danger" onclick="deleteActivity(' + day + ', this)"><i class="fa fa-remove"></i></a></center>'
//         ] ).draw( false );

//     $('#txtActivityTime').val('');
//     $('#txtActivityPlace').val('');
//     $('#txtActivity').val('');
//     $('#txtActivityNote').val('');
// }

// function deleteActivity(day, that) {
//   $('#table-day-' + day).DataTable()
//             .row( $(that).parents('tr') )
//             .remove()
//             .draw();
// }

// function deleteDonation(that) {
//   $('#donationTable').DataTable()
//             .row( $(that).parents('tr') )
//             .remove()
//             .draw();
// }

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
    var rootURL = window.location.origin?window.location.origin+'/':window.location.protocol+'/'+window.location.host+'/';
    window.location = rootURL + "events/creator_preview";
}  

function validateActivity() {
  if(!validateHhMm($('#txtActivityTime').val())) {    
    $('#txtActivityTime').focus();
    showAlert('danger', $EVENTCREATOR_ALERT_TIME);
    return false;
  }
  return true;
}

function validateHhMm(inputField) {
    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(inputField);

    return isValid;
}

function setDate(day) {
  $('#txtActivityDate').val(day);
}