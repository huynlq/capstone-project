		
$(function(){

	/*  Populate countdown
 	================================================*/ 

 	populateEvents();
 	populateSponsors();


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
		        500:{
		        	items:2
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