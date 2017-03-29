// DOM Ready =============================================================

$(document).ready(function() {
  
  populateLanguage();
  populateEvent();
  populateProducer();
  populateTimeline();
  $('[data-toggle="tooltip"]').tooltip(); 
  $('#btnEditEvent').attr('href','/events/edit/' + readCookie('eventId'));

});

// Functions =============================================================

function populateLanguage() {
  $('#header-desc').html($EVENTPREVIEW_HEADER_DESC);
  $('#header-producer').html($EVENTDETAILS_HEADER_PRODUCER);
  $('#header-location').html($EVENTDETAILS_HEADER_LOCATION);
  $('#header-description').html($EVENTDETAILS_HEADER_EVENTDESC);
  $('#header-activity').html($EVENTDETAILS_HEADER_ACTIVITIES);

  $('#btnEditEvent').html($EVENTPREVIEW_BACK);
  $('#btnFinishEvent').html($EVENTPREVIEW_CONTINUE);
}

function populateTimeline() {
  var eventId = readCookie('eventId');
  $.getJSON( '/events/details/' + eventId, function( data ) {    
    var published = {'name':$EVENTDETAILS_DATECREATED,'date':new Date(data.dateCreated)};
    var deadline = {'name':$EVENTDETAILS_DEADLINE,'date':new Date(data.eventDeadline)};
    var start = {'name':$EVENTDETAILS_STARTDATE,'date':new Date(data.eventDate.split(' - ')[0])};
    var end = {'name':$EVENTDETAILS_ENDDATE,'date':new Date(data.eventDate.split(' - ')[1])};
    var now = {'name':$EVENTDETAILS_NOW,'date':new Date()};
    var now2 = new Date();

    var dates = [published, deadline, start, end, now];

    dates.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a.date.getTime()) - new Date(b.date.getTime());
    });

    var fullPercent = dates[4].date.getTime() - dates[0].date.getTime();
    var part = 0;
    var background = "#115c9b";
    $('#progress-1').attr('aria-valuenow', '0%');
    $('#tooltip-1').attr('title', dates[0].name + '<br>' + dates[0].date.toLocaleDateString()).tooltip('fixTitle').tooltip('show');
    for(var i = 1; i <= 4; i++) {
      part = parseFloat((dates[i].date.getTime() - dates[i - 1].date.getTime()) / fullPercent * 100);      
      $('#progress-' + (i + 1)).attr('aria-valuenow', part + '%');
      $('#progress-' + (i + 1)).attr('style', 'width: ' + part + '%;background: ' + background);
      $('#tooltip-' + (i + 1)).attr('title', dates[i].name + '<br>' + dates[i].date.toLocaleDateString()).tooltip('fixTitle').tooltip('show');
      if(dates[i].name == "Now") {
        background = "none";
        var now = i + 1;
      }
    }  
    $('[data-toggle="tooltip"]').tooltip({trigger: 'manual'}).tooltip('show');

    // $(".progress-bar").each(function(){
    //   each_bar_width = $(this).attr('aria-valuenow');
    //   $(this).width(each_bar_width);
    // });
  });  
}

function populateEvent() {
  var eventId = readCookie('eventId');

  $.getJSON( '/events/details/' + eventId, function( data ) {    
    console.log(data);
    $('#event-title').html(data.eventName);
    var lang = "vi";
    if(localStorage.getItem('language') == 'en')
      lang = 'en-us';
    
    google.maps.event.addDomListener(window, 'load', populateMap(data));
    var date = new Date(data.eventDate.split(' - ')[0]);
    $('#eventDay').html(date.getDate());
    $('#eventMonthYear').html(date.toLocaleString(lang, { month: "long" }) + ', ' + date.getFullYear());
    $('#eventTime').html(data.meetingTime);


    $('#meetingAddress').html(data.meetingAddress);
    $('#eventDescription').html(data.eventDescription.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));

    $('#eventImage').attr('src', data.eventImage);       
    populateActivities();
  });
}

function populateMap(data) {
  console.log(data.eventName);
    var mapOptions = {
        zoom: 15,
        center: new google.maps.LatLng(data.meetingAddressLat, data.meetingAddressLng),
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,              
    };            
    var myCenter = new google.maps.LatLng(data.meetingAddressLat, data.meetingAddressLng);
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);                      
    var marker = new google.maps.Marker({
      position: myCenter,
      animation:google.maps.Animation.BOUNCE      
    });
  marker.setMap(map);

  var infowindow = new google.maps.InfoWindow({
      content:data.eventName
  });
  infowindow.open(map,marker)
}

