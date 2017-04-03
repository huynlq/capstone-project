		
$(function(){

	var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
	var lang = "vi";
	if(localStorage.getItem('language') == 'en')
		lang = 'en-us';

	/*  Populate map
 	================================================*/ 

 	populateLanguage();

 	$.getJSON('/events/details/' + eventId, function(data) {
		google.maps.event.addDomListener(window, 'load', populateMap(data));
		var date = new Date(data.eventDate.split(' - ')[0]);
		$('#event-date').html(data.eventDate);
		$('#eventDay').html(date.getDate());
		$('#eventMonthYear').html(date.toLocaleString(lang, { month: "long" }) + ', ' + date.getFullYear());
		$('#eventTime').html(data.meetingTime);
		$('#eventDescription').html(data.eventDescription.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
		populateSummary(eventId);
	});

 	populateButton(eventId);
	populateActivities(eventId);
	populateProducer(eventId);	
	populateTimeline(eventId);

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

function populateLanguage() {
	$('#header-desc').html($EVENTDETAILS_HEADER_DESC);
	$('#header-producer').html($EVENTDETAILS_HEADER_PRODUCER);
	$('#header-location').html($EVENTDETAILS_HEADER_LOCATION);
	$('#header-eventDescription').html($EVENTDETAILS_HEADER_EVENTDESC);
	$('#header-activities').html($EVENTDETAILS_HEADER_ACTIVITIES);
	$('#btnJoin').html($EVENTDETAILS_BUTTON_JOIN);
	$('#participate-form').attr('title',$EVENTDETAILS_FORM_TITLE);
	$('#form-require').html($EVENTDETAILS_FORM_REQUIRE);
	$('#form-name').html($EVENTDETAILS_FORM_NAME);
	$('#form-email').html($EVENTDETAILS_FORM_EMAIL);
	$('#form-phone').html($EVENTDETAILS_FORM_PHONE);
}

function populateButton(eventId) {	
	var userId = readCookie("user");

	if(userId != "") {
		$.getJSON( '/events/participants/' + eventId + '/' + userId, function( data ) {
			if(data.msg == 'true') {			
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
		$('#btnParticipate').attr('onclick', '');
		$('#btnParticipate').attr('href', '/login');
		$('#btnParticipate').html('<strong>' + $EVENTDETAILS_BUTTON_JOIN_REQUIRE + '</strong>');	
	}
}

function populateDonations() {
	if($('#cashCheck').is(':checked'))
		$('#cashDonation').show();
	else
		$('#cashDonation').hide();

	if($('#itemCheck').is(':checked'))
		$('#itemDonation').show();
	else
		$('#itemDonation').hide();
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
1}

function donate() {
	var userId = readCookie("user");
	var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
	//$('#donationFormItems').html("");
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
	var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
	var userId = readCookie('user');
	var donation;
	var checkFlag = true;

	// VALIDATING
	if($('#cashCheck').is(':checked')) {
		if($('#txtCash').val().trim() != '') {
			
		} else {
			checkFlag = false;
			showAlert('danger', 'Vui lòng điền các trường còn thiếu.');
		}
	}

	if($('#itemCheck').is(':checked')) {
		for(var i = 0; i < $('.txtItem').length; i++) {
			if($('.txtItem')[i].value.trim() != '' && $('.txtItemNumber')[i].value.trim() != '' && $('.txtItemUnit')[i].value.trim() != '') {

			} else {
				checkFlag = false;
				showAlert('danger', 'Vui lòng điền các trường còn thiếu.');
			}
		}
	}

	// AFTER VALIDATE
	if(checkFlag) {
		var submitFlag = true;
		var donationString = "";
		if($('#cashCheck').is(':checked')) {
			donationString += $EVENTDETAILS_DONATION_CASH + ' (' + parseInt($('#txtCash').val().trim()).toLocaleString() + ' ' + $('#txtCashUnit').val().trim() + ')';
			donation = {
				'eventId': eventId,
				'userId': userId,
				'donatorName': $('#txtDonator').val(),
				'donatorEmail': $('#txtDonatorEmail').val(),
				'donatorPhoneNumber': $('#txtDonatorPhone').val(),
				'donationType': 'Cash',
				'donationNumber': $('#txtCash').val().trim(),
				'donationUnit': $('#txtCashUnit').val().trim(),
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
		            // Do nothing
		        } else {
		            showAlert('danger', $LAYOUT_ERROR + response.msg);
		            submitFlag = false;
		        }
		    });
		}

		if($('#itemCheck').is(':checked')) {
			for(var i = 0; i < $('.txtItem').length; i++) {
				donationString += ', ' + $('.txtItem')[i].value.trim() + ' (' + parseInt($('.txtItemNumber')[i].value.trim()).toLocaleString() + ' ' + $('.txtItemUnit')[i].value.trim() + ')';
				donation = {
					'eventId': eventId,
					'userId': userId,
					'donatorName': $('#txtDonator').val(),
					'donatorEmail': $('#txtDonatorEmail').val(),
					'donatorPhoneNumber': $('#txtDonatorPhone').val(),
					'donationType': 'Item',
					'donationItem': $('.txtItem')[i].value.trim(),
					'donationNumber': $('.txtItemNumber')[i].value.trim(),
					'donationUnit': $('.txtItemUnit')[i].value.trim(),
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
			            // Do nothing			            
			        } else {
			            showAlert('danger', $LAYOUT_ERROR + response.msg);
			            submitFlag = false;
			        }
			    });
			}
		}

		if(submitFlag == true) {
			showAlert('success', $EVENTDETAILS_ALERT_DONATE_SUCCESS);

			// CHECK FOR SPONSOR
			$.getJSON( '/users/id/' + readCookie('user'), function( data ) {
		    	if(data.role == "Sponsor") {
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
						        }
						    });
		    			}
		    		});    		   	
		    	}
	    	});   
		}

    	$('#donate-form').dialog('close'); 
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
			      	'<div id="map-day-' + data[i].day + '" class="mapPane" style="height:200px; margin-top: 20px"></div><br>' +
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
			$('.mapPane').attr('style','display:none');
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
			$('#eventProducerButtons').html('<br><hr><div class="col-md-3"></div>' +
  				'<div class="col-md-3 col-xs-11"><a href="edit/' + eventId + '" style="background-color:#1f76bd; width: 100%" class="btn btn-info"><strong>' + $EVENTDETAILS_BUTTON_EDIT + '</strong></a></div>' +
  				'<div class="col-md-3 col-xs-11"><a href="update/' + eventId + '" style="background-color:#1f76bd; width: 100%" class="btn btn-info"><strong>' + $EVENTDETAILS_BUTTON_UPDATE + '</strong></a></div>');
		}
	});
}

