// DOM Ready ===============================================

$(document).ready(function() {
	populateNews();
	populateBoard();
	populateFeaturedEvents();
});

// Functions ===============================================

function initialize() {


	$('#eventCarousel').owlCarousel({
		singleItem:true,
		margin:0,
		loop:true,
		nav:true,
		navigation:true,
		pagination:true,
		navText: ["<i class='fa fa-angle-double-left'></i>","<i class='fa fa-angle-double-right'></i>"],
		responsive:{
			0:{
				items:1
			}
		}
	});

	$("#owl-demo").owlCarousel({
		nav: true,
		navText: ["<i class='fa fa-angle-double-left'></i>","<i class='fa fa-angle-double-right'></i>"],
		lazyLoad: true,
		animateOut: 'fadeOut',
 		pagination: true,
		navigation : true, 
		loop: true,
		autoPlay: 300,
		slideSpeed : 300,
		paginationSpeed : 400,	
		singleItem: true,	
		items : 1, 
		itemsDesktop : false,
		itemsDesktopSmall : false,
		itemsTablet: false,
		itemsMobile : false

	});

	$('.count').each(function () {
		$(this).prop('Counter',0).animate({
			Counter: $(this).text()
		}, {
			duration: 2500,
			easing: 'swing',
			step: function (now) {
				$(this).text(Math.ceil(now).toLocaleString());
			}
		});
	});

	$('.progress .progress-bar').css("width",
		function() {
			return $(this).attr("aria-valuenow") + "%";
		}
	)
}

function CountDown(startTime, endTime) {
	var date = new Date();
	if(date.valueOf() < startTime.valueOf()) {
		return countdown(null, startTime, "HOURS", 2).toString();
	} else if(date.valueOf() >= startTime.valueOf() && date.valueOf() < endTime.valueOf()) {
		return 'Đang diễn ra';
	} else {
		return 'Đã kết thúc';
	}
}

function populateNews() {
	var table = $('#newsPanel').DataTable({"order": [[ 5, "desc" ]]});
	var user = "";
	var counter = 1;
	$.getJSON( '/posts/news', function( data ) {
		$.each(data, function(){
			dateCreated = new Date(this.dateCreated);      
            table.row.add([
                this.rating,
               	'<a href="/posts/' + this._id + '">' + this.postName + '</a>',              
                this.postType,
                this.user,
                this.comment,
                dateCreated.getDate() + '/' + (dateCreated.getMonth() + 1) + '/' +  dateCreated.getFullYear() + ' ' + dateCreated.getHours() + ':'  + dateCreated.getMinutes()
            ]).draw( false );
		});
	});
	$('#newsPanel_wrapper').css('margin-left', '30px');
	$('#newsPanel_wrapper .row').first().css('margin-left', '30px');
	$('#newsPanel_wrapper .row .col-sm-6').first().removeClass("col-sm-6").addClass("col-sm-2");
}


function populateBoard() {
	var table = $('#boardPanel').DataTable({"order": [[ 5, "desc" ]]});
	var user = "";
	var counter = 1;
	$.getJSON( '/posts/board', function( data ) {
		$.each(data, function(){
			dateCreated = new Date(this.dateCreated);      
            table.row.add([
                this.rating,
               	'<a href="/posts/' + this._id + '">' + this.postName + '</a>',              
                this.postType,
                this.user,
                this.comment,
                dateCreated.getDate() + '/' + (dateCreated.getMonth() + 1) + '/' +  dateCreated.getFullYear() + ' ' + dateCreated.getHours() + ':'  + dateCreated.getMinutes()
            ]).draw( false );
		});
	});
	$('#boardPanel_wrapper').css('margin-left', '30px');
	$('#boardPanel_wrapper .row').first().css('margin-left', '30px');
	$('#boardPanel_wrapper .row .col-sm-6').first().removeClass("col-sm-6").addClass("col-sm-2");
}

function populateFeaturedEvents() {
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

	$('#eventCarousel').html("");

	// jQuery AJAX call for JSON
    $.getJSON( '/events/all', function( data ) {
    	$.each(data, function(){
    		console.log(counter);
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

			var percent = 1890000 / parseInt(this.donationNeeded) * 100;

	    	var content = "" +
		        '<div class="eventItem item">' +
				    '<div class="thumb col-lg-3 col.md-10 col.sm-10 col-xs-10" style="background-image: url(\'' + this.image + '\');">' +
				    	'<div id="event' + counter + 'Time" class="time">' +
					    	cd + 
					    '</div>' +
				    '</div>' +
				    '<div class="col-lg-8 col.md-10 col.sm-10 col-xs-10" style="background-color: white">' +					    
					    '<div class="eventInfo clearfix border-bottom p-15 pt-10" style="height: 228px">' +
					    	'<p><span class="text-uppercase text-theme-colored"><strong style="font-size: 20px">' + this.eventName + '</strong></span></p>' + 
					    	'<p class="mb-10 mt-5">' + this.eventDescription.replace(/^(.{200}[^\s]*).*/, "$1") + '...</p>' +
					    	'<ul style="list-style: none">' +
					    		'<li><i class="fa fa-calendar"><span style="margin-left: 10px">' + this.eventDate.split(" - ")[0] + ' - ' + this.meetingTime + '</span></i></li>' +
					    		'<li><i class="fa fa-crosshairs"><span style="margin-left: 10px">' + this.meetingAddress + '</span></i></li>' +
					    	'</ul>' +
					    	'<div class="donate-details">' +						       	
						        '<ul class="pull-left mt-15" style="list-style: none; text-align: right">' +
							        '<li><strong>Tích lũy:</strong> <span class="count">' + parseInt(1890000).toLocaleString() + '</span></li>' +
							        '<li><strong>Mục tiêu:</strong> ' + parseInt(this.donationNeeded).toLocaleString() + '</li>' +
						        '</ul>' +
						        '<a href="events/' + this._id + '" class="btn" style="background-color: #73879C; color: white; float: right" role="button">Chi tiết</a>' +
					       '</div>' +
					    '</div>' +
					    '<div class="progress">' +
							'<div id="progress-event-' + counter + '" class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100" style="width:' + percent + '%">' +
								'<span class="percent"><b><span class="count">' + percent + '</span></b></span>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>' +
	    	"";    	

	    	console.log(content);

	    	//$('#eventCarousel').html($('#eventCarousel').html() + content);

	    	$('#eventCarousel')
			  .owlCarousel('add', content)
			  .owlCarousel('update');	

	    	$('#event' + counter + 'Time').html(CountDown(new Date(dayStart), new Date(dayEnd)));
    	});
    });

    initialize();

	
}