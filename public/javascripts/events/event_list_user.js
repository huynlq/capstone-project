// DOM Ready ===============================================

$(document).ready(function() {
  $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
  } );

  $('[data-toggle="tooltip"]').tooltip(); 

  populateEvents();
} );

// Functions ===============================================

function populateEvents() {
	// jQuery AJAX call for JSON
    $.getJSON( '/events/all', function( data ) {
        $('#upcomingEvents').html('');
        $('#inProgressEvents').html('');
        $('#pastEvents').html('');
        var upcomingContent = '';
        var inProgressContent = '';
        var pastContent = '';
        var content = "";
        var now = new Date();
        var eventStartDate;
        var eventEndDate;
        var startDate = "";
        var donations = "";
        var currentParticipants = "";
        var currentSponsors = "";
        // For each item in our JSON, add a table row and cells to the content string
        for(var i = 0; i < data.length; i++) {          
            $.ajax({
                url: '/events/participantsnumber/' + data[i]._id,
                dataType: 'json',
                async: false,
                success: function( dataParticipants ) {
                    currentParticipants = dataParticipants;
                }
            });
            $.ajax({
                url: '/events/sponsornumber/' + data[i]._id,
                dataType: 'json',
                async: false,
                success: function( dataSponsors ) {
                    currentSponsors = dataSponsors;
                }
            });
            eventStartDate = new Date(data[i].eventDate.split(" - ")[0]);
            eventEndDate = new Date(data[i].eventDate.split(" - ")[1]);
            startDate = eventStartDate.getDate() + "-" + eventStartDate.getMonth() + "-" + eventStartDate.getFullYear();
            content =   '<div class="item" style="background-color: #F2F6FF">' +
                            '<div class="thumb" style="background-image: url(' + data[i].eventImage + '); max-width: 100% !important"></div>' +
                            '<div class="eventInfo clearfix border-bottom p-15 pt-10" style="height: 228px">' +
                                '<p class="mb-10 mt-5">' + 
                                    '<span class="text-uppercase text-theme-colored"><strong>' + data[i].eventName + ': </strong></span>' + 
                                    data[i].eventDescription.replace(/^(.{200}[^\s]*).*/, "$1") + '...' +
                                '</p>' +
                                '<ul style="list-style: none; font-family: Arial">' +
                                    '<li><i class="fa fa-users"><span style="margin-left: 10px; font-family: sans-serif">' + currentParticipants + '/' + data[i].volunteerMax + ' Joined</span></i></li>' +
                                    '<li><i class="fa fa-heart"><span style="margin-left: 10px; font-family: sans-serif">' + currentSponsors + ' Sponsor(s)</span></i></li>' +
                                    '<li><i class="fa fa-calendar"><span style="margin-left: 10px; font-family: sans-serif">' + startDate + ' - ' + data[i].meetingTime + '</span></i></li>' +
                                    '<li><i class="fa fa-crosshairs"><span style="margin-left: 10px; font-family: sans-serif">' + data[i].meetingAddress + '</span></i></li>' +                                    
                                '</ul>' +
                                '<div class="donate-details">' +
                                    '<a href="/events/' + data[i]._id + '" class="btn btnEvent pull-right" role="button">Chi tiết</a>' +
                               '</div>' +
                            '</div>' +
                        '</div>';
            if(eventStartDate.getTime() > now.getTime() && data[i].status != "Cancelled"){
                // Add to Upcoming Section
                upcomingContent += content;
            } else if(eventStartDate.getTime() <= now.getTime() && eventEndDate.getTime() >= now.getTime() && data[i].status != "Cancelled"){
                // Add to In Progress Section
                inProgressContent += content;
            } else if(eventEndDate.getTime() < now.getTime() && data[i].status != "Cancelled"){
                // Add to Past Section
                pastContent += content;
            }
        }

        if(upcomingContent == '') {
            $('#upEvents').html('');
        } else {
            $('#upcomingEvents').html('<div class="owl-carousel owl-theme">' + upcomingContent + '</div>');
        }

        if(inProgressContent == '') {
            $('#inEvents').html('');
        } else {
            $('#inProgressEvents').html('<div class="owl-carousel owl-theme">' + inProgressContent + '</div>');
        }

        if(pastContent == '') {
            $('#paEvents').html('');
        } else {
            $('#pastEvents').html('<div class="owl-carousel owl-theme">' + pastContent + '</div>');
        }

        // $('#upcomingEvents').html('<div class="owl-carousel owl-theme">' + upcomingContent + '</div>');
        // $('#inProgressEvents').html('<div class="owl-carousel owl-theme">' + inProgressContent + '</div>');
        // $('#pastEvents').html('<div class="owl-carousel owl-theme">' + pastContent + '</div>');

        $('.owl-carousel').owlCarousel({
            lazyLoad: true,
            loop:false,
            margin:10,
            nav:true,
            autoplay:true,
            smartSpeed:500,
            autoplayTimeout:500,
            autoplayHoverPause:true,
            responsive:{
                0:{
                    items:1
                },
                900:{
                    items:2
                },
                1500:{
                    items:3
                }
            }
        })
    }); 
}