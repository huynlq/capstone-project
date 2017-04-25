		
$(function(){

	var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
	var lang = "vi";
	if(localStorage.getItem('language') == 'en')
		lang = 'en-us';

	/*  Populate map
 	================================================*/ 

 	populateLanguage();

 	//$.getJSON('/events/details/' + eventId, function(data) {
 	$.ajax({
        url: '/events/details/' + eventId,
        dataType: 'json',
        async: false,
        success: function( data ) {
			google.maps.event.addDomListener(window, 'load', populateMap(data));
			var date = new Date(data.eventDate.split(' - ')[0]);
			$('#event-date').html(data.eventDate);
			$('#eventDay').html(date.getDate());
			$('#eventMonthYear').html(date.toLocaleString(lang, { month: "long" }) + ', ' + date.getFullYear());
			$('#eventTime').html(data.meetingTime);
			$('#eventDescription').html(data.eventDescription.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));	
			$('#btnExport').attr('onclick', 'exportReport(\'' + eventId + '\')');
			//$('#btnExport').attr('onclick','exportReport()');
			//populateButton(data);
			populateActivities(eventId);
			populateProducer(eventId);	
			populateTimeline(eventId);
			populateDonationPane(eventId);
			populateParticipants(eventId);
			populateParticipateForm(eventId);
			populateCost(eventId);
			populateEventSponsors(eventId);
			populateGallery(eventId);
			var eventEndDate = new Date($('#event-date').html().split(" - ")[1]);
			var now = new Date();
			if(now.getTime() > eventEndDate.getTime()) {
				populateRating(eventId);
			}			
		}
	}); 	

	//========================== OWL CAROUSEL ==============================

	if( $("#eventsponsor-carousel li").length > 0 ) {

		$("#eventsponsor-carousel").owlCarousel({
			center:true,
			 loop:true,
			 margin:25,
			 stagePadding: 25,
	   		 nav:true,
	   		 navText: [
		      "<i class='glyphicon glyphicon-chevron-left'></i>",
		      "<i class='glyphicon glyphicon-chevron-right'></i>"
		    ],
		    responsive:{
		        0:{
		            items:2
		        },
		        1000:{
		            items:4
		        }
		    }

		});
	}

	//========================== DIALOG HIDING FUNCTIONS ===================

    var donationDialog = $( "#donate-form" ).dialog({
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
                    donationDialog.dialog( "close" );
                }
            }
        }                
    });
});

function exportReport(eventId) {	
	window.open('/export/' + eventId);
}

function populateLanguage() {
	$('#header-desc').html($EVENTDETAILS_HEADER_DESC);
	$('#header-producer').html($EVENTDETAILS_HEADER_PRODUCER);
	$('#header-location').html($EVENTDETAILS_HEADER_LOCATION);
	$('#header-eventDescription').html($EVENTDETAILS_HEADER_EVENTDESC);
	$('#header-activities').html($EVENTDETAILS_HEADER_ACTIVITIES);
	$('#header-donation').html($EVENTDETAILS_HEADER_DONATION);
	$('#header-gallery').html($EVENTDETAILS_HEADER_GALLERY);
	$('#btnJoin').html($EVENTDETAILS_BUTTON_JOIN);
	$('#donate-form').attr('title',$EVENTDETAILS_DONATEFORM_TITLE);
	$('.form-name').attr('placeholder',$EVENTDETAILS_FORM_NAME);
	$('.form-email').attr('placeholder',$EVENTDETAILS_FORM_EMAIL);
	$('.form-phone').attr('placeholder',$EVENTDETAILS_FORM_PHONE);
	$('.form-info').html($EVENTDETAILS_DONATEFORM_INFO);
	$('.form-donate').html($EVENTDETAILS_DONATEFORM_DONATE);
	$('#btnExport').html('<strong>' + $EVENTDETAILS_BUTTON_EXPORT + '</strong>');
}

function populateButton(data) {	
	var now = new Date();
	var eventEndDate = new Date($('#event-date').html().split(" - ")[1]);
	var deadline = new Date(data.eventDeadline);
	eventEndDate.setDate(eventEndDate.getDate() + 1);
	if(eventEndDate.getTime() < now.getTime()){
		$('#eventParticipation').hide();
	} else if(deadline < now.getTime()){
		$('#btnParticipateParticipation').hide();
	} else {
		var userId = readCookie("user");

		if(userId != "") {
			$.getJSON( '/events/participants/' + data._id + '/' + userId, function( dataParticipate ) {
				if(dataParticipate.msg == 'true') {								
					$('#btnParticipate').attr('onclick', 'unjoin()');
					$('#btnParticipate').removeClass('btn-info');
					$('#btnParticipate').addClass('btn-danger');
					$('#btnParticipate').attr('style','width: 50%');
					$('#btnParticipate').html('<strong>' + $EVENTDETAILS_BUTTON_UNJOIN + '</strong>');					
				} else {
					$('#btnParticipate').attr('onclick', 'join()');
					$('#btnParticipate').removeClass('btn-danger');
					$('#btnParticipate').addClass('btn-info');
					$('#btnParticipate').attr('style','width: 50%');
					$('#btnParticipate').html('<strong>' + $EVENTDETAILS_BUTTON_JOIN + '</strong>');	
				}
			});
		}	else {
			$('#btnParticipate').attr('onclick', 'showLogin()');
			$('#btnParticipate').removeAttr('href');
			$('#btnParticipate').html('<strong>' + $EVENTDETAILS_BUTTON_JOIN_REQUIRE + '</strong>');	
		}
	}	
}

