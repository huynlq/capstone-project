// DOM Ready =============================================================

$(document).ready(function() {
	var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
	$('#event-title').html($('#event-title').html().toUpperCase());

	$.getJSON('/events/details/' + eventId, function(data) {
		google.maps.event.addDomListener(window, 'load', populateMap(data));
		$.getJSON('/users/id/' + data.userId, function(dataUser) {
			$('#userIdLink').attr('href', '/users/' + dataUser._id);
			$('#userIdLink').html(dataUser.username);
			populateProducer();
			populateButtons();			
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

function populateMap(data) {
	console.log(data.eventName);
    var mapOptions = {
        zoom: 17,
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
        for(var i = 0; i < items.length; i++) {
            current = parseInt(items[i].current);
            required = parseInt(items[i].number);
            console.log(items[i].item + ": " + current + '/' + required);
            $('#event-donation-progress').html( $('#event-donation-progress').html() +
				'<label>' + items[i].item + ': </label> ' + current.toLocaleString() + '/<span id="event-donation">' + required.toLocaleString() + ' (' + items[i].unit + ')</span>' +
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
		$('#linkCompany').attr('href','/users/' + id);
		$('#userIdLink').attr('href', '/users/' + id);
		$.getJSON( '/users/id/' + id, function(data) {
			$('#txtCompanyImageSrc').attr('src', data.companyImage);
			$('#txtCompanyName').html(data.companyName);
			$('#txtCompanyAddress').html(data.companyAddress);
			$('#txtCompanyPhone').html(data.companyPhoneNumber);
			$('#txtCompanyEmail').html(data.companyEmail);		
			$('#txtProducerId').val(data._id);			
			$.ajax({
			    url: '/ratings/general/' + data._id,
			    dataType: 'json',
			    async: false,
			    success: function(dataRating) {
			    	var currentProducerRatingContent = "";
					var currentProducerRating = 0;
			    	if(dataRating == '' || dataRating == null || dataRating.ratingPoint == null) {
			    		currentProducerRating = 0;
			    	} else {
			    		currentProducerRating = parseFloat(dataRating.ratingPoint);
			    	}
			    	for(var i = 1; i <= 5; i++) {
			        	if(i <= Math.floor(currentProducerRating)) {
			        		currentProducerRatingContent += '<img id="producerRating' + i + '" class="producerRating" src="/images/system/rated-star.png" height="15" style="margin:2px" />';
			        	} else {
			        		currentProducerRatingContent += '<img id="producerRating' + i + '" class="producerRating" src="/images/system/unrated-star.png" height="15" style="margin:2px" />';
			        	}
			        }
			        currentProducerRatingContent += '<span style="margin-left: 15px">' + currentProducerRating + '/5 (' + dataRating.count + ' votes)</span>';
			        $('#txtCompanyRating').html(currentProducerRatingContent);
			    }
			});
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
			populateSummary();
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
				populateSummary();
			});
		}
	});	
}

function donate() {
	var userId = readCookie("user");
	var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
	$('#donationFormItems').html("");
	var content = "";
	$.getJSON( '/users/id/' + userId, function( data ) {
		var role = data.role;
		if(role != "Sponsor") {
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
		$.getJSON( '/events/donationrequire/' + eventId, function( dataDonation ) {
			var counter = 1;
			var placeholder = "";
			$.each(dataDonation, function(){
				if(role = "Sponsor") {
					placeholder = "Sponsor Minimum: " + parseInt(this.minimum).toLocaleString() + " (" + this.unit + ")";
				} else {
					placeholder = "(" + this.unit + ")";
				}
				content += '<div class="row form-group">' +
							  '<label id="txtDonation' + counter + '" class="control-label col-md-2 col-sm-2 col-xs-12">' + this.item + '</label>' +
							  '<div class="col-md-9 col-sm-9 col-xs-12">' +
							    '<input id="txtDonation' + counter + 'Number" type="number" placeholder="' + placeholder + '" required="required" class="form-control col-md-7 col-xs-12"/>' +
							  '</div>' +
							'</div>';
				counter++;
			});
			$('#numOfDonations').html(counter);
			$('#donationFormItems').html(content);
		});
    });
    
    $('#donate-form').dialog('open'); 
}

function confirmDonate() {
	var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
	var donation;

	// POST donation request
	for(var i = 1; i <= parseInt($('#numOfDonations').html()); i++) {
		if($('#txtDonation' + i + 'Number').val() != "" && $('#txtDonation' + i + 'Number').val() > 0) {
			donation = {
				'eventId': window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0],
				'userId': $('#txtDonatorId').val(),
				'donatorName': $('#txtDonator').val(),
				'donatorEmail': $('#txtDonatorEmail').val(),
				'donatorPhoneNumber': $('#txtDonatorPhone').val(),
				'donationItem': $('#txtDonation' + i).html(),
				'donationNumber': $('#txtDonation' + i + 'Number').val(),
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
		        } else {
		            alert('Error: ' + response.msg);
		        }
		    });
		}		
	}	

	// POST sponsor request
    $.getJSON( '/users/id/' + $('#txtDonatorId').val(), function( data ) {
    	if(data.role == "Sponsor") {
    		$.getJSON( '/events/donations/' + eventId, function( dataDonationEvent ) {

    			// Check if user is in sponsor list
    			var flagSponsor = false;
    			for(var i = 0; i < dataDonationEvent.length; i++) {
    				if(dataDonationEvent[i].userId == readCookie('user'))
    					flagSponsor = true;
    			}

    			// If not, add to pending sponsors
    			if(flagSponsor == false) {
    				$.getJSON( '/events/donationrequire/' + eventId, function( dataDonation ) {
						var counter = 1;
						var flag = false;
						for(var i = 1; i <= dataDonation.length; i++) {
							console.log(dataDonation[i-1].item + ": " + parseInt($('#txtDonation' + i + 'Number').val()) + " >= " + parseInt(dataDonation[i-1].minimum));
							if(parseInt($('#txtDonation' + i + 'Number').val()) >= parseInt(dataDonation[i-1].minimum))
								flag = true;
						}

						if(flag == true) {
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
    				autoplayHoverPause:true,
					responsiveRefreshRate : 10,
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

				$('#sponsorCarousel li').on('mouseenter',function(e){
					$(this).closest('.owl-carousel').trigger('play.owl.autoplay');
				})

				$('#sponsorCarousel li').on('mouseleave',function(e){
					$(this).closest('.owl-carousel').trigger('stop.owl.autoplay');
				})


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

//Populate Event Summary
function populateSummary() {
	var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];	
	var now = new Date();
	var eventEndDate = new Date($('#event-date').html().split(" - ")[1]);
	//eventEndDate.setDate(eventEndDate.getDate() + 1);
	if(eventEndDate.getTime() < now.getTime()){

		// Populate Rating Panel
		var currentEventRatingContent = "";
		var currentEventRating = 0;
		$.ajax({
		    url: '/ratings/general/' + eventId,
		    dataType: 'json',
		    async: false,
		    success: function(dataRating) {
		    	if(dataRating == '' || dataRating == null || dataRating.ratingPoint == null) {
		    		currentEventRating = 0;
		    	} else {
		    		currentEventRating = parseFloat(dataRating.ratingPoint);
		    	}
		    	currentEventRatingContent = "<p>Rating: " + currentEventRating + "/5 by " + dataRating.count + " user(s).</p>";
		    	currentEventRating = parseFloat(dataRating.ratingPoint);
		    }
		});



		var currentProducerRatingContent = "";
		var currentProducerRating = 0;
		$.ajax({
		    url: '/ratings/general/' + $('#txtProducerId').val(),
		    dataType: 'json',
		    async: false,
		    success: function(dataRating) {
		    	if(dataRating == '' || dataRating == null || dataRating.ratingPoint == null) {
		    		currentProducerRating = 0;
		    	} else {
		    		currentProducerRating = parseFloat(dataRating.ratingPoint);
		    	}
		    	currentProducerRatingContent = "<p>Rating: " + currentProducerRating + "/5 by " + dataRating.count + " user(s).</p>";
		    	
		    }
		});

		$.getJSON( '/events/participants/' + eventId + '/' + readCookie('user'), function( data ) {
			var eventRating = 0;
			var producerRating = 0;
			var ratedContent = "";
			var ratingContent = "";
			var eventRateContent = '<p><i class="fa fa-street-view" style="font-size:48px;"></i></p><p><h2><strong>EVENT RATING</strong></h2></p>';
			var producerRateContent = '<p><i class="fa fa-user-secret" style="font-size:48px;"></i></p><p><h2><strong>PRODUCER RATING</strong></h2></p>';

			if(data.msg == 'true') {				
				$.getJSON('/events/details/' + eventId, function(eventData) {
					$.ajax({
					    url: '/ratings/id/' + eventId + '/' + readCookie('user'),
					    dataType: 'json',
					    async: false,
					    success: function(dataUserRating) {
					      if(dataUserRating != '' && dataUserRating != null) {
					        eventRating = dataUserRating.ratingPoint;
					        ratedContent =  '<p>You have rated ' + eventRating + ' stars for this event.</p>';
					        for(var i = 1; i <= 5; i++) {
					        	if(i <= eventRating) {
					        		ratedContent += '<img id="eventRating' + i + '" class="eventRating" src="/images/system/rated-star.png" height="50" style="margin:5px" onmouseover="seeRate(\'event\',' + i + ')" onclick="rate(\'' + eventId + '\',' + i  +')" />';
					        	} else {
					        		ratedContent += '<img id="eventRating' + i + '" class="eventRating" src="/images/system/unrated-star.png" height="50" style="margin:5px" onmouseover="seeRate(\'event\',' + i + ')"  onclick="rate(\'' + eventId + '\',' + i  +')" />';
					        	}
					        }
					        ratedContent += '<p>' + currentEventRatingContent + '</p>';
					      } else {
					      	ratedContent =  '<p>Please rate this event!</p>';
					      	for(var i = 1; i <= 5; i++) {
					        	ratedContent += '<img id="eventRating' + i + '" class="eventRating" src="/images/system/unrated-star.png" height="50" style="margin:5px" onmouseover="seeRate(\'event\',' + i + ')"  onclick="rate(\'' + eventId + '\',' + i  +')" />';
					        }
					      }
					    }
					});

					ratingContent += 	'<div class="col-md-6 col-sm-6 col-xs-12" style="text-align:center">' +
											eventRateContent + 
											ratedContent +
										'</div>';


					var userId = eventData.userId
					$.ajax({
					    url: '/ratings/id/' + eventData.userId + '/' + readCookie('user'),
					    dataType: 'json',
					    async: false,
					    success: function(dataUserRating) {
					      if(dataUserRating != '' && dataUserRating != null) {
					        producerRating = dataUserRating.ratingPoint;
					        ratedContent =  '<p>You have rated ' + producerRating + ' stars for this producer.</p>';
					        for(var i = 1; i <= 5; i++) {
					        	if(i <= producerRating) {
					        		ratedContent += '<img id="producerRating' + i + '" class="producerRating" src="/images/system/rated-star.png" height="50" style="margin:5px" onmouseover="seeRate(\'producer\',' + i + ')"  onclick="rate(\'' + userId + '\',' + i  +')" />';
					        	} else {
					        		ratedContent += '<img id="producerRating' + i + '" class="producerRating" src="/images/system/unrated-star.png" height="50" style="margin:5px" onmouseover="seeRate(\'producer\',' + i + ')"  onclick="rate(\'' + userId + '\',' + i  +')" />';
					        	}
					        }
					        ratedContent += '<p>' + currentProducerRatingContent + '</p>';
					      } else {
					      	ratedContent =  '<p>Please rate this producer!</p>';
					      	for(var i = 1; i <= 5; i++) {
					        	ratedContent += '<img id="producerRating' + i + '" class="producerRating" src="/images/system/unrated-star.png" height="50" style="margin:5px" onmouseover="seeRate(\'producer\',' + i + ')"  onclick="rate(\'' + userId + '\',' + i  +')" />';
					        }
					      }
					    }
					});
					console.log("RATE: " + ratedContent);
					ratingContent += 	'<div class="col-md-6 col-sm-6 col-xs-12" style="text-align:center">' +
											producerRateContent +
											ratedContent +
										'</div>';

					$('#ratingPane').html('<hr><div class="col-md-1 col-sm-1"></div><div class="col-md-10 col-sm-10 col-xs-12">' + ratingContent + '</div>');
				});
			} else {
				ratedContent =  '<p>Only participants can rate.</p>';
		        for(var i = 1; i <= 5; i++) {
		        	if(i <= Math.floor(currentEventRating)) {
		        		ratedContent += '<img id="eventRating' + i + '" class="eventRating" src="/images/system/rated-star.png" height="50" style="margin:5px" />';
		        	} else {
		        		ratedContent += '<img id="eventRating' + i + '" class="eventRating" src="/images/system/unrated-star.png" height="50" style="margin:5px" />';
		        	}
		        }
		        ratedContent += '<p>' + currentEventRatingContent + '</p>';

		        ratingContent += 	'<div class="col-md-6 col-sm-6 col-xs-12" style="text-align:center">' +
		        							eventRateContent + 
											ratedContent +
										'</div>';

				ratedContent =  '<p>Only participants can rate.</p>';
		        for(var i = 1; i <= 5; i++) {
		        	if(i <= Math.floor(currentProducerRating)) {
		        		ratedContent += '<img id="producerRating' + i + '" class="producerRating" src="/images/system/rated-star.png" height="50" style="margin:5px" />';
		        	} else {
		        		ratedContent += '<img id="producerRating' + i + '" class="producerRating" src="/images/system/unrated-star.png" height="50" style="margin:5px" />';
		        	}
		        }
		        ratedContent += '<p>' + currentProducerRatingContent + '</p>';

		        ratingContent += 	'<div class="col-md-6 col-sm-6 col-xs-12" style="text-align:center">' +
		        							producerRateContent +
											ratedContent +
										'</div>';

				$('#ratingPane').html('<hr><div class="col-md-1 col-sm-1"></div><div class="col-md-10 col-sm-10 col-xs-12">' + ratingContent + '</div>');
			}
		});

		$('#btnParticipate').attr('disabled','disabled');
		$('#btnParticipate').removeClass('btn-info');
		$('#btnParticipate').removeClass('btn-success');
		$('#btnParticipate').addClass('btn-dark');
		$('#btnParticipate').html('EVENT ENDED');

		var content = "";
		content = 	'<div class="col-md-1 col-sm-1"></div>'+
					'<div class="col-md-9 col-sm-9 col-xs-12">'+
						'<h3>EVENT SUMMARY</h3>'+
						'<hr/>'+
						'<div class="row">'+
							'<div class="col-md-6 col-sm-6 col-xs-12">' +
								'<h4>Donations</h4>' +
								'<table id="tableDonations" cellspacing="0" width="100%" class="table table-striped table-bordered dt-responsive nowrap datatable-responsive">' +
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
								'<h4>Participants</h4>' +
								'<table id="tableParticipants" cellspacing="0" width="100%" class="table table-striped table-bordered dt-responsive nowrap datatable-responsive">'+
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
							'<h4>Activity Costs</h4>' +
							'<table id="tableActivityCosts" cellspacing="0" width="100%" class="table table-striped table-bordered dt-responsive nowrap datatable-responsive">'+
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
						'</div>' +
					'</div>';
		console.log(content);
		$('#eventSummary').html(content);

		var tableParticipants = $('#tableParticipants').DataTable({"columnDefs": [{ "width": "10px", "targets": 0 }]});
		tableParticipants.clear().draw();
		tableParticipants.columns.adjust().draw();

		var tableDonations = $('#tableDonations').DataTable({"columnDefs": [{ "width": "10px", "targets": 0 }]});
		tableDonations.clear().draw();
		var tableActivityCosts = $('#tableActivityCosts').DataTable({"columnDefs": [{ "width": "10px", "targets": 0 }]});
		tableActivityCosts.clear().draw();

		$('#tableParticipants_wrapper .row').first().css('margin-left', '30px');
		$('#tableParticipants_wrapper .row .col-sm-6').first().removeClass("col-sm-6").addClass("col-sm-2");

		$('#tableDonations_wrapper .row').first().css('margin-left', '30px');
		$('#tableDonations_wrapper .row .col-sm-6').first().removeClass("col-sm-6").addClass("col-sm-2");

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
				        			number + ' ' + unit
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
}

function seeRate(name, rate) {
	for(var i = 1; i <= 5; i++) {
		if(i <= rate) {
			$('#' + name + 'Rating' + i).attr('src','/images/system/rated-star.png');
		} else {
			$('#' + name + 'Rating' + i).attr('src','/images/system/unrated-star.png');
		}
	}
}

function rate(id, rate) {
	var userId = readCookie('user');
	var rating = {
		'userId': userId,
		'subjectId': id,
		'ratingPoint': rate
	};

	$.ajax({
		type: 'POST',
		data: rating,
		url: '/ratings/updaterating',
		dataType: 'JSON'
	}).done(function( response ) {

		// Check for successful (blank) response
		if (response.msg !== '') {

			// If something goes wrong, alert the error message that our service returned
			alert('Error: ' + response.msg);

		} else {

			populateSummary();

		}
	});
}