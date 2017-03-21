// DOM Ready =============================================================

$(document).ready(function() {
  
  populateEvent();
  populateProducer();
  
  $('#btnEditEvent').attr('href','/events/edit/' + readCookie('eventId'));

});

// Functions =============================================================

function populateEvent() {
  var eventId = readCookie('eventId');

  $.getJSON( '/events/details/' + eventId, function( data ) {    
    console.log(data);
    $('#event-title').html(data.eventName);
    
    google.maps.event.addDomListener(window, 'load', populateMap(data));
    var date = new Date(data.eventDate.split(' - ')[0]);
    $('#eventDay').html(date.getDate());
    $('#eventMonthYear').html(date.toLocaleString("en-us", { month: "long" }) + ', ' + date.getFullYear());
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
      $('#activityDays').html($('#activityDays').html() + '<li id="activity-tab-day-' + activityObj[i].day + '"><a data-toggle="tab" href="#activity-day-' + activityObj[i].day + '">Day ' + activityObj[i].day + '</a></li>');
      $('#activityContents').html(
        $('#activityContents').html() + 
        '<div id="activity-day-' + activityObj[i].day + '" class="tab-pane fade">' +
          '<table class="table table-striped">' +
            '<thead>' +
              '<tr>' +
                '<th>Time</th>' +
                '<th>Place</th>' +
                '<th>Activity</th>' +
                '<th>Note</th>' +
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
                  note: activityObj[i].note
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