function addItem() {
	$('#itemDonationPane').append('<div class="row">' +
										'<div class="col-xs-5 col-xs-12">' +
										  '<input type="text" placeholder="Đồ đóng góp" class="txtItem form-control"/>' +
										'</div>' +
										'<div class="col-xs-3 col-xs-6">' +
										  '<input type="number" placeholder="Số lượng" class="txtItemNumber form-control"/>' +
										'</div>' +
										'<div class="col-xs-3 col-xs-5">' +
										  '<input type="text" placeholder="Đơn vị" class="txtItemUnit form-control"/>' +
										'</div>' +
										'<div class="col-md-1 col-xs-2"><a style="color: red; cursor: pointer" onclick="removeItem(this)"><i class="fa fa-times" aria-hidden="true"></i></a></div>' +
									'</div>')
}

function removeItem(that) {
	$(that).closest('.row').remove();
}

function donate() {
	var userId = readCookie("user");
	var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
	//$('#donationFormItems').html("");
	var content = "";

	for(var i = 0; i < $('.donateItem').length; i++) {
		$('.donateItem')[i].value = "";
	}

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
			for(var i = 0; i < $('.donateItem').length; i++) {				
				$('.donateItem')[i].placeholder = $EVENTDETAILS_DONATION_MINIMUM + ': ' + parseInt($('.donateItemMinimum')[i].innerHTML).toLocaleString() + ' (' + $('.donateItemUnit')[i].innerHTML + ')';
			}
		}
		// $.getJSON( '/events/donationrequire/' + eventId, function( dataDonation ) {
		// 	var counter = 1;
		// 	var placeholder = "";
		// 	$.each(dataDonation, function(){
		// 		if(role = "Sponsor") {
		// 			placeholder = "Sponsor Minimum: " + parseInt(this.minimum).toLocaleString() + " (" + this.unit + ")";
		// 		} else {
		// 			placeholder = "(" + this.unit + ")";
		// 		}
		// 		content += '<div class="row form-group">' +
		// 					  '<label id="txtDonation' + counter + '" class="control-label col-md-2 col-sm-2 col-xs-12">' + this.item + '</label>' +
		// 					  '<div class="col-md-9 col-sm-9 col-xs-12">' +
		// 					    '<input id="txtDonation' + counter + 'Number" type="number" placeholder="' + placeholder + '" required="required" class="form-control col-md-7 col-xs-12"/>' +
		// 					  '</div>' +
		// 					'</div>';
		// 		counter++;
		// 	});
		// 	$('#numOfDonations').html(counter);
		// 	$('#donationFormItems').html(content);
		// });
    });
    
    $('#donate-form').dialog('open'); 
}

