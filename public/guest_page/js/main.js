		
$(function(){

	/*  Populate countdown
 	================================================*/ 

 	populateEvents();
 	populateSponsors();
 	populateNews();


	/*  Gallery lightBox
 	================================================*/ 

 	if( $(".lightbox").length > 0 ) {

		$(".lightbox").prettyPhoto();
		
	}

	/*  Owl carousel
 	================================================*/ 

 	if( $("#sponsor-carousel li").length > 0 ) {

		$("#sponsor-carousel").owlCarousel({
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
		        600:{
		            items:4
		        },
		        1000:{
		            items:8
		        }
		    }

		});
	}

	if( $("#event-carousel li").length > 0 ) {
		$("#event-carousel").owlCarousel({
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
		            items:1
		        },
		        500:{
		        	items:2
		        },
		        1000:{
		            items:4
		        }
		    }

		});
	}

	if( $("#real-event-carousel").length > 0 ) {
		$("#real-event-carousel").owlCarousel({
			 margin:25,
			 stagePadding: 25,
	   		 nav:true,
	   		 navText: [
		      "<i class='glyphicon glyphicon-chevron-left'></i>",
		      "<i class='glyphicon glyphicon-chevron-right'></i>"
		    ],
		    responsive:{
		        0:{
		            items:1
		        },
		        1000:{
		        	items:2
		        }
		    }

		});
	}	

	if( $("#news-carousel").length > 0 ) {
		$("#news-carousel").owlCarousel({
			 margin:25,
			 stagePadding: 25,
	   		 nav:true,
	   		 navText: [
		      "<i class='glyphicon glyphicon-chevron-left'></i>",
		      "<i class='glyphicon glyphicon-chevron-right'></i>"
		    ],
		    responsive:{
		        0:{
		            items:1
		        }
		    }
		});
	}

	 /* Contact form ajax Handler
    ================================================*/

    $(".ajax-form").on('submit', function() {
    	var form = $(this);
        var formURL = $(this).attr("action");
        var postData = $(this).serializeArray();

        $.ajax({
            url: formURL,
            type: 'POST',
            data: postData,
            dataType: 'json',

            success:function(data, textStatus, jqXHR){

                if(data.success==1){

                    form.find(".alert").fadeOut();
                    form.find(".alert-success").html(data.message);
                    form.find(".alert-success").fadeIn(600);
                    

                }else{

                	form.find(".alert").fadeOut();
                    form.find(".alert-danger").html(data.message);
                    form.find(".alert-danger").fadeIn(600);

                }
            },

            error: function(jqXHR, textStatus, errorThrown)  { 
                
                console.log(errorThrown);
            }

        });
            

        return false;
     })



    /*
	On scroll animations
	================================================
	*/


    var $elems = $('.animate-onscroll');

    var winheight = $(window).height();
    var fullheight = $(document).height();
 
    $(window).scroll(function(){
        animate_elems();
    });



    function animate_elems() {

	    wintop = $(window).scrollTop(); // calculate distance from top of window
	 
	    // loop through each item to check when it animates
	    $elems.each(function(){
	    	
	      $elm = $(this);
	 
	      if($elm.hasClass('animated')) { return true; } // if already animated skip to the next item
	 
	      topcoords = $elm.offset().top; // element's distance from top of page in pixels
	 
	      if(wintop > (topcoords - (winheight*.75))) {
	        // animate when top of the window is 3/4 above the element
	        $elm.addClass('animated');
	      }

	    });

	  } // end animate_elems()

	


 	/*  Google map Script
 	====================================================*/ 

	function initMap() {

  		
  		var mapLatitude = 31.423308 ; // Google map latitude 
  		var mapLongitude = -8.075145 ; // Google map Longitude  

	    var myLatlng = new google.maps.LatLng( mapLatitude, mapLongitude );

	    var mapOptions = {

	            center: myLatlng,
	            mapTypeId: google.maps.MapTypeId.ROADMAP,
	            zoom: 10,
	            scrollwheel: false
	          };   

	    var map = new google.maps.Map(document.getElementById("contact-map"), mapOptions);

	    var marker = new google.maps.Marker({
	    	
	      position: myLatlng,
	      map : map,
	      
	    });

	    // To add the marker to the map, call setMap();
	    marker.setMap(map);

	    // Map Custom style
	    var styles = [
		  {
		    stylers: [
		      { hue: "#1f76bd" },
		      { saturation: 80 }
		    ]
		  },{
		    featureType: "road",
		    elementType: "geometry",
		    stylers: [
		      { lightness: 80 },
		      { visibility: "simplified" }
		    ]
		  },{
		    featureType: "road",
		    elementType: "labels",
		    stylers: [
		      { visibility: "off" }
		    ]
		  }
		];

		map.setOptions({styles: styles});

	};

	if( $("#contact-map").length > 0 ) {

		initMap();
		
	}

});

