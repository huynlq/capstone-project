		
$(function(){

	/*  Populate countdown
 	================================================*/ 
 	populateLanguage();
 	populateEvents();

});

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

function populateLanguage() {
	$('#header').html($EVENTLIST_HEADER);
	$('#header-desc').html($EVENTLIST_HEADER_DESC);
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
            var currentParticipants;
			var currentSponsors;
	    	$.each(data, function(){
	    		if(this.status != "Cancelled") {
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

			    	var content = "<div class='col-md-6 col-sm-6 col-sm-12'>" +
							        '<div class="reasons-col fadeIn" style="height: 350px; margin: 20px 0"><img src="' + this.eventImage + '" alt=""/>' +
							          '<div id="event' + counter + 'Time" class="time">' +
								      	  cd + 
								      '</div>' +
									  '<div class="reasons-titles">' +
									    '<h3 class="reasons-title"><a href="/events/' + this._id + '">' + this.eventName + '<a/></h3>' +
									    '<h5 class="reason-subtitle">' + this.meetingAddress + '</h5>' + 
									    '<h4><i class="fa fa-clock-o"></i> ' + this.meetingTime + ' - <i class="fa fa-calendar"></i> ' + this.eventDate.split(' - ')[0] + '</h4>' +
									  '</div>' +
									  '<div class="on-hover hidden-xs">' +
									    '<p>' + this.eventShortDescription + '</p>' +
									  '</div>' +
									'</div>' +
						    	"</div>";    	

			    	//$('#eventCarousel').html($('#eventCarousel').html() + content);

			    	$('#listEvents').html($('#listEvents').html() + content);

			    	$('#event' + counter + 'Time').html(CountDown(new Date(dayStart), new Date(dayEnd)));
	    		}		    	
	    	});
        }
    });
}	