function confirmDonate() {
	var requiredFlag = true;	

	if($('#txtDonatorPhone').val() == "") {
		$('#txtDonatorPhone').focus();
		$('#errorDonateMsg').html($EVENTDETAILS_FORM_MSG_REQUIRE);
		requiredFlag = false;
	}

	if($('#txtDonatorEmail').val() == "") {
		$('#txtDonatorEmail').focus();
		$('#errorDonateMsg').html($EVENTDETAILS_FORM_MSG_REQUIRE);
		requiredFlag = false;
	} else if(!validateEmail($('#txtDonatorEmail').val())) {
		$('#txtDonatorEmail').focus();
		$('#errorDonateMsg').html($EVENTDETAILS_FORM_MSG_REQUIRE);
		requiredFlag = false;
	}

	if($('#txtDonator').val() == "") {
		$('#txtDonator').focus();
		$('#errorDonateMsg').html($EVENTDETAILS_FORM_MSG_REQUIRE);
		requiredFlag = false;
	}

	console.log(requiredFlag);

	if(requiredFlag == true) {
		var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
		var userId = readCookie('user');
		var donation;
		var checkFlag = true;
		var value = 0;
		var donationString = "";
		var donateFlag = false;
		var minimumFlag = true;
		var role = "Guest";
		$.ajax({
	        url: '/users/id/' + userId,
	        dataType: 'json',
	        async: false,
	        success: function( data ) {
	        	// Set minimum requirement to false if the user is sponsor
				role = data.role;
				if(role == "Sponsor") {
					minimumFlag = false;
				}
	        }
	    });

		// Check if there are at least one item is being donated and if it pass the minimum requirement
		for(var i = 0; i < $('.donateItem').length; i++) {
			value = $('.donateItem')[i].value;
			minimum = $('.donateItemMinimum')[i].innerHTML;			
			if(value > 0 && value != "") {		
				donateFlag = true;
				if(parseInt(value) > parseInt(minimum))
					minimumFlag = true;
			}
		}

		// If the user fail to meet requirement => Ask if they will donate as user instead of sponsor		
		// if(donateFlag == true && minimumFlag == false) {
		// 	var confirmMinimum = confirm($EVENTDETAILS_ALERT_UNDER_MINIMUM);
		// 	if(!confirmMinimum) {
		// 		donateFlag = false;
		// 	} else {
		// 		donateFlag = true;
		// 	}
		// }

		// If meet all requirement and validation => Donate
		if(donateFlag == true) {
			// Donate each item
			for(var i = 0; i < $('.donateItem').length; i++) {
				value = $('.donateItem')[i].value;
				minimum = $('.donateItemMinimum')[i].innerHTML;			
				if(value > 0 && value != "") {			
					$.ajax({
				        url: '/events/donationrequire/id/' + $('.donateItem')[i].id,
				        dataType: 'json',
				        async: false,
				        success: function( data ) {
				        	console.log(data);
				        	console.log(data.item);
				        	donation = {
								'eventId': eventId,
								'userId': userId,
								'donatorName': $('#txtDonator').val(),
								'donatorEmail': $('#txtDonatorEmail').val(),
								'donatorPhoneNumber': $('#txtDonatorPhone').val(),
								'donationItem': data.item,
								'donationNumber': value,
								'donationUnit': data.unit,
								'status': 'Pending',
								'dateCreated': new Date()
							};

							donationString += data.item + ': ' + value + ' (' + data.unit + ') ';

							$.ajax({
						        type: 'POST',
						        data: donation,
						        url: '/events/addDonation',
						        dataType: 'JSON'
						    }).done(function( response ) {

						        // Check for successful (blank) response
						        if(response.msg == '') {				        				        	

						        } else {
						            showAlert('danger', $LAYOUT_ERROR + response.msg);
						        }
						    });
				        }
				    });			
				}
			}	

			// Create notification for producer
			$.getJSON( '/users/id/' + readCookie('user'), function( data ) {
				var newNotification = {
		            'userId': $('#txtProducerId').val(),
		            'content': data.username + ' đã đóng góp cho sự kiện "' + $('#eventName').html() + '" của bạn.',
		            'link': '/events/update/' + eventId,
		            'markedRead': 'Unread',
		            'dateCreated': new Date()
		        }

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

		            }
		        });

		        // Bring user to pending sponsor to the event
		        if(minimumFlag == true) {		        	
			    	if(role == "Sponsor") {
			    		$.getJSON( '/events/checksponsor/' + eventId + '/' + readCookie('user'), function( dataDonationEvent ) {		    		
			    			// Check if user is in sponsor list
			    			if(dataDonationEvent == null) {
			    				var sponsor = {
					    			'eventId': window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0],
									'userId': readCookie('user'),
									'status': 'Pending',
									'donation': donationString,
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
							        } else {
							        	var newNotification = {
					                        'userId': $('#txtProducerId').val(),
					                        'content': $('#txtDonator').val() + ' muốn làm nhà tài trợ và đóng góp cho sự kiện "' + $('#eventName').html() + '" của bạn.',
					                        'link': '/events/update/' + eventId,
					                        'markedRead': 'Unread',
					                        'dateCreated': new Date()
					                    }

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
					                            showAlert('danger', $LAYOUT_ERROR + response.msg);

					                        }
					                    });
							        }
							    });
			    			}
			    		});    		   	
			    	}
		        }							        
			});	

			// Update the table
	        populateDonationPane(eventId);		        
	        showAlert('success', $EVENTDETAILS_ALERT_DONATE_SUCCESS);
	        $('#donate-form').dialog('close');
			for(var i = 0; i < $('.donateItem').length; i++) {
				$('.donateItem')[i].value = "";
			}
		} else {
			$('#errorDonateMsg').html($EVENTDETAILS_FORM_MSG_DONATE);
		}			

		$.getJSON( '/users/id/' + userId, function( data ) {
			// Set minimum requirement to false if the user is sponsor
			var role = data.role;
			if(role == "Sponsor") {
				minimumFlag = false;
			}

			
		});	
	}	

	// // POST donation request
	// for(var i = 1; i <= parseInt($('#numOfDonations').html()); i++) {
	// 	if($('#txtDonation' + i + 'Number').val() != "" && $('#txtDonation' + i + 'Number').val() > 0) {
	// 		donation = {
	// 			'eventId': window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0],
	// 			'userId': $('#txtDonatorId').val(),
	// 			'donatorName': $('#txtDonator').val(),
	// 			'donatorEmail': $('#txtDonatorEmail').val(),
	// 			'donatorPhoneNumber': $('#txtDonatorPhone').val(),
	// 			'donationItem': $('#txtDonation' + i).html(),
	// 			'donationNumber': $('#txtDonation' + i + 'Number').val(),
	// 			'status': 'Pending',
	// 			'dateCreated': new Date
	// 		};

	// 		$.ajax({
	// 	        type: 'POST',
	// 	        data: donation,
	// 	        url: '/events/addDonation',
	// 	        dataType: 'JSON'
	// 	    }).done(function( response ) {

	// 	        // Check for successful (blank) response
	// 	        if(response.msg == '') {
	// 	            // Clear the form inputs
	// 	        } else {
	// 	            alert('Error: ' + response.msg);
	// 	        }
	// 	    });
	// 	}		
	// }	

	// // POST sponsor request
 //    $.getJSON( '/users/id/' + $('#txtDonatorId').val(), function( data ) {
 //    	if(data.role == "Sponsor") {
 //    		$.getJSON( '/events/donations/' + eventId, function( dataDonationEvent ) {

 //    			// Check if user is in sponsor list
 //    			var flagSponsor = false;
 //    			for(var i = 0; i < dataDonationEvent.length; i++) {
 //    				if(dataDonationEvent[i].userId == readCookie('user'))
 //    					flagSponsor = true;
 //    			}

 //    			// If not, add to pending sponsors
 //    			if(flagSponsor == false) {
 //    				$.getJSON( '/events/donationrequire/' + eventId, function( dataDonation ) {
	// 					var counter = 1;
	// 					var flag = false;
	// 					for(var i = 1; i <= dataDonation.length; i++) {
	// 						console.log(dataDonation[i-1].item + ": " + parseInt($('#txtDonation' + i + 'Number').val()) + " >= " + parseInt(dataDonation[i-1].minimum));
	// 						if(parseInt($('#txtDonation' + i + 'Number').val()) >= parseInt(dataDonation[i-1].minimum))
	// 							flag = true;
	// 					}

	// 					if(flag == true) {
	// 						var sponsor = {
	// 			    			'eventId': window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0],
	// 							'userId': $('#txtDonatorId').val(),
	// 							'status': 'Pending',
	// 							'dateCreated': new Date()
	// 			    		};

	// 			    		console.log(sponsor);

	// 			    		$.ajax({
	// 					        type: 'POST',
	// 					        data: sponsor,
	// 					        url: '/events/addsponsor',
	// 					        dataType: 'JSON'
	// 					    }).done(function( response ) {
	// 					    	console.log("DONE");
	// 					        // Check for successful (blank) response
	// 					        if(response.msg != '') {
	// 					            alert('Error: ' + response.msg);
	// 					        }
	// 					    });
	// 					}
	// 				}); 
 //    			}
 //    		});    		   	
 //    	}
 //    });     
}

