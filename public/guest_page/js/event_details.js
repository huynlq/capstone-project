		
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
	populateSummary(eventId);
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

function populateSummary(eventId) {
	var content = "";
		content =   '<hr><div class="page-heading text-center">' +
						'<div class="container zoomIn animated">' +
					    	'<h1 style="text-transform: uppercase;" class="page-title">THIS EVENT HAS ENDED.<span class="title-under"></span></h1>' +
					    	'<p class="page-description">Thanks you for your support.</p>' +
					  	'</div>' +
					'</div>' +
					'<h2 class="title-style-2">Summary <span class="title-under"></span></h2>' +
					'<div class="row">'+
						'<div class="col-md-6 col-sm-6 col-xs-12">' +
							'<h3><strong>Donations</strong></h3>' +
							'<table id="tableDonations" cellspacing="0" width="100%" class="table table-style-1 table-striped table-bordered dt-responsive nowrap datatable-responsive">' +
								'<thead>' +
									'<tr>' +
										'<th>#</th>' +
										'<th>Donator</th>' +
										'<th>Donation Item</th>'+
										'<th>Quantity</th>'+
									'</tr>'+
								'</thead>'+
								'<tbody></tbody>'+
							'</table>'+
						'</div>' +
						'<div class="col-md-1 col-sm-1 col-xs-12"></div>' +
						'<div class="col-md-5 col-sm-5 col-xs-12">' +
							'<h3><strong>Participants</strong></h3>' +
							'<table id="tableParticipants" cellspacing="0" width="100%" class="table table-style-1 table-striped table-bordered dt-responsive nowrap datatable-responsive">'+
								'<thead>'+
									'<tr>'+
										'<th>#</th>'+
										'<th>Participant</th>'+
									'</tr>'+
								'</thead>'+
								'<tbody></tbody>'+
							'</table>'+
						'</div>' +
					'</div>' +
					'<br>' +
					'<div class="col-md-12 col-sm-12 col-xs-12">' +
						'<h3><strong>Activity Costs</strong></h3>' +
						'<table id="tableActivityCosts" cellspacing="0" width="100%" class="table table-style-1 table-striped table-bordered dt-responsive nowrap datatable-responsive">'+
							'<thead>'+
								'<tr>'+
									'<th>#</th>'+
									'<th>Day</th>'+
									'<th>Place</th>'+
									'<th>Activity</th>'+
									'<th>Est. Cost</th>'+
									'<th>Actual Cost</th>'+
								'</tr>'+
							'</thead>'+
							'<tbody></tbody>'+
						'</table>'+
					'</div><hr>';
	console.log(content);
	$('#eventSummary').html(content);

	var tableParticipants = $('#tableParticipants').DataTable({"columnDefs": [{ "width": "10px", "targets": 0 }]});
	tableParticipants.clear().draw();
	tableParticipants.columns.adjust().draw();

	var tableDonations = $('#tableDonations').DataTable({"columnDefs": [{ "width": "10px", "targets": 0 }]});
	tableDonations.clear().draw();
	var tableActivityCosts = $('#tableActivityCosts').DataTable({"columnDefs": [{ "width": "10px", "targets": 0 }]});
	tableActivityCosts.clear().draw();

	$('#tableParticipants_wrapper .row .col-sm-6').first().removeClass("col-sm-6").addClass("col-sm-5");

	// Populate Participants
	$.ajax({
        url: '/events/participants/' + eventId,
        dataType: 'json',
        async: false,
        success: function( data ) {
        	var counter = 0;
        	var participant;
        	$.each(data, function(){
        		$.getJSON( '/users/id/' + this.userId, function( userData ) {
        			counter++;
	        		tableParticipants.row.add([
	        			counter,
	        			'<a href="/users/' + userData._id + '">' + userData.username + '</a>'
	        		]).draw('false');
        		});        		
        	});
        }
    });

	// Populate Donations
	$.ajax({
        url: '/events/donations/' + eventId,
        dataType: 'json',
        async: false,
        success: function( data ) {
        	var counter = 0;
        	var participant;
        	var item;
        	var number;
        	var unit;
        	var donator;
        	$.each(data, function(){
        		counter++;
        		item = this.donationItem;
    			number = this.donationNumber;
    			$.ajax({
			        url: '/events/donationrequirebyname/' + eventId + '/' + this.donationItem,
			        dataType: 'json',
			        async: false,
			        success: function( data ) {
			        	unit = data.unit;
			        }
			    });
        		if(this.userId != '' && this.userId != null) {        			
        			$.ajax({
				        url: '/users/id/' + this.userId,
				        dataType: 'json',
				        async: false,
				        success: function( data ) {
				        	if(data.companyName != '' && data.companyName != null) {
				        		donator = data.companyName;
				        	} else {
				        		donator = data.username;
				        	}
				        	tableDonations.row.add([
			        			counter,
			        			'<a href="/users/' + data._id + '">' + donator + '</a>',
			        			item,
			        			parseInt(number).toLocaleString() + ' ' + unit
			        		]).draw('false');
				        }
				    });
        		} else {
        			tableDonations.row.add([
	        			counter,
	        			this.donatorName,
	        			item,
			        	number + ' ' + unit
	        		]).draw('false');
        		}
        		
        	});
        }
    });

	// Populate Activity Costs
	$.ajax({
        url: '/events/activities/' + eventId,
        dataType: 'json',
        async: false,
        success: function( data ) {
        	var estimate;
        	var actual;
        	var counter = 0;
        	$.each(data, function(){
        		if((this.estBudget != '' && this.estBudget != null) || (this.actualCost != '' && this.actualCost != null)) {
        			if(this.estBudget != '' && this.estBudget != null)
        				estimate = this.estBudget;
        			else
        				estimate = '';        				

        			if(this.actualCost != '' && this.actualCost != null)
        				actual = this.actualCost;
        			else
        				actual = '';        				

        			counter++;
        			tableActivityCosts.row.add([
        				counter,
        				this.day,
        				this.place,
        				this.activity,
        				estimate,
        				actual
        			]).draw('false');
        		}
        	});
        }
    });	
}