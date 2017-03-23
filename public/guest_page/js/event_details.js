		
$(function(){

	var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];

	/*  Populate map
 	================================================*/ 

 	$.getJSON('/events/details/' + eventId, function(data) {
		google.maps.event.addDomListener(window, 'load', populateMap(data));
		var date = new Date(data.eventDate.split(' - ')[0]);
		$('#event-date').html(data.eventDate);
		$('#eventDay').html(date.getDate());
		$('#eventMonthYear').html(date.toLocaleString("vi", { month: "long" }) + ', ' + date.getFullYear());
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
});

function populateButton(eventId) {	
	var userId = readCookie("user");

	$.getJSON( '/events/participants/' + eventId + '/' + userId, function( data ) {
		if(data.msg == 'true') {
			$('#btnParticipate').attr('readonly', 'readonly');
			$('#btnParticipate').attr('disabled', 'disabled');
			$('#btnParticipate').attr('onclick', '');
			$('#btnParticipate').removeClass('btn-info');
			$('#btnParticipate').addClass('btn-success');
			$('#btnParticipate').html('BẠN ĐÃ THAM GIA');					
		}
	});
}

function populateTimeline(eventId) {
  $.getJSON( '/events/details/' + eventId, function( data ) {     
    var published = {'name':'Ngày tạo','date':new Date(data.dateCreated)};
    var deadline = {'name':'Hạn chót','date':new Date(data.eventDeadline)};
    var start = {'name':'Bắt đầu','date':new Date(data.eventDate.split(' - ')[0])};
    var end = {'name':'Kết thúc','date':new Date(data.eventDate.split(' - ')[1])};
    var now = {'name':'Hiện tại','date':new Date()};
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
      if(dates[i].name == "Hiện tại") {
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
			              '<th>Thời gian</th>' +
			              '<th>Địa điểm</th>' +
			              '<th>Hoạt động</th>' +
			              '<th>Ghi chú</th>' +
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
		}

		$('#activityDays li a').first().click();
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
  				'<div class="col-md-3 col-xs-11"><a href="edit/' + eventId + '" style="background-color:#1f76bd; width: 100%" class="btn btn-info"><strong>' + 'CHỈNH SỬA' + '</strong></a></div>' +
  				'<div class="col-md-3 col-xs-11"><a href="update/' + eventId + '" style="background-color:#1f76bd; width: 100%" class="btn btn-info"><strong>' + 'CẬP NHẬT' + '</strong></a></div>');
		}
	});
}