// Send sponsor request
function sponsorRequest(dataDonation) {
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


function populateTimeline(eventId) {
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
      if(dates[i].name == $EVENTDETAILS_NOW) {
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
		var mapDatas = [];
		var mapFlag = true;
		for (var i = 0; i < data.length; i++) {
			if(!days.includes(data[i].day)) {
				days.push(data[i].day);
				//$('#mapPane').html($('#mapPane').html() + '<div id="map-' + data[i].day + '"><div id="map-day-' + data[i].day + '" class="mapPane" style="height:200px; margin-top: 20px"></div></div><br>');
				$('#activityDays').html($('#activityDays').html() + '<li id="activity-tab-day-' + data[i].day + '" class="tabClick"><a data-toggle="tab" href="#activity-day-' + data[i].day + '">' + $EVENTDETAILS_ACTIVITY_DAY + ' ' + data[i].day + '</a></li>');
			    $('#activityContents').html(
			      $('#activityContents').html() + 			      			      
			      '<div id="activity-day-' + data[i].day + '" class="tab-pane fade">' +
			      	'<div class="mapTab col-md-4">' +
			      		'<div id="map-day-' + data[i].day + '" class="mapPane" style="height:300px; margin-top: 20px"></div><br>' +
			      	'</div>' +
			      	'<div class="activityTab col-md-8">' +
				        '<table class="table table-striped">' +
				          '<thead>' +
				            '<tr>' +
				              '<th>' + $EVENTDETAILS_ACTIVITY_TIME + '</th>' +
				              '<th>' + $EVENTDETAILS_ACTIVITY_LOCATION + '</th>' +
				              '<th>' + $EVENTDETAILS_ACTIVITY_ACT + '</th>' +
				              '<th>' + $EVENTDETAILS_ACTIVITY_NOTE + '</th>' +
				            '</tr>' +
				          '</thead>' +
				          '<tbody id="activity-table-content-day' + data[i].day + '">' +
				          '</tbody>' +
				        '</table>' +		
				    '</div>' +
			      '</div>');
			}			

			if(data[i].note == undefined)
				data[i].note = "";				

			$('#activity-table-content-day' + data[i].day).html(
		      $('#activity-table-content-day' + data[i].day).html() +
		      '<tr>' +
		        '<td>' + data[i].time + '</td>' +
		        '<td>' + data[i].place + '</td>' +
		        '<td>' + data[i].activity + '</td>' +
		        '<td>' + data[i].note + '</td>' +
		      '</tr>');
			if(data[i].latitude != undefined && data[i].latitude != 'undefined' && data[i].latitude != "") {
				var mapData = {
					day: data[i].day,
					place: data[i].place,
					lat: data[i].latitude,
					lng: data[i].longitude,
					time: data[i].time
				}

				mapDatas.push(mapData);
			} else {
				mapFlag = false;
			}			
		}

		if(mapFlag == true) {
			var counter = 0;
			for(var i = 0; i < days.length; i++) {
				var latlng = [];
				var marker;
				var position;
				var sumLat = 0;
				var sumLng = 0;
				var sum = 0;
				for(var j = 0; j < mapDatas.length; j++) {				
					if(mapDatas[j].day == days[i]) {
						position = new google.maps.LatLng(mapDatas[j].lat,mapDatas[j].lng);
						latlng.push(position);
						sum++;
						sumLat+=parseFloat(mapDatas[j].lat);
						sumLng+=parseFloat(mapDatas[j].lng);
					}				
				}
				var LAT = parseFloat(sumLat/sum);
				var LNG = parseFloat(sumLng/sum);
				console.log(LAT + ' ' + LNG);
				var mapCanvas = document.getElementById("map-day-" + days[i]);			
				var mapOptions = {
					center: new google.maps.LatLng(LAT, LNG),
					zoom: 13,				
				};
				var map = new google.maps.Map(mapCanvas,mapOptions);
				console.log(mapCanvas);
				console.log(mapOptions);
				// var flightPath = new google.maps.Polyline({
				// 	path: latlng,
				// 	strokeColor: "#0000FF",
				// 	strokeOpacity: 0.8,
				// 	strokeWeight: 2
				// });
				// flightPath.setMap(map);		
				var directionsService = new google.maps.DirectionsService;
				var directionsDisplay = new google.maps.DirectionsRenderer({
			    	map: map
			    });	
			    var markers = [];
				for(var j = 0; j < mapDatas.length; j++) {								
					if(mapDatas[j].day == days[i]) {
						// var marker = new google.maps.Marker({
				  //         position: new google.maps.LatLng(mapDatas[j].lat,mapDatas[j].lng),
				  //         map: map
				  //       });
				        markers.push(new google.maps.LatLng(mapDatas[j].lat,mapDatas[j].lng));
				  //       var infowindow = new google.maps.InfoWindow({
						//     content:mapDatas[j].time
						// });
						// infowindow.open(map,marker)
					}				
				}
				calculateAndDisplayRoute(directionsService, directionsDisplay, markers, markers[0], markers[markers.length-1]);				
				
				//$('#activity-tab-day-' + days[i]).attr('onclick', 'refreshMap(' + days[i] + ',' + LAT + ',' + LNG + ')');
				counter++;
				$('#activity-tab-day-' + days[i]).on('click', function(){
					setTimeout(function(){ 
						google.maps.event.trigger(map, 'resize');				  		
				  		map.setZoom(7);
				  		map.setCenter(new google.maps.LatLng(LAT, LNG));
					}, 300);				  
				});
				
			}	
		} else {
			$('.mapTab').removeClass('col-md-4');
			$('.mapPane').attr('style','display:none');
			$('.activityTab').removeClass('col-md-8');
			$('.activityTab').addClass('col-md-12');
		}
		
		for(var i = 0; i < days.length; i++) {
			$('#mapmap-day-' + days[i]).html($("#map-day-" + days[i]));
		}
		$('#activityDays li a').first().click();
	});	
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, waypoints, start, end) {
    var waypts = [];
    var checkboxArray = waypoints;
    for (var i = 0; i < checkboxArray.length; i++) {
        waypts.push({
          location: checkboxArray[i],
          stopover: true
        });
    }
   

    directionsService.route({
      origin: start,
      destination: end,
      waypoints: waypts,
      optimizeWaypoints: false,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
      	showAlert('danger', 'Directions request failed due to ' + status);
      }
    });
  }