function populateProducer() {
  var id = readCookie('user');
  
  $.getJSON( '/users/id/' + id, function(data) {
    $('#txtCompanyImageSrc').attr('src', data.companyImage);
    $('#txtCompanyName').html(data.companyName);
    $('#txtCompanyAddress').html(data.companyAddress);
    $('#txtCompanyPhone').html(data.companyPhoneNumber);
    $('#txtCompanyEmail').html(data.companyEmail);
  });   
  
}


function populateActivities() {
  var activityObj = JSON.parse(localStorage.getItem('activityItem'));
  $('#activityPane').html('' +
        '<ul id="activityDays" class="nav nav-tabs">' +
        '</ul>' +
        '<div id="activityContents" class="tab-content">' +      
        '</div>');
  var days = [];
  for (var i = 0; i < activityObj.length; i++) {
    if(!days.includes(activityObj[i].day)) {
      days.push(activityObj[i].day);
      $('#activityDays').html($('#activityDays').html() + '<li id="activity-tab-day-' + activityObj[i].day + '"><a data-toggle="tab" href="#activity-day-' + activityObj[i].day + '">' + $EVENTDETAILS_ACTIVITY_DAY + ' ' + activityObj[i].day + '</a></li>');
      $('#activityContents').html(
        $('#activityContents').html() + 
        '<div id="activity-day-' + activityObj[i].day + '" class="tab-pane fade">' +
          '<table class="table table-striped">' +
            '<thead>' +
              '<tr>' +
                '<th>' + $EVENTDETAILS_ACTIVITY_TIME + '</th>' +
                '<th>' + $EVENTDETAILS_ACTIVITY_LOCATION + '</th>' +
                '<th>' + $EVENTDETAILS_ACTIVITY_ACT + '</th>' +
                '<th>' + $EVENTDETAILS_ACTIVITY_NOTE + '</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody id="activity-table-content-day' + activityObj[i].day + '">' +
            '</tbody>' +
          '</table>' +
        '</div>');
    }

    $('#activity-table-content-day' + activityObj[i].day).html(
        $('#activity-table-content-day' + activityObj[i].day).html() +
        '<tr>' +
          '<td>' + activityObj[i].time + '</td>' +
          '<td>' + activityObj[i].place + '</td>' +
          '<td>' + activityObj[i].activity + '</td>' +
          '<td>' + activityObj[i].note + '</td>' +
        '</tr>');
  }

  $('#activityDays li a').first().click();
  console.log($('#activityDays').html());
  console.log($('#activityContents').html());
}

function goNext() {
  var a = new Date();
  var eventObj = {
    status: "Published",
    dateModified: a.toString()
  };

  $.ajax({
        type: 'POST',
        data: eventObj,
        url: '/events/finishevent/' + readCookie('eventId'),
        dataType: 'JSON'
    }).done(function( response ) {
        var id = readCookie('eventId');
        // Check for successful (blank) response
        if (response.msg === '') {
          // Remove any old activities
          $.ajax({
              type: 'DELETE',
              url: '/events/removeactivities/' + readCookie('eventId'),
              dataType: 'JSON'
          }).done(function( response ) {
            if (response.msg === '') {
              // Insert Activities to Database
              var activityObj = JSON.parse(localStorage.getItem('activityItem'));
              var newActivity = [];
              for(var i = 0; i < activityObj.length; i++) {
                newActivity = {
                  eventId : id,
                  day: activityObj[i].day,
                  time: activityObj[i].time,
                  place: activityObj[i].place,
                  activity: activityObj[i].activity,
                  note: activityObj[i].note,
                  latitude: activityObj[i].latitude,
                  longitude: activityObj[i].longitude,
                };

                $.ajax({
                  type: 'POST',
                  data: newActivity,
                  url: '/events/addactivity',
                  async: false,
                  dataType: 'JSON'
                }).done(function( response ) {
                    if (response.msg === '') {
                      
                    } else {
                      alert(response.msg);
                    }
                });
              }
              
              // localStorage.removeItem("donationItem");
              deleteCookie('eventId');
              localStorage.removeItem("activityItem");
              window.location.replace(location.origin + '/events/' + id); 
            }            
          });    
        }
        else {

            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);

        }
    });

}