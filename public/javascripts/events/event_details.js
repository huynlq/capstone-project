// DOM Ready =============================================================

$(document).ready(function() {
	$('#event-title').html($('#event-title').html().toUpperCase());

	populateButtons();

	var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1];
	$.getJSON( '/events/details/' + eventId, function( data ) {
		populateDonations(data);		
	});

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
});

// Functions =============================================================

function populateDonations(data) {

	//Set donation items variables
    var items = { 'Cash': 0 };
    var itemsRequire = { 'Cash': data.donationNeeded };

    //Get required items
    if(data.otherDonationItem != null && data.otherDonationItem != ""){
        if(data.otherDonationItem.constructor !== Array) {
            items[data.otherDonationItem.trim()] = 0;
            itemsRequire[data.otherDonationItem.trim()] = data.otherDonationNumber;
        } else {
            for (var i = 0; i < data.otherDonationItem.length; i++) {
                items[data.otherDonationItem[i].trim()] = 0;
                itemsRequire[data.otherDonationItem[i].trim()] = data.otherDonationNumber[i];
            }
        }
    }

    console.log(items);
    console.log(itemsRequire);

    //Get Donation data from the database
    $.getJSON( '/events/donations/' + window.location.href.split('/')[window.location.href.split('/').length - 1], function( dataDonation ) {

        //Count donations
        if(dataDonation != null) {
            $.each(dataDonation, function(){
                if(items.hasOwnProperty(this.donationItem)) {
                    items[this.donationItem] = parseInt(items[this.donationItem]) + parseInt(this.donationNumber);
                } else {
                    items[this.donationItem] = this.donationNumber;
                }
            });
        }
        
        //Populate the progressbar panel
        $('#event-currentDonation').html(parseInt(items['Cash']).toLocaleString());
        $('#event-donation').html(parseInt(itemsRequire['Cash']).toLocaleString());
        var percent = (parseInt(items['Cash']) / parseInt(itemsRequire['Cash'])) * 100;
        $('#donationProgress').attr("style", "width: " + percent + "%");

        var key = Object.keys(itemsRequire);
        var current;
        var required;
        $('#event-other-donation-progress').html('');
        for(var i = 1; i < key.length; i++) {
            current = parseInt(items[key[i]]);
            required = parseInt(itemsRequire[key[i]]);
            $('#event-donation-progress').html( $('#event-donation-progress').html() +
				'<label>' + key[i] + ': </label> ' + current.toLocaleString() + '/<span id="event-donation">' + required.toLocaleString() + '</span>' +
                '<div class="progress">' +                                 
                    '<div role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:' + (current/required)*100 + '%" class="progress-bar progress-bar-striped active"></div>' +
                '</div>'
			);
        }
    }); 
}

function join() {
	var userId = readCookie("user");
	if(userId != "") {
		$.getJSON( '/users/id/' + userId, function( data ) {
			if(data.fullName != null && data.phoneNumber != null && data.address != null) {
				var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1];
				var newJoin = {
					'userId': userId,
					'eventId': eventId,
					'status': 'Present',
					'dateCreated': new Date
				};

				 $.ajax({
			        type: 'POST',
			        data: newJoin,
			        url: '/events/addparticipant',
			        dataType: 'JSON'
			    }).done(function( response ) {

			        // Check for successful (blank) response
			        if (response.msg === '') {
			            
			            // Update the table
			            populateButtons();

			        }
			        else {

			            // If something goes wrong, alert the error message that our service returned
			            alert('Error: ' + response.msg);

			        }
			    });

			} else {

			}
		});	
	}	
}

function populateButtons() {
	var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1];
	var userId = readCookie("user");
	$.getJSON( '/events/participants/' + eventId + '/' + userId, function( data ) {
		if(data.msg == 'true') {
			$('#btnParticipate').attr('readonly', 'readonly');
			$('#btnParticipate').attr('disabled', 'disabled');
			$('#btnParticipate').attr('onclick', '');
			$('#btnParticipate').removeClass('btn-info');
			$('#btnParticipate').addClass('btn-success');
			$('#btnParticipate').html('PARTICIPATED');
		}
	});
}