function populateProducer(eventId) {
	$.getJSON( '/users/id/' + $('#txtProducerId').val(), function(data) {
		$("#linkCompany").attr('href', '/users/' + data._id);
		$('#txtCompanyImageSrc').attr('src', data.companyImage);
		$('#txtCompanyName').html('<a href="/users/' + data._id + '">' + data.companyName + '</a>');
		$('#txtCompanyPhone').html(data.companyPhoneNumber);
		$('#txtCompanyEmail').html('<a href="mailto:' + data.companyEmail + '">' + data.companyEmail + '</a>');

		if(readCookie('user') == data._id) {
			$('#eventParticipation').html('');
			var btnEdit = "";
			// Check if event has started
			if(new Date($('#event-date').html().split(' - ')[0]).getTime() > new Date().getTime()) {
				// If not started => Enable edit button
				btnEdit = '<div class="col-md-3 col-xs-11"><a href="edit/' + eventId + '" style="background-color:#1f76bd; width: 100%" class="btn btn-info"><strong>' + $EVENTDETAILS_BUTTON_EDIT + '</strong></a></div>';
			} else {
				btnEdit = '<div class="col-md-3 col-xs-11"><a style="width: 100%" class="btn btn-danger" disabled><strong>' + $EVENTDETAILS_BUTTON_EDIT + '</strong></a></div>';
			}

			$('#eventProducerButtons').html('<br><hr><div class="col-md-3"></div>' + btnEdit +
  				'<div class="col-md-3 col-xs-11"><a href="update/' + eventId + '" style="background-color:#1f76bd; width: 100%" class="btn btn-info"><strong>' + $EVENTDETAILS_BUTTON_UPDATE + '</strong></a></div>');
		}
	});
}

