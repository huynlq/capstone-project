// DOM Ready =============================================================

$(document).ready(function() {
	$('#event-title').html($('#event-title').html().toUpperCase());

	populateButtons();
	populateProducer();

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

	//========================== DIALOG HIDING FUNCTIONS ===================

	var participateDialog = $( "#participate-form" ).dialog({
        autoOpen: false,
        show: {
            effect: "fade",
            duration: 200
          },
        hide: {
            effect: "fade",
            duration: 200
          },
        modal: true,
        resizable: false,
        width: 500,
        buttons: {
            "OK" : {
            text: "OK",
            id: "confirmInputInfo",
                click: function(){
                    confirmInputInfo();
                }
            },
            "Cancel" : {
                text: "Cancel",
                click: function() {
                    participateDialog.dialog( "close" );
                }
            }
        }                
    });

    var dialog = $( "#donate-form" ).dialog({
        autoOpen: false,
        show: {
            effect: "fade",
            duration: 200
          },
        hide: {
            effect: "fade",
            duration: 200
          },
        modal: true,   
        width: 500,     
        resizable: false,
        buttons: {
            "OK" : {
            text: "OK",
            id: "confirmDonate",
                click: function(){
                    confirmDonate();
                }
            },
            "Cancel" : {
                text: "Cancel",
                click: function() {
                    dialog.dialog( "close" );
                }
            }
        }                
    });

    $.getJSON( '/events/details/' + eventId, function( data ) {
	    if(data.otherDonationItem != null && data.otherDonationItem != ""){
	        if(data.otherDonationItem.constructor !== Array) {
	        	$('#txtDonateItem').html($('#txtDonateItem').html() + '<option>' + data.otherDonationItem.trim() + '</option>');
	        } else {
	            for (var i = 0; i < data.otherDonationItem.length; i++) {
	            	$('#txtDonateItem').html($('#txtDonateItem').html() + '<option>' + data.otherDonationItem[i].trim() + '</option>');
	            }
	        }
	    }
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

    //Get Donation data from the database
    $.getJSON( '/events/donations/' + window.location.href.split('/')[window.location.href.split('/').length - 1], function( dataDonation ) {

        //Count donations
        if(dataDonation != null) {
            $.each(dataDonation, function(){
            	if(this.status != "Pending") {
            		if(items.hasOwnProperty(this.donationItem)) {
	                    items[this.donationItem] = parseInt(items[this.donationItem]) + parseInt(this.donationNumber);
	                } else {
	                    items[this.donationItem] = this.donationNumber;
	                }
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
			if(data.fullName != null && data.fullName != '' && data.phoneNumber != null && data.phoneNumber != '' && data.email != null && data.email != '') {
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
				// If user doesn't have enough information, show information dialog
				if(data.fullName != null && data.fullName != "")
					$('#txtParticipantFullName').val(data.fullName);

				if(data.email != null && data.email != "")
					$('#txtParticipantEmail').val(data.email);

				if(data.phoneNumber != null && data.phoneNumber != "")
					$('#txtParticipantPhone').val(data.phoneNumber);
				   
				    
				$('#participate-form').dialog('open'); 
			}
		});	
	} else {
		// If user haven't login, redirect to login page
		window.location.href = "/login";
	}
}

function confirmInputInfo() {
	var userData = {
		'fullName': $('#txtParticipantFullName').val(),
		'email': $('#txtParticipantEmail').val(),
		'phoneNumber': $('#txtParticipantPhone').val(),
		'dateModified': new Date()
	};

	$.ajax({
	      type: 'PUT',
	      data: userData,
	      url: '/users/updateuser/' + readCookie('user'),
	      dataType: 'JSON'
	}).done(function( response ) {
		if (response.msg === '') {
			$('#participate-form').dialog('close'); 
		    join();
		} else {
		    alert(response.msg);
		}
	});
}

function populateProducer() {
	var user = $('#userIdLink').html();
	$.getJSON( '/users/username/' + user, function(id) {
		$('#userIdLink').attr('href', '/users/' + id);
		$.getJSON( '/users/id/' + id, function(data) {
			$('#txtCompanyImageSrc').attr('src', data.companyImage);
			$('#txtCompanyName').html(data.companyName);
			$('#txtCompanyAddress').html(data.companyAddress);
			$('#txtCompanyPhone').html(data.companyPhoneNumber);
			$('#txtCompanyEmail').html(data.companyEmail);
		});		
	});
}

function populateButtons() {
	var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1];
	var userId = readCookie("user");
	var user = $('#userIdLink').html();

	$.getJSON( '/users/username/' + user, function(id) {				
		if(userId == id){			
			$('#btnParticipate').attr('onclick', '');
			$('#btnParticipate').removeClass('btn-info');
			$('#btnParticipate').addClass('btn-success');
			$('#btnParticipate').html('UPDATE EVENT');
			$('#btnParticipate').attr('href', '/events/update/' + eventId);
		} else {
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
	});	
}

function donate() {
	var userId = readCookie("user");
	$.getJSON( '/users/id/' + userId, function( data ) {
		if(data.fullName != null && data.fullName != "")
			$('#txtDonator').val(data.fullName);
		else
			$('#txtDonator').val(data.username);

		if(data.email != null)
			$('#txtDonatorEmail').val(data.email);

		if(data.phoneNumber != null)
			$('#txtDonatorPhone').val(data.phoneNumber);
    });
    
    $('#donate-form').dialog('open'); 
}

function confirmDonate() {
	var donation = {
		'eventId': window.location.href.split('/')[window.location.href.split('/').length - 1],
		'donatorName': $('#txtDonator').val(),
		'donatorEmail': $('#txtDonatorEmail').val(),
		'donatorPhoneNumber': $('#txtDonatorPhone').val(),
		'donationItem': $('#txtDonateItem').val(),
		'donationNumber': $('#txtDonateQuantity').val(),
		'status': 'Pending',
		'dateCreated': new Date
	};

	$.ajax({
        type: 'POST',
        data: donation,
        url: '/events/addDonation',
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if(response.msg == '') {
            // Clear the form inputs
            $('#txtDonateQuantity').val('');
        } else {
            alert('Error: ' + response.msg);
        }
    });

    $('#donate-form').dialog('close'); 
}