function populateSummary(eventId) {
	var now = new Date();
	var eventEndDate = new Date($('#event-date').html().split(" - ")[1]);
	eventEndDate.setDate(eventEndDate.getDate() + 1);
	if(eventEndDate.getTime() < now.getTime()){
		var content = "";
			content =   '<hr><div class="page-heading text-center">' +
							'<div class="container zoomIn animated">' +
						    	'<h1 style="text-transform: uppercase;" class="page-title">ĐÃ HẾT HẠN DĂNG KÍ.<span class="title-under"></span></h1>' +
						    	'<p class="page-description">Cám ơn mọi người đã giúp đỡ.</p>' +
						  	'</div>' +
						'</div>' +
						'<h2 class="title-style-2">Tổng kết <span class="title-under"></span></h2>' +
						'<div id="photoGallery" class="row col-md-12 col-sm-12 col-xs-12 fadeIn animated"></div>' +
						'<div class="row">'+
							'<div class="col-md-6 col-sm-6 col-xs-12">' +
								'<h3><strong>Đóng góp</strong></h3>' +
								'<table id="tableDonations" cellspacing="0" width="100%" class="table table-style-1 table-striped table-bordered dt-responsive nowrap datatable-responsive">' +
									'<thead>' +
										'<tr>' +
											'<th>#</th>' +
											'<th>Người góp</th>' +
											'<th>Đồ quyên góp</th>'+
											'<th>Số lượng</th>'+
										'</tr>'+
									'</thead>'+
									'<tbody></tbody>'+
								'</table>'+
							'</div>' +
							'<div class="col-md-1 col-sm-1 col-xs-12"></div>' +
							'<div class="col-md-5 col-sm-5 col-xs-12">' +
								'<h3><strong>Người tham gia</strong></h3>' +
								'<table id="tableParticipants" cellspacing="0" width="100%" class="table table-style-1 table-striped table-bordered dt-responsive nowrap datatable-responsive">'+
									'<thead>'+
										'<tr>'+
											'<th>#</th>'+
											'<th>Tên</th>'+
										'</tr>'+
									'</thead>'+
									'<tbody></tbody>'+
								'</table>'+
							'</div>' +
						'</div>' +
						'<br>' +
						'<div class="col-md-12 col-sm-12 col-xs-12">' +
							'<h3><strong>Chi phí hoạt động</strong></h3>' +
							'<table id="tableActivityCosts" cellspacing="0" width="100%" class="table table-style-1 table-striped table-bordered dt-responsive nowrap datatable-responsive">'+
								'<thead>'+
									'<tr>'+
										'<th>#</th>'+
										'<th>Ngày</th>'+
										'<th>Địa điểm</th>'+
										'<th>Hoạt động</th>'+
										'<th>Chi phí</th>'+
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
        		$('#photoGallery').html('<h3><strong>Hình ảnh</strong></h3><div id="photoCarousel" class="owl-carousel owl-theme photo-carousel"></div><br>');
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
	    	currentEventRatingContent = "<p>" + "Đánh giá" + ": " + currentEventRating + "/5 " + "bởi" +  " " + dataRating.count + " " + "người" + "</p>";
	    	currentEventRating = parseFloat(dataRating.ratingPoint);
	    }
	});



	var currentProducerRatingContent = "";
	var currentProducerRating = 0;
	$.ajax({
	    url: '/ratings/general/' + userId,
	    dataType: 'json',
	    async: false,
	    success: function(dataRating) {
	    	if(dataRating == '' || dataRating == null || dataRating.ratingPoint == null) {
	    		currentProducerRating = 0;
	    	} else {
	    		currentProducerRating = parseFloat(dataRating.ratingPoint);
	    	}
	    	currentProducerRatingContent = "<p>" + "Đánh giá" + ": " + currentProducerRating + "/5 " + "bởi" +  " " + dataRating.count + " " + "người" + "</p>";
	    	
	    }
	});

	$.getJSON( '/events/participants/' + eventId + '/' + readCookie('user'), function( data ) {
		var eventRating = 0;
		var producerRating = 0;
		var ratedContent = "";
		var ratingContent = "";
		var eventRateContent = '<p><i class="fa fa-street-view" style="font-size:48px;"></i></p><p><h2><strong>' + 'ĐÁNH GIÁ SỰ KIỆN' + '</strong></h2></p>';
		var producerRateContent = '<p><i class="fa fa-user-secret" style="font-size:48px;"></i></p><p><h2><strong>' + 'ĐÁNH GIÁ BAN TỔ CHỨC' + '</strong></h2></p>';

		if(data.msg == 'true') {				
			$.getJSON('/events/details/' + eventId, function(eventData) {
				$.ajax({
				    url: '/ratings/id/' + eventId + '/' + readCookie('user'),
				    dataType: 'json',
				    async: false,
				    success: function(dataUserRating) {
				      if(dataUserRating != '' && dataUserRating != null) {
				        eventRating = dataUserRating.ratingPoint;
				        ratedContent =  '<p>' + 'Bạn đã đánh giá' + ' ' + eventRating + ' ' + 'sao cho sự kiện này.' + '</p>';
				        for(var i = 1; i <= 5; i++) {
				        	if(i <= eventRating) {
				        		ratedContent += '<img id="eventRating' + i + '" class="eventRating" src="/images/system/rated-star.png" height="50" style="margin:5px" onmouseover="seeRate(\'event\',' + i + ')" onclick="rate(\'' + eventId + '\',' + i  +')" />';
				        	} else {
				        		ratedContent += '<img id="eventRating' + i + '" class="eventRating" src="/images/system/unrated-star.png" height="50" style="margin:5px" onmouseover="seeRate(\'event\',' + i + ')"  onclick="rate(\'' + eventId + '\',' + i  +')" />';
				        	}
				        }
				        ratedContent += '<p>' + currentEventRatingContent + '</p>';
				      } else {
				      	ratedContent =  '<p>' + 'Hãy đánh giá sự kiện này!' + '</p>';
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
				        ratedContent =  '<p>' + 'Bạn đã đánh giá' + ' ' + producerRating + ' ' + 'sao cho sự kiện này.' + '</p>';
				        for(var i = 1; i <= 5; i++) {
				        	if(i <= producerRating) {
				        		ratedContent += '<img id="producerRating' + i + '" class="producerRating" src="/images/system/rated-star.png" height="50" style="margin:5px" onmouseover="seeRate(\'producer\',' + i + ')"  onclick="rate(\'' + userId + '\',' + i  +')" />';
				        	} else {
				        		ratedContent += '<img id="producerRating' + i + '" class="producerRating" src="/images/system/unrated-star.png" height="50" style="margin:5px" onmouseover="seeRate(\'producer\',' + i + ')"  onclick="rate(\'' + userId + '\',' + i  +')" />';
				        	}
				        }
				        ratedContent += '<p>' + currentProducerRatingContent + '</p>';
				      } else {
				      	ratedContent =  '<p>' + 'Hãy đánh giá sự kiện này!' + '</p>';
				      	for(var i = 1; i <= 5; i++) {
				        	ratedContent += '<img id="producerRating' + i + '" class="producerRating" src="/images/system/unrated-star.png" height="50" style="margin:5px" onmouseover="seeRate(\'producer\',' + i + ')"  onclick="rate(\'' + userId + '\',' + i  +')" />';
				        }
				      }
				    }
				});
				ratingContent += 	'<div class="col-md-6 col-sm-6 col-xs-12" style="text-align:center">' +
										producerRateContent +
										ratedContent +
									'</div>';

				$('#ratingPane').html('<hr><div class="col-md-1 col-sm-1"></div><div class="col-md-10 col-sm-10 col-xs-12">' + ratingContent + '</div>');
			});
		} else {
			ratedContent =  '<p>' + 'Chỉ những thành viên tham gia mới được đánh giá.' + '</p>';
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

			ratedContent =  '<p>' + 'Chỉ những thành viên tham gia mới được đánh giá.' + '</p>';
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
			            populateButton(eventId);

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