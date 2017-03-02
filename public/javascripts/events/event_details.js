// DOM Ready =============================================================

$(document).ready(function() {
	$('#event-title').html($('#event-title').html().toUpperCase());

	var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1];
	$.getJSON( '/events/details/' + eventId, function( data ) {
		console.log(data.otherDonationItem);
		var current = 0;
		var required = 0;
		if(data.otherDonationItem.constructor !== Array) {
			if(!data.otherDonationCurrent)
				current = 0;
			else
				current = data.otherDonationCurrent;		
			required = data.otherDonationNumber;
			$('#event-donation-progress').html( $('#event-donation-progress').html() +
					'<label>' + data.otherDonationItem + '</label>' +
					'<div class="progress">' + 
						current + '/<span id="event-donation">' + required + '</span>' +
						'<div role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:' + (current/required) + '%" class="progress-bar progress-bar-striped active"></div>' +
					'</div>'
				);
	    } else {
	      	for (var i = 0; i < data.otherDonationItem.length; i++) {
				if(!data.otherDonationCurrent){
					current = 0;
				} else {
					if(!data.otherDonationCurrent[i])
						current = 0;
					else
						current = data.otherDonationCurrent[i];
				}			
				required = data.otherDonationNumber[i];
				$('#event-donation-progress').html( $('#event-donation-progress').html() +
						'<label>' + data.otherDonationItem[i] + '</label>' +
						'<div class="progress">' + 
							current + '/<span id="event-donation">' + required + '</span>' +
							'<div role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:' + (current/required) + '%" class="progress-bar progress-bar-striped active"></div>' +
						'</div>'
					);
			}
	    }
		
	});

	$.getJSON( '/events/activities/' + eventId, function( data ) {
		$('#activityPane').html('' +
		    '<ul id="activityDays" class="nav nav-tabs">' +
		    '</ul>' +
		    '<div id="activityContents" class="tab-content">' +      
		    '</div>');
		var days = [];
		for (var i = 0; i < data.length; i++) {
			console.log(days);
			if(!days.includes(data[i].day)) {
				console.log("Adding day " + data[i].day);
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
});

// Functions =============================================================