function populateSummary(eventId) {
	var now = new Date();
	var eventEndDate = new Date($('#event-date').html().split(" - ")[1]);
	eventEndDate.setDate(eventEndDate.getDate() + 1);
	if(eventEndDate.getTime() < now.getTime()){
		var content = "";
			content =   '<div class="row">' +
							'<div class="col-md-3"></div>' +
							'<div class="col-md-6 col-xs-12">' +
								'<a id="btnDonation" style="width: 100%" onclick="donate()" class="btn btn-info"><strong id="btnDonate">ĐÓNG GÓP</strong></a>' +
							'</div>' +
						'</div>' +
						'<hr><div class="page-heading text-center">' +
							'<div class="container zoomIn animated">' +
						    	'<h1 style="text-transform: uppercase;" class="page-title">' + $EVENTDETAILS_HEADER_END + '<span class="title-under"></span></h1>' +
						    	'<p class="page-description">' + $EVENTDETAILS_HEADER_END_DESC + '</p>' +
						  	'</div>' +
						'</div>' +
						'<h2 class="title-style-2">' + $EVENTDETAILS_HEADER_SUMMARY + ' <span class="title-under"></span></h2>' +
						'<div id="photoGallery" class="row col-md-12 col-sm-12 col-xs-12 fadeIn animated"></div>' +
						'<div class="row">'+
							'<div class="col-md-6 col-sm-6 col-xs-12">' +
								'<h3><strong>' + $EVENTDETAILS_HEADER_DONATION + '</strong></h3>' +
								'<ul id="donationPane" class="nav nav-tabs">' +
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
							    '</div>' +
							'</div>' +
							'<div class="col-md-1 col-sm-1 col-xs-12"></div>' +
							'<div class="col-md-5 col-sm-5 col-xs-12">' +
								'<h3><strong>' + $EVENTDETAILS_HEADER_PARTICIPANT + '</strong></h3>' +
								'<table id="tableParticipants" cellspacing="0" width="100%" class="table table-style-1 table-striped table-bordered dt-responsive nowrap datatable-responsive">'+
									'<thead>'+
										'<tr>'+
											'<th>#</th>'+
											'<th>' + $EVENTDETAILS_PARTICIPANT + '</th>'+
										'</tr>'+
									'</thead>'+
									'<tbody></tbody>'+
								'</table>'+
							'</div>' +
						'</div>' +
						'<br>' +
						'<div class="col-md-12 col-sm-12 col-xs-12">' +
							'<h3><strong>' + $EVENTDETAILS_HEADER_COST + '</strong></h3>' +
							'<table id="tableActivityCosts" cellspacing="0" width="100%" class="table table-style-1 table-striped table-bordered dt-responsive nowrap datatable-responsive">'+
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
							'</table>'+
						'</div>' +						
						'<hr>';
		console.log(content);
		$('#eventSummary').html(content);

		var tableParticipants = $('#tableParticipants').DataTable({"columnDefs": [{ "width": "10px", "targets": 0 }]});
		tableParticipants.clear().draw();
		tableParticipants.columns.adjust().draw();

		var tableDonations = $('#tableDonations').DataTable({"columnDefs": [{ "width": "10px", "targets": 0 }]});
		tableDonations.clear().draw();
		var tablePendingDonations = $('#tablePendingDonations').DataTable({"columnDefs": [{ "width": "10px", "targets": 0 }]});
		tablePendingDonations.clear().draw();
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
	        	$.each(data, function(){	        		
	        		if(this.donationType == 'Cash') {
	        			item = $EVENTDETAILS_DONATION_CASH;	
	        		} else {
	        			item = this.donationItem;
	        		}	        		
	    			number = parseInt(this.donationNumber).toLocaleString();

	    			if(this.status == "Approved") {
	    				counterApproved++;
	    				tableDonations.row.add([
		        			counterApproved,
		        			'<a href="">' + this.donatorName + '</a>',
		        			item,
				        	number + ' ' + this.donationUnit
		        		]).draw('false');	        		
	    			} else {
	    				counterPending++;
	    				tablePendingDonations.row.add([
		        			counterPending,
		        			'<a href="">' + this.donatorName + '</a>',
		        			item,
				        	number + ' ' + this.donationUnit
		        		]).draw('false');	        		
	    			}        			
	        	});
	        }
	    });
	    $('#donationPane li a').first().click();

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
	        		if(this.actualCost != '' && this.actualCost != null) {
	        			counter++;
	        			tableActivityCosts.row.add([
	        				counter,
	        				this.day,
	        				this.place,
	        				this.activity,
	        				this.actualCost
	        			]).draw('false');
	        		}
	        	});
	        }
	    });	
	    populateGallery(eventId);
		populateRating(eventId);
	}	
}