function CountDown(startTime, endTime) {
	var date = new Date();
	endTime.setDate(endTime.getDate() + 1);
	if(date.valueOf() < startTime.valueOf()) {
		return countdown(null, startTime, "HOURS", 2).toString();
	} else if(date.valueOf() >= startTime.valueOf() && date.valueOf() < endTime.valueOf()) {
		return 'In Progress';
	} else {
		return 'Ended';
	}
}

function populateSponsors() {
	$.ajax({
        url: '/users/role/Sponsor',
        dataType: 'json',
        async: false,
        success: function( data ) {
        	var counter = 0;
        	var content = "";
        	$.each(data, function(){
        		counter ++;
        		content = '<li><a href="users/' + this._id + '"><img src="' + this.companyImage + '" alt=""/></a></li>';
        		$('#sponsor-carousel').html($('#sponsor-carousel').html() + content);
        	});        	
        	if(counter < 8) {
        		for(var i = counter; i <= 8; i++) {
        			content = '<li></li>';
        			$('#sponsor-carousel').html($('#sponsor-carousel').html() + content);
        		}
        	}
        }
    });	
}

function populateNews() {
	$.ajax({
        url: '/posts/news',
        dataType: 'json',
        async: false,
        success: function( data ) {
        	var counter = 0;
        	var content = "";
        	var date = "";
        	var dateString = "";
        	$.each(data, function(){
        		date = new Date(this.dateCreated);
        		dateString =
        			date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes() + " " +
        			date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
        		counter ++;
        		content = 	'<li>' +
							  '<div class="col-md-6 col-xs-12">' +
							    '<a href="/posts/' + this._id + '"><div style="background-image:url(\'' + this.postImage + '\')" class="thumb"></div></a>' +
							  '</div>' +
							  '<div class="col-md-6 col-xs-12">' +
							    '<a href="/posts/' + this._id + '"><h3 style="text-transform: uppercase;">' +
							    	this.postName +
							    '</h3></a>' +
							    '<p>' + this.postShortDesc + '</p>' +
							  '</div>' +
							  '<div style="position:absolute; bottom: 20px; right: 0px">' +
							  	'<span style="margin-right: 20px">' + dateString + '</span>' +
							  	'<a href="/posts/' + this._id + '" class="btn btn-primary"><strong>Read More</strong></a>' +
							  '</div>' +
							'</li>';
        		$('#news-carousel').html($('#news-carousel').html() + content);
        	});        	
        	if(counter < 1) {
        		for(var i = counter; i <= 1; i++) {
        			content = '<li></li>';
        			$('#news-carousel').html($('#news-carousel').html() + content);
        		}
        	}
        }
    });	
}

//db.Posts.insert({'postName':'Announcement of New Page','postType':'News','postShortDesc': 'Testing News Like Usual','postContent':'<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. </p><p>Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. </p><p>Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. </p><p>Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna. Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. </p><p>Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa. Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede. Ut orci risus, accumsan porttitor, cursus quis, aliquet eget, justo. </p>','postImage':'/images/event/837da2f71c5143e6959267c9e6653a5b.jpeg','userId':'58c2969f0637fb97d8eadf28','dateCreated':new Date()});


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

		    	var content = "" +
						        '<div class="reasons-col animate-onscroll fadeIn"><img src="' + this.eventImage + '" alt=""/>' +
						          '<div id="event' + counter + 'Time" class="time">' +
							      	  cd + 
							      '</div>' +
								  '<div class="reasons-titles">' +
								    '<h3 class="reasons-title"><a href="/events/' + this._id + '">' + this.eventName + '<a/></h3>' +
								    '<h5 class="reason-subtitle">' + this.meetingAddress + '</h5>' + 
								    '<h4><i class="fa fa-clock-o"></i> ' + this.meetingTime + ' - <i class="fa fa-calendar"></i> ' + this.eventDate.split(' - ')[0] + '</h4>' +
								  '</div>' +
								  '<div class="on-hover hidden-xs">' +
								    '<p>' + this.eventDescription + '</p>' +
								  '</div>' +
								'</div>' +
					    	"";    	

		    	//$('#eventCarousel').html($('#eventCarousel').html() + content);

		    	$('#real-event-carousel').html($('#real-event-carousel').html() + content);

		    	$('#event' + counter + 'Time').html(CountDown(new Date(dayStart), new Date(dayEnd)));
	    	});
        }
    });
}	