function populateDonationPane(eventId) {
	// Populate Donations
	var donationContent = 	'<ul id="donationPane" class="nav nav-tabs">' +
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
				    	'</div>' +
				    	'<a id="btnDonation" style="width: 100%" onclick="donate()" class="btn btn-info"><strong id="btnDonate">ĐÓNG GÓP</strong></a>';

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

	    	donateContent += '<div class="row form-group">'	+
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

	    // Populate Participants
		$.ajax({
	        url: '/events/participants/' + eventId,
	        dataType: 'json',
	        async: false,
	        success: function( data ) {
	        	var counter = 0;
	        	for(var  i = 0; i < data.length; i++) {
	        		if(data[i].status != "Absent")
	        			counter ++;
	        	}
	        	counter = parseInt(counter);
	            var volunteersNeeded = 0;
	            if($('#volunteersNeeded').html() != null && $('#volunteersNeeded').html() != '') {
	            	volunteersNeeded = parseInt($('#volunteersNeeded').html());
	            }	            
	            var volunteerPercent = parseFloat((counter/volunteersNeeded)*100);
	            var status = '';
	            var status2 = '';
	            if(volunteerPercent > 100) {
	            	status = 'progress-bar-success';
	            	status2 = '<i class="fa fa-check" style="color:green" aria-hidden="true"></i>';
	            	volunteerPercent = 100;
	            }
	    		$('#event-donation-progress').html('<label>' + $EVENTDETAILS_HEADER_PARTICIPANT + ': </label> ' + counter.toLocaleString() + '/<span id="event-donation">' + volunteersNeeded.toLocaleString() + ' ' + status2 + '</span>' +
	                '<div class="progress">' +                                 
	                    '<div role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:' + volunteerPercent + '%" class="progress-bar progress-bar-striped ' + status + ' active"></div>' +	                    
	                '</div>');    	
	        }
	    });		
	    

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

function populateParticipants(eventId) {
	$('#tableParticipants').html('');
	var content = '<thead>'+
						'<tr>'+
							'<th>#</th>' +
							'<th>' + $EVENTDETAILS_PARTICIPANT + '</th>' +
						'</tr>' +
					'</thead>' +
					'<tbody></tbody>';
	$('#tableParticipants').html(content);
	var tableParticipants = $('#tableParticipants').DataTable({"columnDefs": [{ "width": "10px", "targets": 0 }]});
	tableParticipants.clear().draw();
	tableParticipants.columns.adjust().draw();
	refreshParticipantTable(eventId);			
}

function refreshParticipantTable(eventId) {	
	var tableParticipants = $('#tableParticipants').DataTable();
	tableParticipants.clear().draw();
	// Populate Participants
	$.ajax({
        url: '/events/participants/' + eventId,
        dataType: 'json',
        async: false,
        success: function( data ) {
        	var counter = 0;
        	var participant;
        	$.each(data, function(){
        		if(this.status != "Absent") {
        			$.getJSON( '/users/id/' + this.userId, function( userData ) {
	        			counter++;
		        		tableParticipants.row.add([
		        			counter,
		        			'<a href="/users/' + userData._id + '">' + userData.username + '</a>'
		        		]).draw('false');
	        		});        		
        		}	        		
        	});
        }
    });
}

function populateParticipateForm(eventId) {
	$.ajax({
	    url: '/events/details/' + eventId,
	    dataType: 'json',
	    async: false,
	    success: function(data) {
	    	// Check if event have meet participate deadline
			var deadlineFlag = false;
			var now = new Date();
			var eventEndDate = new Date($('#event-date').html().split(" - ")[1]);
			var deadline = new Date(data.eventDeadline);
			eventEndDate.setDate(eventEndDate.getDate() + 1);
			console.log(deadline);
			console.log(deadline.getTime());
			console.log(now);
			console.log(now.getTime());
			if(deadline.getTime() < now.getTime()){
				// If deadline have met
				deadlineFlag = true;
			}

			// Check if user is log in
			var userId = readCookie('user');
			if(userId != '' &&  userId != $('#txtProducerId').val()) {
				$.getJSON( '/users/id/' + userId, function( userData ) {
					// If true => Populate form from user data
					$('#txtParticipantFullName').val(userData.fullName);
					$('#txtParticipantEmail').val(userData.email);
					$('#txtParticipantPhone').val(userData.phoneNumber);

					// Check if user have join
					$.getJSON( '/events/participants/' + data._id + '/' + userId, function( dataParticipate ) {
						if(dataParticipate.msg == 'true') {			
							// If joined => Form become read only, button become unjoin	
							$('#txtParticipantFullName').attr('readonly','readonly');
							$('#txtParticipantEmail').attr('readonly','readonly');
							$('#txtParticipantPhone').attr('readonly','readonly');
							$('#btnParticipate').removeClass('btn-info');
							$('#btnParticipate').addClass('btn-danger');
							$('#btnParticipate').attr('onclick','unjoin()');
							$('#btnJoin').html($EVENTDETAILS_BUTTON_UNJOIN);
						} else {
							// If not => Form can be written, button become join	
							$('#txtParticipantFullName').removeAttr('readonly');
							$('#txtParticipantEmail').removeAttr('readonly');
							$('#txtParticipantPhone').removeAttr('readonly');
							$('#btnParticipate').removeClass('btn-danger');
							$('#btnParticipate').addClass('btn-info');
							$('#btnParticipate').attr('onclick','join()');
							$('#btnJoin').html($EVENTDETAILS_BUTTON_JOIN);
						}

						console.log("STATUS:" + deadlineFlag);

						if(deadlineFlag == true) {
							$('#btnParticipate').removeClass('btn-info');
							$('#btnParticipate').addClass('btn-danger');
							$('#btnParticipate').attr('onclick','');
							$('#btnParticipate').attr('disabled','disabled');
							$('#btnJoin').html($EVENTDETAILS_BUTTON_JOIN_ENDED);
						}
					});			
				});
			} else if(userId == '') {
				// If false => Log in button
				$('#participationForm').html('<div class="page-heading text-center">' +
												  '<div class="zoomIn animated">' +
												  	'<h1 style="text-transform: uppercase;" class="page-title">' + $EVENTDETAILS_BUTTON_JOIN_REQUIRE + '<span class="title-under"></span></h1>' +
												    '<br><a onclick="showLogin()" class="btn btn-primary"><strong id="btnJoin">' + $EVENTDETAILS_BUTTON_LOGIN + '</strong></a>' +
												  '</div>' +
												'</div>')
			} else {
				// If is producer => disable form
				$('#participationForm').hide();
			}
	    }
	});	
}

function populateCost(eventId) {
		var content = "";
			content =   '<table id="tableActivityCosts" cellspacing="0" width="100%" class="table table-style-1 table-striped table-bordered dt-responsive nowrap datatable-responsive">'+
							'<thead>'+
								'<tr>'+
									'<th>#</th>'+
									'<th>' + $EVENTDETAILS_ACTIVITY_DAY + '</th>' +
									'<th>' + $EVENTDETAILS_ACTIVITY_LOCATION + '</th>' +
									'<th>' + $EVENTDETAILS_ACTIVITY_ACT + '</th>' +
									'<th>' + $EVENTDETAILS_ACTIVITY_COST + '</th>'+
								'</tr>'+
							'</thead>'+
							'<tbody></tbody>'+
						'</table>';
		console.log(content);
		$('#eventSummary').html(content);

		// var now = new Date();
		// var eventEndDate = new Date($('#event-date').html().split(" - ")[1]);
		// eventEndDate.setDate(eventEndDate.getDate() + 1);
		// if(eventEndDate.getTime() < now.getTime()){
		// 	$('#event-status-header').html('<div class="page-heading text-center">' +
		// 										'<div class="container zoomIn animated">' +
		// 									    	'<h1 style="text-transform: uppercase;" class="page-title">' + $EVENTDETAILS_HEADER_END + '<span class="title-under"></span></h1>' +
		// 									    	'<p class="page-description">' + $EVENTDETAILS_HEADER_END_DESC + '</p>' +
		// 									  	'</div>' +
		// 									'</div>');
		// 	populateRating(eventId);
		// }
		
		var tableActivityCosts = $('#tableActivityCosts').DataTable({"columnDefs": [{ "width": "10px", "targets": 0 }]});
		tableActivityCosts.clear().draw();

		// Populate Activity Costs
		$.ajax({
	        url: '/events/activities/' + eventId,
	        dataType: 'json',
	        async: false,
	        success: function( data ) {
	        	var estimate;
	        	var actual;
	        	var counter = 0;
	        	var actualCost = ""
	        	$.each(data, function(){
	        		actualCost = "";
	        		if(this.actualCost != '' && this.actualCost != null) {
	        			for(var i = 0; i < this.actualCost.length; i++) {
		                    actualCost += '<p>' + this.actualCost[i].item + ': ' + parseInt(this.actualCost[i].cost).toLocaleString() + ' (' + this.actualCost[i].unit + ')</p>';
		                }
	        			counter++;
	        			tableActivityCosts.row.add([
	        				counter,
	        				this.day,
	        				this.place,
	        				this.activity,
	        				actualCost
	        			]).draw('false');
	        		}
	        	});
	        }
	    });			
	//}	
}

function populateGallery(eventId) {	

	// Populate Gallery
	$.ajax({
        url: '/events/photo/' + eventId,
        dataType: 'json',
        async: false,
        success: function( data ) {
        	if(data != '') {
        		$('#photoGallery').html('<div id="photoCarousel" class="owl-carousel owl-theme photo-carousel"></div><br>');
        		var counter = 0;
	        	var content = "";
	        	var content2 = "";
	        	$.each(data, function(){
	        		content = '<div class="item thumb" style="background-image:url(\'' + this.image + '\'); height:400px"></div>';
	        		$('#photoCarousel').html($('#photoCarousel').html() + content);
	        		counter++;
	        	});

	        	$('#photoCarousel').owlCarousel({
				    loop:true,
				    margin:10,
				    nav:false,
				    center:true,
				    pagination:true,
				    autoplay:true,
				    responsive:{
				        0:{
				            items:1
				        },
				        800:{
				            items:2
				        }
				    }
				})
        	} else {
        		$('#galleryPane').hide();
        	}        
        }
    });	
}

function populateRating(eventId) {
	// Populate Rating Panel
	var userId = $('#txtProducerId').val();
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
	    	currentEventRatingContent = "<p>" + $EVENTDETAILS_RATING + ": " + currentEventRating + "/5 " + $EVENTDETAILS_RATING_BY +  " " + dataRating.count + " " + $EVENTDETAILS_RATING_PEOPLE + "</p>";
	    	currentEventRating = parseFloat(dataRating.ratingPoint);
	    }
	});

	$.getJSON( '/events/participants/' + eventId + '/' + readCookie('user'), function( data ) {
		var eventRating = 0;
		var producerRating = 0;
		var ratedContent = "";
		var ratingContent = "";
		var eventRateContent = '<p><i class="fa fa-street-view" style="font-size:48px;"></i></p><p><h2><strong>' + $EVENTDETAILS_HEADER_RATING + '</strong></h2></p>';

		if(data.msg == 'true') {				
			$.getJSON('/events/details/' + eventId, function(eventData) {
				$.ajax({
				    url: '/ratings/id/' + eventId + '/' + readCookie('user'),
				    dataType: 'json',
				    async: false,
				    success: function(dataUserRating) {
				      if(dataUserRating != '' && dataUserRating != null) {
				        eventRating = dataUserRating.ratingPoint;
				        ratedContent =  '<p>' + $EVENTDETAILS_RATED + ' ' + eventRating + ' ' + $EVENTDETAILS_RATED_FOR_EVENT + '</p>';
				        for(var i = 1; i <= 5; i++) {
				        	if(i <= eventRating) {
				        		ratedContent += '<img id="eventRating' + i + '" class="eventRating" src="/images/system/rated-star.png" height="50" style="margin:5px" onmouseover="seeRate(\'event\',' + i + ')" onclick="rate(\'' + eventId + '\',' + i  +')" />';
				        	} else {
				        		ratedContent += '<img id="eventRating' + i + '" class="eventRating" src="/images/system/unrated-star.png" height="50" style="margin:5px" onmouseover="seeRate(\'event\',' + i + ')"  onclick="rate(\'' + eventId + '\',' + i  +')" />';
				        	}
				        }
				        ratedContent += '<p>' + currentEventRatingContent + '</p>';
				      } else {
				      	ratedContent =  '<p>' + $EVENTDETAILS_RATE + '</p>';
				      	for(var i = 1; i <= 5; i++) {
				        	ratedContent += '<img id="eventRating' + i + '" class="eventRating" src="/images/system/unrated-star.png" height="50" style="margin:5px" onmouseover="seeRate(\'event\',' + i + ')"  onclick="rate(\'' + eventId + '\',' + i  +')" />';
				        }
				      }
				    }
				});

				ratingContent += 	'<div class="col-md-12 col-sm-12 col-xs-12" style="text-align:center">' +
										eventRateContent + 
										ratedContent +
									'</div>';

				$('#ratingPane').html('<hr><div class="col-md-1 col-sm-1"></div><div class="col-md-10 col-sm-10 col-xs-12">' + ratingContent + '</div>');
			});
		} else {
			ratedContent =  '<p>' + $EVENTDETAILS_RATE_REQUIRE + '</p>';
	        for(var i = 1; i <= 5; i++) {
	        	if(i <= Math.floor(currentEventRating)) {
	        		ratedContent += '<img id="eventRating' + i + '" class="eventRating" src="/images/system/rated-star.png" height="50" style="margin:5px" />';
	        	} else {
	        		ratedContent += '<img id="eventRating' + i + '" class="eventRating" src="/images/system/unrated-star.png" height="50" style="margin:5px" />';
	        	}
	        }
	        ratedContent += '<p>' + currentEventRatingContent + '</p>';

	        ratingContent += 	'<div class="col-md-12 col-sm-12 col-xs-12" style="text-align:center">' +
	        							eventRateContent + 
										ratedContent +
									'</div>';

			$('#ratingPane').html('<hr><div class="col-md-1 col-sm-1"></div><div class="col-md-10 col-sm-10 col-xs-12">' + ratingContent + '</div>');
		}
	});
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

			var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
			populateRating(eventId);

		}
	});
}

