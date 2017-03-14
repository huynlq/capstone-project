// DOM Ready =============================================================

$(document).ready(function() {
	var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
	$('#event-title').html($('#event-title').html().toUpperCase());

	$.getJSON('/events/details/' + eventId, function(data) {
		$.getJSON('/users/id/' + data.userId, function(dataUser) {
			$('#userIdLink').attr('href', '/users/' + dataUser._id);
			$('#userIdLink').html(dataUser.username);
			populateButtons();
			populateProducer();
			populateSponsors();
		});		
	});
	
	$.getJSON( '/events/donationrequire/' + eventId, function( data ) {
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
        resizable: true,
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
        width: $(window).width() * 80 / 100,
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

    $(".ui-widget-overlay").css({background: "#000", opacity: 0.9});

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
    var items = [];

    //Get required items
    for(var i = 0; i < data.length; i++) {
    	items.push({
    		item: data[i].item.trim(),
    		number: parseInt(data[i].number),
    		unit: data[i].unit.trim(),
    		minimum: parseInt(data[i].minimum),
    		current: 0
    	});
    }

    //Get Donation data from the database
    $.getJSON( '/events/donations/' + window.location.href.split('/')[window.location.href.split('/').length - 1], function( dataDonation ) {

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
        $('#event-other-donation-progress').html('');
        for(var i = 1; i < items.length; i++) {
            current = parseInt(items[i].current);
            required = parseInt(items[i].number);
            $('#event-donation-progress').html( $('#event-donation-progress').html() +
				'<label>' + items[i].item + ': </label> ' + current.toLocaleString() + '/<span id="event-donation">' + required.toLocaleString() + '</span>' +
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
				var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
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
	var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
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
		if(data.role != "Sponsor") {
			$('#txtDonatorId').val(userId);
			if(data.fullName != null && data.fullName != "")
				$('#txtDonator').val(data.fullName);
			else
				$('#txtDonator').val(data.username);

			if(data.email != null)
				$('#txtDonatorEmail').val(data.email);

			if(data.phoneNumber != null)
				$('#txtDonatorPhone').val(data.phoneNumber);			
		} else {			
			$('#txtDonatorId').val(userId);
			$('#txtDonator').val(data.companyName);
			$('#txtDonatorEmail').val(data.companyEmail);
			$('#txtDonatorPhone').val(data.companyPhoneNumber);
			$('#txtDonator').attr('readonly', 'readonly');
			$('#txtDonatorEmail').attr('readonly', 'readonly');
			$('#txtDonatorPhone').attr('readonly', 'readonly');
		}
    });
    
    $('#donate-form').dialog('open'); 
}

function confirmDonate() {
	var donation = {
		'eventId': window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0],
		'userId': $('#txtDonatorId').val(),
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

    $.getJSON( '/users/id/' + $('#txtDonatorId').val(), function( data ) {
    	if(data.role == "Sponsor") {
    		var sponsor = {
    			'eventId': window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0],
				'userId': $('#txtDonatorId').val(),
				'status': 'Pending',
				'dateCreated': new Date()
    		};

    		console.log(sponsor);

    		$.ajax({
		        type: 'POST',
		        data: sponsor,
		        url: '/events/addsponsor',
		        dataType: 'JSON'
		    }).done(function( response ) {
		    	console.log("DONE");
		        // Check for successful (blank) response
		        if(response.msg != '') {
		            alert('Error: ' + response.msg);
		        }
		    });
    	}
    });

    $('#donate-form').dialog('close'); 
}

// Populate sponsors function
function populateSponsors() {
	var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
	$('#sponsorPane').html("");
	var content = "";
	$.ajax({
        url: '/events/featuredsponsor/' + eventId,
        dataType: 'json',
        async: false,
        success: function( dataSponsor ) {			
			if(dataSponsor != '') {				
				var headContent = '<h3>SPONSORS<span id="countSponsors"></span></h3>' +
									'<hr>' +
									'<div id="sponsorCarousel" class="row owl-carousel owl-theme new-owl" style="text-align: center">';

				$('#sponsorPane').html($('#sponsorPane').html() + headContent + '</div>');
				$('#sponsorCarousel').owlCarousel({
					lazyLoad:true,
				    nav:true,
					navigation:true,
					margin:0,
					loop:true,		
					margin:10,
					autoplay:300,
					pagination:false,
					navText: ["<i class='fa fa-angle-double-left'></i>","<i class='fa fa-angle-double-right'></i>"],
    				smartSpeed:500,
					responsive:{
						0:{
							items:1
						},
						300:{
							items:2
						},
						750:{
							items:1
						},		
						1300:{
							items:2
						},
						1600:{
							items:3
						},
					}
				});


				var len = dataSponsor.length;
				$.each(dataSponsor, function(index, element){
					
					$.ajax({
				        url: '/users/id/' + this.userId,
				        dataType: 'json',
				        async: false,
				        success: function( dataUser ){
				        	content = '<div class="item">' +
										    '<a href="/users/' + dataUser._id + '">' +
										    	'<div class="thumb" data-toggle="tooltip" title="' + dataUser.companyName + '" style="background-image: url(\'' + dataUser.companyImage + '\');"/>' +
											'</a>' +
										'</div>';							
							$('#sponsorCarousel').owlCarousel('add', content).owlCarousel('update');
							
						}
					});				
				});

				if(len < 3) {
					for(var i = 0; i < 3 - len; i++) {
						content = '<div class="item">' +
								    '<a onclick="donate()" href="#">' +
								    	'<div class="thumb" data-toggle="tooltip" title="Donate Now!" style="background-image: url(\'https://sd.keepcalm-o-matic.co.uk/i/-im-blank-.png\');"/>' +
									'</a>' +
								'</div>';							
						$('#sponsorCarousel').owlCarousel('add', content).owlCarousel('update');
					}
				}
				//$('.owl-nav').removeClass('disabled');
				
				$('#countSponsors').html(" (" + len + ")");
				$('[data-toggle="tooltip"]').tooltip(); 
			}		
		}
	});	
}