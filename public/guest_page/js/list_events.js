		
$(function(){

	/*  Populate countdown
 	================================================*/ 
 	populateLanguage();
 	populateEvents(); 	

});


function populateLanguage() {
	$('#header').html($EVENTLIST_HEADER);
	$('#header-desc').html($EVENTLIST_HEADER_DESC);
	$('#txtSearch').attr('placeholder', $EVENTLIST_SEARCH);
	$('#searchBy-name').html($EVENTLIST_SEARCH_NAME);
	$('#searchBy-description').html($EVENTLIST_SEARCH_DESCRIPTION);
	$('#searchBy-address').html($EVENTLIST_SEARCH_ADDRESS);
	$('#sortBy').html($EVENTLIST_SORT_BY);
	$('#sortBy-date').html($EVENTLIST_SORT_BY_DATE);
	$('#sortBy-location').html($EVENTLIST_SORT_BY_PLACE);
	$('#searchBy-deadline').html($EVENTLIST_SEARCH_DEADLINE);
	$('#searchBy-upcoming').html($EVENTLIST_SEARCH_UPCOMING);
	$('#searchBy-inProgress').html($EVENTLIST_SEARCH_IN_PROGRESS);
	$('#searchBy-past').html($EVENTLIST_SEARCH_PAST);
}

function fade() {
	$('#listEvents').toggleClass('fadeIn');
	setTimeout(function(){
    	$('#listEvents').toggleClass('fadeIn');
	}, 	1);
}

function search() {	
    var input, filter, search, i, value;
    var flag;
    var now = new Date();
    input = $('#txtSearch').val();
    filter = input.toUpperCase();
    var searchName = $('.eventSearchName');
    var searchDesc = $('.eventSearchDesc');
    var searchAddress = $('.eventSearchAddress');
    var searchDate = $('.eventSearchDate');
    var searchDeadline = $('.eventSearchDeadline');

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < searchName.length; i++) {
        flag = false;
        statusFlag = true;
        if($('input[name="searchName"]').is(':checked')) {
            if(searchName[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
                flag = true;
            }
        }
        if($('input[name="searchDesc"]').is(':checked')) {
            if(searchDesc[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
                flag = true;
            }
        }
        if($('input[name="searchAddress"]').is(':checked')) {
            if(searchAddress[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
                flag = true;
            }
        }

        if(!$('input[name="searchUpcoming"]').is(':checked')) {
        	if(new Date(searchDate[i].innerHTML.split(' - ')[0]).getTime() > now.getTime()) {
        		statusFlag = false;
        	}
        }

        if(!$('input[name="searchInProgress"]').is(':checked')) {
        	if(new Date(searchDate[i].innerHTML.split(' - ')[0]).getTime() < now.getTime() && new Date(searchDate[i].innerHTML.split(' - ')[1]).getTime() > now.getTime()) {
        		statusFlag = false;
        	}
        }

        if(!$('input[name="searchPast"]').is(':checked')) {
        	if(new Date(searchDate[i].innerHTML.split(' - ')[1]).getTime() < now.getTime()) {
        		statusFlag = false;
        	}
        }

        if (flag && statusFlag) {
            searchName[i].closest('.item').style.display = "";
        } else {
            searchName[i].closest('.item').style.display = "none";
        }
    }
}

function nearby() {
	var myLat;
	var myLng;
	var lat;
	var lng;
	var now = new Date().getTime();
	var date;
	var distance = 0;
	var availableEvents = [];
	var pastEvents = [];	
	if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function (p) {	       
	        myLat = p.coords.latitude;
	        myLng = p.coords.longitude;
	        $.ajax({
		        url: '/events/nearby/' + myLat + '/' + myLng,
		        dataType: 'json',
		        async: false,
		        success: function( docs ) {		
		        	fade();        	
		        	$('#listEvents').html("");
			      	var currentParticipants;
					var currentSponsors;
					var counter = 0;
			    	$.each(docs, function(){	    		
		    			counter++;
				    	dates = this.eventDate.split(" - ");

				    	yearStart = dates[0].split("/")[2];
						monthStart = dates[0].split("/")[0];
						dateStart = dates[0].split("/")[1];
						hourStart = this.meetingTime.split(":")[0];
						minStart = this.meetingTime.split(":")[1];
						yearEnd = dates[1].split("/")[2];
						monthEnd = dates[1].split("/")[0];
						dateEnd = dates[1].split("/")[1];

						dayStart = yearStart + '-' + monthStart + '-' + dateStart + 'T' + this.meetingTime + ':00+07:00';
						dayEnd = yearEnd + '-' + monthEnd + '-' + dateEnd + 'T' + this.meetingTime + ':00+07:00';

						var cd = CountDown(new Date(dayStart), new Date(dayEnd));

				    	var content = "<div class='item col-md-6 col-sm-6 col-sm-12'>" +
								        '<div class="reasons-col fadeIn" style="height: 350px; margin: 20px 0"><img src="' + this.eventImage + '" alt=""/>' +
								          '<div id="event' + counter + 'Time" class="time">' +
									      	  cd + 
									      '</div>' +
										  '<div class="reasons-titles">' +
										    '<h3 class="reasons-title"><a class="eventSearchName" href="/events/' + this._id + '">' + this.eventName + '<a/></h3>' +
										    '<h5 class="reason-subtitle eventSearchAddress">' + this.meetingAddress + '</h5>' + 
										    '<h4><i class="fa fa-clock-o"></i> ' + this.meetingTime + ' - <i class="fa fa-calendar"></i> ' + this.eventDate.split(' - ')[0] + '</h4>' +
										  '</div>' +
										  '<div class="on-hover hidden-xs">' +
										    '<p>' + this.eventShortDescription + '</p>' +
										    '<div class="eventSearchDesc" style="display:none">' + this.eventShortDescription + ' ' + this.eventDescription + '</div>' +
										    '<div class="eventSearchDate" style="display:none">' + this.eventDate + '</div>' +
										    '<div class="eventSearchDeadline" style="display:none">' + this.eventDeadline + '</div>' +
										  '</div>' +
										'</div>' +
							    	"</div>";    	

				    	//$('#eventCarousel').html($('#eventCarousel').html() + content);

				    	$('#listEvents').html($('#listEvents').html() + content);				    	
				    	$('#event' + counter + 'Time').html(CountDown(new Date(dayStart), new Date(dayEnd)));
			    	});

			    	search();
		        }
		    });		    
	    });
	} else {
		showAlert($LAYOUT_ERROR + $EVENTLIST_GEO_NOT_SUPPORTED);
	}
}