function join() {
	var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
	var userId = readCookie("user");
	if(userId != "") {
		//GET EVENT DATES
		var dates = $('#event-date').html().split(' - ');
		var startDate = new Date(dates[0]).getTime();
		var endDate = new Date(dates[1]).getTime();
		var flag = false;
		var eventDATA;

		//CHECK IF USER HAS JOINED ANY DUPLICATED EVENTS
		$.ajax({
		    url: '/events/getparticipatedevents/' + userId,
		    dataType: 'json',
		    async: false,
		    success: function(eventJoinedData) {
				var eventDates;
				var eventStartDate;
				var eventEndDate;
				$.each(eventJoinedData, function(){
					$.ajax({
					    url: '/events/details/' + this.eventId,
					    dataType: 'json',
					    async: false,
					    success: function(eventData) {
					    	if(eventData != null) {
					    		eventDates = eventData.eventDate.split(' - ');
								eventStartDate = new Date(eventDates[0]).getTime();
								eventEndDate = new Date(eventDates[1]).getTime();							
								if(endDate < eventStartDate || startDate > eventEndDate) {
									
								} else {
									flag = true;
								}
					    	}					    	
					    }
					});
				});
				
				if(flag == false) {
					if($('#txtParticipantFullName').val() != '' && $('#txtParticipantEmail').val() != '' && $('#txtParticipantPhone').val() != '') {
						var userData = {
							'fullName':    $('#txtParticipantFullName').val(),
							'email': 	   $('#txtParticipantEmail').val(),
							'phoneNumber': $('#txtParticipantPhone').val(),
							'dateModified': new Date()
						}

						$.ajax({
						    type: 'PUT',
						    data: userData,
						    url: '/users/updateuser/' + userId,
						    dataType: 'JSON'
						}).done(function( response ) {						    
						    if (response.msg === '') {
						    	//IF USER DOESN'T HAVE ANY DUPLICATED EVENTS						
										
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
							            refreshParticipantTable(eventId);
							            populateParticipateForm(eventId);
							            showAlert('success', $EVENTDETAILS_ALERT_JOIN_SUCCESS);

							            var newNotification = {
					                        'userId': $('#txtProducerId').val(),
					                        'content': $('#txtParticipantFullName').val() + ' đã đăng kí tham gia sự kiện "' + $('#eventName').html() + '" của bạn.',
					                        'link': '/events/update/' + eventId,
					                        'markedRead': 'Unread',
					                        'dateCreated': new Date()
					                    }

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
					                            showAlert('danger', $LAYOUT_ERROR + response.msg);

					                        }
					                    });
							        }
							        else {

							            // If something goes wrong, alert the error message that our service returned
							            showAlert('danger', $LAYOUT_ERROR + response.msg);

							        }
							    });		
						    }
						});						
					} else {
						showAlert('danger', $EVENTDETAILS_FORM_REQUIRE);
					}					
				} else {
					//IF USER HAVE ANY DUPLICATED EVENTS
					showAlert('danger', $EVENTDETAILS_ALERT_DUPLICATE);
				}		
			}
		});		
	} else {
		// If user haven't login, redirect to login page
		showLogin();
	}
}



