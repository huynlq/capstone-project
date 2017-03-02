// DOM Ready =============================================================

$(document).ready(function() {

 

  //var eventObj = JSON.parse(localStorage.getItem('eventItem'));
  
  populateEvent();
  
  
});

// Functions =============================================================

function populateEvent() {
  var eventId = localStorage.getItem('eventId');

  $.getJSON( '/events/details/' + eventId, function( data ) {    
    console.log(data.otherDonationItem.constructor === Array);
    $('#event-title')[0].innerHTML = data.eventName;
    $('#event-type')[0].innerHTML = data.eventType;
    $('#event-date')[0].innerHTML = data.eventDate;
    $('#event-time')[0].innerHTML = data.meetingTime;
    $('#event-place')[0].innerHTML = data.meetingAddress;
    $('#event-description')[0].innerHTML = data.eventDescription;
    $('#event-image')[0].src = data.eventImage;
    $('#event-donation')[0].innerHTML = data.donationNeeded;
    if(data.otherDonationItem.constructor !== Array) {
      var content = '<label>' + data.otherDonationItem + ':</label><div class="progress"><span>0/' + data.otherDonationNumber + '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:70%"></div></div>';
      $('#event-donation-progress')[0].innerHTML += content;
    } else {
      for (var i = 0; i < data.otherDonationItem.length; i++) {
        var content = '<label>' + data.otherDonationItem[i] + ':</label><div class="progress"><span>0/' + data.otherDonationNumber[i] + '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:70%"></div></div>';
        $('#event-donation-progress')[0].innerHTML += content;
      }  
    }
    

    populateActivities();
  });
}

function populateActivities() {
  var activityObj = JSON.parse(localStorage.getItem('activityItem'));
  $('#activityPane').html('' +
    '<ul id="activityDays" class="nav nav-tabs">' +
    '</ul>' +
    '<div id="activityContents" class="tab-content">' +      
    '</div>');

  var date = $('#event-date')[0].innerHTML;
  var dates = date.split(" - ");
  var date1 = new Date(dates[0]);
  var date2 = new Date(dates[1]);
  var timeDiff = Math.abs(date2.getTime() - date1.getTime());
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; 

  for (var i = 1; i <= diffDays; i++) {
    $('#activityDays').html($('#activityDays').html() + '<li id="activity-tab-day-' + i + '"><a data-toggle="tab" href="#activity-day-' + i + '">Day ' + i + '</a></li>');
    $('#activityContents').html(
      $('#activityContents').html() + 
      '<div id="activity-day-' + i + '" class="tab-pane fade">' +
        '<table class="table table-striped">' +
          '<thead>' +
            '<tr>' +
              '<th>Time</th>' +
              '<th>Place</th>' +
              '<th>Activity</th>' +
              '<th>Est. Budget</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody id="activity-table-content-day' + i + '">' +
          '</tbody>' +
        '</table>' +
      '</div>');
  }

  for (var i = 0; i < activityObj.length; i++) {
    $('#activity-table-content-day' + activityObj[i].day).html(
      $('#activity-table-content-day' + activityObj[i].day).html() +
      '<tr>' +
        '<td>' + activityObj[i].time + '</td>' +
        '<td>' + activityObj[i].place + '</td>' +
        '<td>' + activityObj[i].activity + '</td>' +
        '<td>' + activityObj[i].estBudget + '</td>' +
      '</tr>');
  }

  $('#activity-tab-day-1').addClass('active');
  $('#activity-day-1').addClass('in active');
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
        url: '/events/finishevent/' + localStorage.getItem('eventId'),
        dataType: 'JSON'
    }).done(function( response ) {
        var id = localStorage.getItem('eventId');
        // Check for successful (blank) response
        if (response.msg === '') {
            
            var activityObj = JSON.parse(localStorage.getItem('activityItem'));

            var newActivity;
            for(var i = 0; i < activityObj.length; i++) {
              activityObj[i].eventId = id;
              newActivity = {
                eventId : id,
                day: activityObj[i].day,
                time: activityObj[i].time,
                place: activityObj[i].place,
                activity: activityObj[i].activity,
                estBudget: activityObj[i].estBudget
              }

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
            localStorage.removeItem("eventId");
            localStorage.removeItem("activityItem");
            window.location.replace(location.origin + '/events/' + id);
            
        }
        else {

            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);

        }
    });

}