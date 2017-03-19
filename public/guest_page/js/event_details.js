		
$(function(){

	var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];

	/*  Populate map
 	================================================*/ 

 	$.getJSON('/events/details/' + eventId, function(data) {
		google.maps.event.addDomListener(window, 'load', populateMap(data));
		var date = new Date(data.eventDate.split(' - ')[0]);
		$('#eventDay').html(date.getDate());
		$('#eventMonthYear').html(date.toLocaleString("en-us", { month: "long" }) + ', ' + date.getFullYear());
		$('#eventTime').html(data.meetingTime);
	});

	populateActivities(eventId);
	populateProducer(eventId);
});

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

function populateActivities(eventId) {
	$.getJSON( '/events/activities/' + eventId, function( data ) {
		$('#activityPane').html('' +
		    '<ul id="activityDays" class="nav nav-tabs">' +
		    '</ul>' +
		    '<div id="activityContents" class="tab-content">' +      
		    '</div>');
		var days = [];
		for (var i = 0; i < data.length; i++) {
			if(!days.includes(data[i].day)) {
				days.push(data[i].day);
				$('#activityDays').html($('#activityDays').html() + '<li id="activity-tab-day-' + data[i].day + '"><a data-toggle="tab" href="#activity-day-' + data[i].day + '">Day ' + data[i].day + '</a></li>');
			    $('#activityContents').html(
			      $('#activityContents').html() + 
			      '<div id="activity-day-' + data[i].day + '" class="tab-pane fade">' +
			        '<table class="table table-striped">' +
			          '<thead>' +
			            '<tr>' +
			              '<th>Time</th>' +
			              '<th>Place</th>' +
			              '<th>Activity</th>' +
			              '<th>Est. Budget</th>' +
			            '</tr>' +
			          '</thead>' +
			          '<tbody id="activity-table-content-day' + data[i].day + '">' +
			          '</tbody>' +
			        '</table>' +
			      '</div>');
			}

			$('#activity-table-content-day' + data[i].day).html(
		      $('#activity-table-content-day' + data[i].day).html() +
		      '<tr>' +
		        '<td>' + data[i].time + '</td>' +
		        '<td>' + data[i].place + '</td>' +
		        '<td>' + data[i].activity + '</td>' +
		        '<td>' + data[i].estBudget + '</td>' +
		      '</tr>');
		}

		$('#activityDays li a').first().click();
	});	
}

function populateProducer(eventId) {
	$.getJSON( '/users/id/' + $("#txtProducerId").val(), function(data) {
		$("#linkCompany").attr('href', '/users/' + data._id);
		$('#txtCompanyImageSrc').attr('src', data.companyImage);
		$('#txtCompanyName').html('<a href="/users/' + data._id + '">' + data.companyName + '</a>');
		$('#txtCompanyPhone').html(data.companyPhoneNumber);
		$('#txtCompanyEmail').html('<a href="mailto:' + data.companyEmail + '">' + data.companyEmail + '</a>');
	});
}