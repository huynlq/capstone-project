// DOM Ready =============================================================

$(document).ready(function() {

 

  //var eventObj = JSON.parse(localStorage.getItem('eventItem'));
  
  populateEvent();
  populateDonations();  
  populateProducer();
  
});

// Functions =============================================================

function populateEvent() {
  var eventId = readCookie('eventId');

  $.getJSON( '/events/details/' + eventId, function( data ) {    
    $('#event-title').html(data.eventName);
    $('#event-type').html(data.eventType);
    $('#event-date').html(data.eventDate);
    $('#event-time').html(data.meetingTime);
    $('#event-place').html(data.meetingAddress);
    $('#event-description').html(data.eventDescription);
    $('#event-image')[0].src = data.eventImage;       
    populateActivities();
  });
}

function populateDonations()  {
  var donationObj = JSON.parse(localStorage.getItem('donationItem'));
  console.log(donationObj);
  console.log(donationObj[0].donationItem);
  $('#event-donation-progress').html("");
  var content = "";
  for(var i = 0; i < donationObj.length; i++) {
    content += '<label>' + donationObj[i].donationItem + ':</label> 0/' + parseInt(donationObj[i].donationNumber).toLocaleString() + ' ' + donationObj[i].donationUnit +
                  '<div class="progress">' +
                    '<div id="donationProgress" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:0%" class="progress-bar progress-bar-striped active"></div>' +
                  '</div>';
                  
  }
  $('#event-donation-progress').html(content);
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
        url: '/events/finishevent/' + readCookie('eventId'),
        dataType: 'JSON'
    }).done(function( response ) {
        var id = readCookie('eventId');
        // Check for successful (blank) response
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
                estBudget: activityObj[i].estBudget
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

            

            // Insert Donations to Database
            var donationObj = JSON.parse(localStorage.getItem('donationItem'));
            var newDonation = [];
            for(var i = 0; i < donationObj.length; i++) {
              newDonation = {
                eventId : id,
                item: donationObj[i].donationItem,
                number: donationObj[i].donationNumber,
                unit: donationObj[i].donationUnit,
                minimum: donationObj[i].donationMinimum,                
              };

              $.ajax({
                type: 'POST',
                data: newDonation,
                url: '/events/adddonationrequire',
                async: false,
                dataType: 'JSON'
              }).done(function( response ) {
                  if (response.msg === '') {
                    
                  } else {
                    alert(response.msg);
                  }
              });
            }

            // deleteCookie('eventId');
            // localStorage.removeItem("donationItem");
            // localStorage.removeItem("activityItem");
            window.location.replace(location.origin + '/events/' + id);            
        }
        else {

            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);

        }
    });

}