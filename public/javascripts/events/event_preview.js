// DOM Ready =============================================================

$(document).ready(function() {
  var eventObj = JSON.parse(localStorage.getItem('eventItem'));
  var activityObj = JSON.parse(localStorage.getItem('activityItem'));
  $('#event-title')[0].innerHTML = eventObj.eventName;
  $('#event-type')[0].innerHTML = eventObj.eventType;
  $('#event-date')[0].innerHTML = eventObj.eventDate;
  $('#event-time')[0].innerHTML = eventObj.meetingTime;
  $('#event-place')[0].innerHTML = eventObj.meetingAddress;
  $('#event-description')[0].innerHTML = eventObj.eventDescription;
  $('#event-image')[0].src = eventObj.imageSrc;
  $('#event-donation')[0].innerHTML = eventObj.donationNeeded;
  for (var i = 0; i < eventObj.otherDonationItem.length; i++) {
    var content = '<label>' + eventObj.otherDonationItem[i] + ':</label><div class="progress"><span>0/' + eventObj.otherDonationNumber[i] + '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:70%"></div></div>';
    $('#event-donation-progress')[0].innerHTML += content;
  }

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
});

// Functions =============================================================

function goNext() {
  var eventObj = JSON.parse(localStorage.getItem('eventItem'));
  var activityObj = JSON.parse(localStorage.getItem('activityItem'));
  
  eventObj.dateCreated = new Date();
  eventObj.dateModified = new Date();
  eventObj.deleteFlag = "";

  var newImage = "/images/event/" + Date().split(' ').join('').replace(/:/g,"") + eventObj.imageExt;
  var newImageName = "public/images/event/" + Date().split(' ').join('').replace(/:/g,"") + eventObj.imageExt;

  eventObj.image = newImage;
  eventObj.imageName = newImageName;
  eventObj.status = "PendingPublish";
  eventObj.currentBudget = "0";
  eventObj.user = readCookie("username");

  for(var i = 0; i < eventObj.otherDonationItem.length; i++){
    eventObj.otherDonationCurrent[i] = "0";
  }

  $.ajax({
        type: 'POST',
        data: eventObj,
        url: '/events/addevent',
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.msg === '') {
            var id = response._id;

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
                  dataType: 'JSON'
              }).done(function( response ) {
                  if (response.msg === '') {
                    // Redirect to event list page
                  }
              });
            }
        }
        else {

            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);

        }
    });

}