// DOM Ready ===============================================

$(document).ready(function() {
  $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
  } );

  $('[data-toggle="tooltip"]').tooltip(); 

  populateEvents();
} );

// Functions ===============================================

function search() {
    var input, filter, search, i, value;
    var flag;
    input = $('#txtSearch').val();
    filter = input.toUpperCase();
    searchName = $('.eventSearchName');
    searchDesc = $('.eventSearchDesc');
    searchAddress = $('.eventSearchAddress');
    searchType = $('.eventSearchType');

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < searchName.length; i++) {
        flag = false;
        if($('input[name="searchName"]').is(':checked')) {
            if(searchName[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
                flag = true;
            }
        }
        if($('input[name="searchDesc"]').is(':checked')) {
            if(searchDesc[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
                flag = true;
            }
        }
        if($('input[name="searchAddress"]').is(':checked')) {
            if(searchAddress[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
                flag = true;
            }
        }
        if($('input[name="searchType"]').is(':checked')) {
            if(searchType[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
                flag = true;
            }
        }

        if (flag) {
            searchName[i].closest('.item').style.display = "";
        } else {
            searchName[i].closest('.item').style.display = "none";
        }



        // if (searchName[i].innerHTML && searchDesc[i].innerHTML && searchType[i].innerHTML && searchAddress[i].innerHTML) {            
        //     if (searchName[i].innerHTML.toUpperCase().indexOf(filter) > -1 || searchDesc[i].innerHTML.toUpperCase().indexOf(filter) > -1 || searchType[i].innerHTML.toUpperCase().indexOf(filter) > -1 || searchAddress[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
        //         searchName[i].closest('.item').style.display = "";
        //     } else {
        //         searchName[i].closest('.item').style.display = "none";
        //     }
        // } 
    }
}

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
            eventEndDate.setDate(eventEndDate.getDate() + 1);
            startDate = eventStartDate.getDate() + "-" + eventStartDate.getMonth() + "-" + eventStartDate.getFullYear();
            var currentRatingContent = "";
            var currentRating = 0;
            if(eventEndDate.getTime() < now.getTime() && data[i].status != "Cancelled") {                    
                $.ajax({
                    url: '/ratings/general/' + data[i]._id,
                    dataType: 'json',
                    async: false,
                    success: function(dataRating) {                        
                        if(dataRating == '' || dataRating == null || dataRating.ratingPoint == null) {
                            currentRating = 0;
                        } else {
                            currentRating = parseFloat(dataRating.ratingPoint);
                        }
                        for(var i = 1; i <= 5; i++) {
                            if(i <= Math.floor(currentRating)) {
                                currentRatingContent += '<img src="/images/system/rated-star.png" height="15" style="margin:2px;width:15px;display:inline-block"/>';
                            } else {
                                currentRatingContent += '<img src="/images/system/unrated-star.png" height="15" style="margin:2px;width:15px;display:inline-block"/>';
                            }
                        }
                        currentRatingContent += '<span style="margin-left: 15px">' + currentRating + '/5 (' + dataRating.count + ' votes)</span>';
                    }
                });
            }
            content =   '<div class="item" style="background-color: #F2F6FF">' +
                            '<div class="thumb" style="background-image: url(' + data[i].eventImage + '); max-width: 100% !important"></div>' +
                            '<div class="eventInfo clearfix border-bottom p-15 pt-10" style="height: 228px">' +
                                '<p class="mb-10 mt-5">' + 
                                    '<span class="text-uppercase text-theme-colored"><strong class="eventSearchName">' + data[i].eventName + ': </strong></span>' + 
                                    '<span class="eventSearchDesc">' + data[i].eventDescription.replace(/^(.{200}[^\s]*).*/, "$1") + '</span>...' +
                                '</p>' +
                                '<ul style="list-style: none; font-family: Arial">' +
                                    '<li><i class="fa fa-hashtag"><span class="eventSearchType" style="margin-left: 10px; font-family: sans-serif">' + data[i].eventType + '</span></i></li>' +
                                    '<li><i class="fa fa-users"><span style="margin-left: 10px; font-family: sans-serif">' + currentParticipants + '/' + data[i].volunteerMax + ' Joined</span></i></li>' +
                                    '<li><i class="fa fa-heart"><span style="margin-left: 10px; font-family: sans-serif">' + currentSponsors + ' Sponsor(s)</span></i></li>' +
                                    '<li><i class="fa fa-calendar"><span style="margin-left: 10px; font-family: sans-serif">' + startDate + ' - ' + data[i].meetingTime + '</span></i></li>' +
                                    '<li><i class="fa fa-crosshairs"><span class="eventSearchAddress" style="margin-left: 10px; font-family: sans-serif">' + data[i].meetingAddress + '</span></i></li>' +                                    
                                '</ul>' +
                                '<div class="donate-details">' +
                                    '<p style="float: left">' + currentRatingContent + '</p>' +
                                    '<a href="/events/' + data[i]._id + '" class="btn" style="background-color: #73879C; color: white; float: right" role="button">Chi tiết</a>' +
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
            navText: ["<i class='fa fa-angle-double-left'></i>","<i class='fa fa-angle-double-right'></i>"],
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

        $('.owl-prev').addClass('btn');
        $('.owl-next').addClass('btn');
    }); 
}