function unjoin(){
  	var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
	var userId = readCookie("user");
	$.ajax({
        type: 'DELETE',
        url: '/events/removeparticipant/' + eventId + '/' + userId,
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.msg === '') {
            
            // Update the table
            populateParticipateForm(eventId);
            refreshParticipantTable(eventId);
            showAlert('success', $EVENTDETAILS_ALERT_UNJOIN_SUCCESS);

            $.getJSON('/users/id/' + userId, function(data) {
            	var newNotification = {
	                'userId': $('#txtProducerId').val(),
	                'content': data.fullName + ' đã hủy đăng kí tham gia sự kiện "' + $('#eventName').html() + '" của bạn.',
	                'link': '/events/' + eventId,
	                'markedRead': 'Unread',
	                'dateCreated': new Date()
	            }

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
	                    showAlert('danger', $LAYOUT_ERROR + response.msg);

	                }
	            });
            });            
        }
        else {

            // If something goes wrong, alert the error message that our service returned
            showAlert('danger', $LAYOUT_ERROR + response.msg);

        }
    });
}

function populateEventSponsors(eventId) {
	$.ajax({
        url: '/events/sponsor/' + eventId,
        dataType: 'json',
        async: false,
        success: function( data ) {
        	var content = "";

        	if(data.length == 0) {
        		$('#sponsorPane').hide();
        	} else {
        		$.each(data, function(){
	        		$.ajax({
				        url: '/users/id/' + this.userId,
				        dataType: 'json',
				        async: false,
				        success: function( data ) {
			        		content = '<li><a href="/users/' + data._id + '"><img src="' + data.companyImage + '" alt=""/></a></li>';
			        		$('#eventsponsor-carousel').html($('#eventsponsor-carousel').html() + content);
			        	}
			        });
	        	});
        	}        	        
        }
    });	
}