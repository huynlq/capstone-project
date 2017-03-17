// DOM Ready ===============================================

$(document).ready(function() {
  $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
  } );

  $('[data-toggle="tooltip"]').tooltip(); 

  populateUsers();
} );

// Functions ===============================================

function search() {
    var input, filter, search, i, value;
    var flag;
    input = $('#txtSearch').val();
    filter = input.toUpperCase();
    searchName = $('.userSearchName');

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < searchName.length; i++) {
        if(searchName[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            searchName[i].closest('.item').style.display = "";
        } else {
            searchName[i].closest('.item').style.display = "none";
        }
    }
}

function populateUsers() {
	// jQuery AJAX call for JSON
    $.getJSON( '/users/all', function( data ) {
        $('#producersContent').html('');
        $('#sponsorsContent').html('');
        var producersContent = '';
        var sponsorsContent = '';
        var content = "";
        var specialContent = "";
        // For each item in our JSON, add a table row and cells to the content string
        for(var i = 0; i < data.length; i++) {          
            if(data[i].role == "Producer" || data[i].role == "Sponsor") {
                var currentRatingContent = "";
                var currentRating = 0;
                if(data[i].role == "Producer") {
                    $.ajax({
                        url: '/events/createdbyuser/' + data[i]._id,
                        dataType: 'json',
                        async: false,
                        success: function( dataProducer ) {
                            specialContent = '<li><i class="fa fa-send"><span style="margin-left: 10px; font-family: sans-serif">' + dataProducer + ' Event(s) Created</span></i></li>';
                        }
                    });
                                    
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
                } else if (data[i].role == "Sponsor") {
                    $.ajax({
                        url: '/events/sponsoredbyuser/' + data[i]._id,
                        dataType: 'json',
                        async: false,
                        success: function( dataSponsor ) {
                            specialContent = '<li><i class="fa fa-money"><span style="margin-left: 10px; font-family: sans-serif">' + dataSponsor + ' Event(s) Sponsored</span></i></li>';
                        }
                    });
                }
                content =   '<div class="item" style="background-color: #F2F6FF">' +
                                '<div class="thumb" style="background-image: url(' + data[i].companyImage + '); max-width: 100% !important"></div>' +
                                '<div class="eventInfo clearfix border-bottom p-15 pt-10" style="height: 228px">' +
                                    '<p class="mb-10 mt-5">' + 
                                        '<span class="text-uppercase text-theme-colored"><strong class="userSearchName">' + data[i].companyName + '</strong></span>' + 
                                    '</p>' +
                                    '<ul style="list-style: none; font-family: Arial">' +
                                        specialContent +
                                        '<li><i class="fa fa-street-view"><span style="margin-left: 10px; font-family: sans-serif">' + data[i].companyAddress + '</span></i></li>' +
                                        '<li><i class="fa fa-envelope"><span style="margin-left: 10px; font-family: sans-serif">' + data[i].companyEmail + ' Sponsor(s)</span></i></li>' +
                                        '<li><i class="fa fa-phone"><span style="margin-left: 10px; font-family: sans-serif">' + data[i].companyPhoneNumber + '</span></i></li>' +                                        
                                        '<li><i class="fa fa-globe"><span style="margin-left: 10px; font-family: sans-serif">' + data[i].companyWebsite + '</span></i></li>' +
                                    '</ul>' +
                                    '<div class="donate-details">' +
                                        '<p style="float: left">' + currentRatingContent + '</p>' +
                                        '<a href="/users/' + data[i]._id + '" class="btn" style="background-color: #73879C; color: white; float: right" role="button">Chi tiết</a>' +
                                   '</div>' +
                                '</div>' +
                            '</div>';
                if(data[i].role == "Producer"){
                    // Add to Producer Section
                    producersContent += content;
                } else if(data[i].role == "Sponsor"){
                    // Add to Sponsor Section
                    sponsorsContent += content;
                }
            }
            
        }

        if(producersContent == '') {
            $('#producersPane').html('');
        } else {
            $('#producersContent').html('<div class="owl-carousel owl-theme">' + producersContent + '</div>');
        }

        if(sponsorsContent == '') {
            $('#sponsorsPane').html('');
        } else {
            $('#sponsorsContent').html('<div class="owl-carousel owl-theme">' + sponsorsContent + '</div>');
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