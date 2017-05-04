// DOM Ready =============================================================

$(document).ready(function() {
  
  populateLanguage();
  populateEvent();
  populateProducer();
  populateTimeline();
  populateDonationPane();
  $('[data-toggle="tooltip"]').tooltip(); 
  $('#linkEditEvent').attr('href','/events/edit/' + readCookie('eventId'));

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
  var activityObj;
  $.ajax({
    url: '/events/activities/' + readCookie('eventId'),
    dataType: 'json',
    async: false,
    success: function( data ) {
      activityObj = data;
    }
  });
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
}

function populateDonationPane() {
  var eventId = readCookie('eventId');
  // Populate Donations
  var donationContent =   '<ul id="donationPane" class="nav nav-tabs">' +
                '<li class="tabClick"><a data-toggle="tab" href="#approved-donation">' + $EVENTDETAILS_APPROVED_DONATION + '</a></li>' +
                '<li class="tabClick"><a data-toggle="tab" href="#pending-donation">' + $EVENTDETAILS_PENDING_DONATION + '</a></li>' +
                '</ul>' +
                '<div class="tab-content">' +      
                  '<div id="approved-donation" class="tab-pane fade">' +                      
                  '<table id="tableDonations" cellspacing="0" width="100%" class="table table-style-1 table-striped table-bordered dt-responsive nowrap datatable-responsive">' +
                    '<thead>' +
                      '<tr>' +
                        '<th>#</th>' +
                        '<th>' + $EVENTDETAILS_DONATION_NAME + '</th>' +
                        '<th>' + $EVENTDETAILS_DONATION_ITEM + '</th>'+
                        '<th>' + $EVENTDETAILS_DONATION_QUANTITY + '</th>'+
                      '</tr>'+
                    '</thead>'+
                    '<tbody></tbody>'+
                  '</table>'+
                  '</div>' +
                  '<div id="pending-donation" class="tab-pane fade">' +
                  '<table id="tablePendingDonations" cellspacing="0" width="100%" class="table table-style-1 table-striped table-bordered dt-responsive nowrap datatable-responsive">' +
                    '<thead>' +
                      '<tr>' +
                        '<th>#</th>' +
                        '<th>' + $EVENTDETAILS_DONATION_NAME + '</th>' +
                        '<th>' + $EVENTDETAILS_DONATION_ITEM + '</th>'+
                        '<th>' + $EVENTDETAILS_DONATION_QUANTITY + '</th>'+
                      '</tr>'+
                    '</thead>'+
                    '<tbody></tbody>'+
                  '</table>'+
                  '</div>' +
                '</div>';
  $('#donationPane').html(donationContent); 

  var tableDonations = $('#tableDonations').DataTable({"columnDefs": [{ "width": "10px", "targets": 0 }]});
  tableDonations.clear().draw();
  var tablePendingDonations = $('#tablePendingDonations').DataTable({"columnDefs": [{ "width": "10px", "targets": 0 }]});
  tablePendingDonations.clear().draw();

  // Populate Donations
  $.ajax({
        url: '/events/donations/' + eventId,
        dataType: 'json',
        async: false,
        success: function( data ) {
          var counterApproved = 0;
          var counterPending = 0;
          var participant;
          var item;
          var number;
          var unit;
          var donator;
          var link;
          for(var i = data.length - 1; i >= 0; i --) {
            number = parseInt(data[i].donationNumber).toLocaleString();
          item = data[i].donationItem;
          if(data[i].userId != '') {
            link = '<a href="/users/' + data[i].userId + '">' + data[i].donatorName + '</a>';
          } else {
            link = data[i].donatorName;
          }
          if(data[i].status == "Approved") {
            counterApproved++;
            tableDonations.row.add([
                counterApproved,
                link,
                item,
                number + ' ' + data[i].donationUnit
              ]).draw('false');             
          } else {
            counterPending++;
            tablePendingDonations.row.add([
                counterPending,
                link,
                item,
                number + ' ' + data[i].donationUnit
              ]).draw('false');             
          } 
          }
        }
    });
    $('#donationPane li a').first().click();

    // Populate Donation Requirement
    var requireContent = '<div class="panel panel-default">' +          
                '<div class="panel-heading">Mục tiêu</div>' +
                '<div id="event-donation-progress" class="panel-body"></div>' +
              '</div>';

    $('#requiredDonationPane').html(requireContent);

    $('#event-donation-progress').html('');

    $.getJSON( '/events/donationrequire/' + eventId, function( data ) {
      if(data.length == 0) {
        $('#btnDonation').hide();
      }

    //Set donation items variables
      var items = [];
      var donateContent = "";

      //Get required items
      for(var i = 0; i < data.length; i++) {
        items.push({
          item: data[i].item.trim(),
          number: parseInt(data[i].quantity),
          unit: data[i].unit.trim(),
          current: 0
        });

        donateContent += '<div class="row form-group">' +
                  '<div class="col-md-3 col-sm-3 col-xs-12" style="text-align:right">' +
                    '<label class="control-label">' + data[i].item + '</label>' +
                  '</div>' +
                '<div class="col-md-8 col-sm-8 col-xs-12">' +
                  '<input id="' + data[i]._id + '" class="donateItem form-control numberField" type="text" placeholder="(' + data[i].unit + ')" class="form-control col-md-6 col-xs-10"/>' +
                  '<p class="donateItemMinimum" style="display:none">' + data[i].minimum + '</p>' +
                  '<p class="donateItemUnit" style="display:none">' + data[i].unit + '</p>' +
                '</div>' +
               '</div>';
      }

      $('#donationFormItems').html(donateContent);

      numberField();

      //Get Donation data from the database
      $.getJSON( '/events/donations/' + eventId, function( dataDonation ) {

          //Count donations
          if(dataDonation != null) {
            for(var i = 0; i < items.length; i++) {
              for(var j = 0; j < dataDonation.length; j++) {
                if(dataDonation[j].status != "Pending") {
                  if(dataDonation[j].donationItem.trim() == items[i].item) {
                    items[i].current = parseInt(items[i].current) + parseInt(dataDonation[j].donationNumber);
                  }
                }
              }
            }
          }
          
          //Populate the progressbar panel
          var current;
          var required;
          var progressing;
          for(var i = 0; i < items.length; i++) {
              current = parseInt(items[i].current);
              required = parseInt(items[i].number);
              progressing = parseFloat((current/required)*100);
              var status = '';
              var status2 = '';
              if(progressing > 100) {
                status = 'progress-bar-success';
                status2 = '<i class="fa fa-check" style="color:green" aria-hidden="true"></i>';
                progressing = 100;
              }
              console.log(items[i].item + ": " + current + '/' + required);
              $('#event-donation-progress').html( $('#event-donation-progress').html() +
          '<label>' + items[i].item + ': </label> ' + current.toLocaleString() + '/<span id="event-donation">' + required.toLocaleString() + ' (' + items[i].unit + ') ' + status2 + '</span>' +
                  '<div class="progress">' +                                 
                      '<div role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:' + progressing + '%" class="progress-bar progress-bar-striped ' + status + ' active"></div>' +                      
                  '</div>'
        );
          }
      }); 
  });

}

function goNext() {
  var status;
  var name;
  var eventId = readCookie('eventId');
  $.ajax({
    type: 'GET',
    url: '/events/details/' + eventId,
    async: false
  }).done(function( docs ) {
    status = docs.status;
    name = docs.eventName;
  });

  if(status == "Draft") {
    var a = new Date();
    var eventObj = {
      status: "Published",
      dateModified: a.toString()
    };

    $.ajax({
          type: 'POST',
          data: eventObj,
          url: '/events/finishevent/' + eventId,
          dataType: 'JSON'
      }).done(function( response ) {
          var id = eventId;
          // Check for successful (blank) response
          if (response.msg === '') {
            deleteCookie('eventId');
            localStorage.removeItem("activityItem");
            window.location.replace(location.origin + '/events/' + id); 
          }
          else {

              // If something goes wrong, alert the error message that our service returned
              alert('Error: ' + response.msg);

          }
      });  
  } else {
    $.getJSON( '/events/participants/' + eventId, function( dataParticipant ) {      
      for(var i = 0; i < dataParticipant.length; i++) {
        var newNotification = {
            'userId': dataParticipant[i].userId,
            'content': 'Sự kiện <b>"' + name + '"</b> mà bạn đã tham gia đã được sửa đổi.',
            'link': '/events/' + eventId,
            'markedRead': 'Unread',
            'dateCreated': new Date()
        }

        console.log(newNotification);

        // Use AJAX to post the object to our adduser service        
        $.ajax({
            type: 'POST',
            data: newNotification,
            url: '/notifications/addnotification',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg !== '') {

                // If something goes wrong, alert the error message that our service returned
                showAlert('error', $LAYOUT_ERROR + response.msg);

            } else {
              var socket = io.connect('http://localhost:3000');
              socket.emit('notification', newNotification);
            }
        });
      }      
    });    

    $.getJSON( '/events/allsponsor/' + eventId, function( dataSponsor ) {      
      for(var i = 0; i < dataSponsor.length; i++) {
        var newNotification = {
            'userId': dataSponsor[i].userId,
            'content': 'Sự kiện <b>"' + name + '"</b> mà bạn tài trợ đã được sửa đổi.',
            'link': '/events/' + eventId,
            'markedRead': 'Unread',
            'dateCreated': new Date()
        }

        console.log(newNotification);

        // Use AJAX to post the object to our adduser service        
        $.ajax({
            type: 'POST',
            data: newNotification,
            url: '/notifications/addnotification',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg !== '') {

                // If something goes wrong, alert the error message that our service returned
                showAlert('error', $LAYOUT_ERROR + response.msg);

            } else {
              var socket = io.connect('http://localhost:3000');
              socket.emit('notification', newNotification);
            }
        });
      }      
    });    

    $.getJSON( '/events/donations/' + eventId, function( dataDonate ) {      
      for(var i = 0; i < dataDonate.length; i++) {
        if(dataDonate.userId != '') {
          var newNotification = {
              'userId': dataDonate[i].userId,
              'content': 'Sự kiện <b>"' + name + '"</b> mà bạn đóng góp đã được sửa đổi.',
              'link': '/events/' + eventId,
              'markedRead': 'Unread',
              'dateCreated': new Date()
          }

          console.log(newNotification);

          // Use AJAX to post the object to our adduser service        
          $.ajax({
              type: 'POST',
              data: newNotification,
              url: '/notifications/addnotification',
              dataType: 'JSON'
          }).done(function( response ) {

              // Check for successful (blank) response
              if (response.msg !== '') {

                  // If something goes wrong, alert the error message that our service returned
                  showAlert('error', $LAYOUT_ERROR + response.msg);

              } else {
                var socket = io.connect('http://localhost:3000');
                socket.emit('notification', newNotification);
              }
          });
        }        
      }      
    });    

    deleteCookie('eventId');
    localStorage.removeItem("activityItem");
    window.location.replace(location.origin + '/events/' + eventId); 

  }
}