function CountDown(startTime, endTime) {
	var date = new Date();
	endTime.setDate(endTime.getDate() + 1);
	if(date.valueOf() < startTime.valueOf()) {
		return countdown(null, startTime, "HOURS", 2).toString();
	} else if(date.valueOf() >= startTime.valueOf() && date.valueOf() < endTime.valueOf()) {
		return $COUNTDOWN_IN_PROGRESS;
	} else {
		return $COUNTDOWN_ENDED;
	}
}

function populateEvents() {
	var counter = 0;
	var dates = "";
	var yearStart = "";
	var monthStart = "";
	var dateStart = "";
	var hourStart = "";
	var minStart = "";
	var yearEnd = "";
	var monthEnd = "";
	var dateEnd = "";

	var dayStart = "";
	var dayEnd = ""

	// jQuery AJAX call for JSON
	$.ajax({
        url: '/events/all',
        dataType: 'json',
        async: false,
        success: function( data ) {
        	fade();
        	$('#listEvents').html("");
            var currentParticipants;
			var currentSponsors;
	    	$.each(data, function(){	    		
    			counter++;
		    	dates = this.eventDate.split(" - ");

		    	yearStart = dates[0].split("/")[2];
				monthStart = dates[0].split("/")[0];
				dateStart = dates[0].split("/")[1];
				hourStart = this.meetingTime.split(":")[0];
				minStart = this.meetingTime.split(":")[1];
				yearEnd = dates[1].split("/")[2];
				monthEnd = dates[1].split("/")[0];
				dateEnd = dates[1].split("/")[1];

				dayStart = yearStart + '-' + monthStart + '-' + dateStart + 'T' + this.meetingTime + ':00+07:00';
				dayEnd = yearEnd + '-' + monthEnd + '-' + dateEnd + 'T' + this.meetingTime + ':00+07:00';

				var cd = CountDown(new Date(dayStart), new Date(dayEnd));

		    	var content = "<div class='item col-md-6 col-sm-6 col-sm-12'>" +
						        '<div class="reasons-col fadeIn" style="height: 350px; margin: 20px 0"><img src="' + this.eventImage + '" alt=""/>' +
						          '<div id="event' + counter + 'Time" class="time">' +
							      	  cd + 
							      '</div>' +
								  '<div class="reasons-titles">' +
								    '<h3 class="reasons-title"><a class="eventSearchName" href="/events/' + this._id + '">' + this.eventName + '<a/></h3>' +
								    '<h5 class="reason-subtitle eventSearchAddress">' + this.meetingAddress + '</h5>' + 
								    '<h4><i class="fa fa-clock-o"></i> ' + this.meetingTime + ' - <i class="fa fa-calendar"></i> ' + this.eventDate.split(' - ')[0] + '</h4>' +
								  '</div>' +
								  '<div class="on-hover hidden-xs">' +
								    '<p>' + this.eventShortDescription + '</p>' +
								    '<div class="eventSearchDesc" style="display:none">' + this.eventShortDescription + ' ' + this.eventDescription + '</div>' +
								    '<div class="eventSearchDate" style="display:none">' + this.eventDate + '</div>' +
									'<div class="eventSearchDeadline" style="display:none">' + this.eventDeadline + '</div>' +
								  '</div>' +
								'</div>' +
					    	"</div>";    	

		    	//$('#eventCarousel').html($('#eventCarousel').html() + content);

		    	$('#listEvents').html($('#listEvents').html() + content);

		    	$('#event' + counter + 'Time').html(CountDown(new Date(dayStart), new Date(dayEnd)));
	    	});

	    	search();
        }
    });
}	