function populateGallery(eventId) {	

	// Populate Gallery
	$.ajax({
        url: '/events/photo/' + eventId,
        dataType: 'json',
        async: false,
        success: function( data ) {
        	if(data != '') {
        		$('#photoGallery').html('<h3><strong>' + $EVENTDETAILS_HEADER_GALLERY + '</strong></h3><div id="photoCarousel" class="owl-carousel owl-theme photo-carousel"></div><br>');
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
					    	eventDates = eventData.eventDate.split(' - ');
							eventStartDate = new Date(eventDates[0]).getTime();
							eventEndDate = new Date(eventDates[1]).getTime();							
							if(endDate < eventStartDate || startDate > eventEndDate) {
								
							} else {
								flag = true;
							}
					    }
					});
				});
				
				if(flag == false) {
					//IF USER DOESN'T HAVE ANY DUPLICATED EVENTS
					$.getJSON( '/users/id/' + userId, function( data ) {
						if(data.fullName != null && data.fullName != '' && data.phoneNumber != null && data.phoneNumber != '' && data.email != null && data.email != '') {
							
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
						            populateButton(eventId);
						            showAlert('success', $EVENTDETAILS_ALERT_JOIN_SUCCESS);
						        }
						        else {

						            // If something goes wrong, alert the error message that our service returned
						            showAlert('danger', $LAYOUT_ERROR + response.msg);

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
					//IF USER HAVE ANY DUPLICATED EVENTS
					showAlert('danger', $EVENTDETAILS_ALERT_DUPLICATE);
				}		
			}
		});		
	} else {
		// If user haven't login, redirect to login page
		window.location.href = "/login";
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
            populateButton(eventId);
            showAlert('success', $EVENTDETAILS_ALERT_UNJOIN_SUCCESS);
        }
        else {

            // If something goes wrong, alert the error message that our service returned
            showAlert('danger', $LAYOUT_ERROR + response.msg);

        }
    });
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
		    showAlert('danger', $LAYOUT_ERROR + response.msg);
		}
	});
}