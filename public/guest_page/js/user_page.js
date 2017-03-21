// DOM Ready ===============================================

$(document).ready(function() {
  $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
  } );

  $('[data-toggle="tooltip"]').tooltip(); 

  populateEventJoined();
  populateEventProduced();
  //populateEventSponsored();
} );

// Functions ===============================================

// Populate Participated Events
function populateEventJoined() {
  var id = $('#userId').html();
  var counter = 0;
  var dateCreated = "";
  var eventId = "";
  $('#eventJoined-panel').html('<div class="section-home our-sponsors fadeIn">' +
                                        '<div class="container">' +
                                          '<h2 class="title-style-1">Joined Events <span class="title-under"></span></h2>' +
                                          '<div id="joined-events" class="owl-carousel list-unstyled"></div>' +
                                        '</div>' +
                                      '</div>');
  $.getJSON('/events/getparticipatedevents/' + id, function( data ) {
    console.log(data);
    if(data != null && data != "") {      
      var counter = 0;            
      $.each(data, function(){
        eventId = this.eventId;
        if(this.status != "Absent") {
          $.ajax({
            url: '/events/details/' + eventId,
            dataType: 'json',
            async: false,
            success: function( eventData ) {
              console.log("HEY");
              if(eventData.status != "Cancelled") {
                counter++;
                var content = "" +
                                '<div class="reasons-col fadeIn" style="height: 350px; margin: 20px 0"><img src="' + eventData.eventImage + '" alt=""/>' +
                                '<div class="reasons-titles">' +
                                  '<h3 class="reasons-title"><a href="/events/' + eventData._id + '">' + eventData.eventName + '<a/></h3>' +
                                  '<h5 class="reason-subtitle">' + eventData.meetingAddress + '</h5>' + 
                                  '<h4><i class="fa fa-clock-o"></i> ' + eventData.meetingTime + ' - <i class="fa fa-calendar"></i> ' + eventData.eventDate.split(' - ')[0] + '</h4>' +
                                '</div>' +
                                '<div class="on-hover hidden-xs">' +
                                  '<p>' + eventData.eventShortDescription + '</p>' +
                                '</div>' +
                              '</div>' +
                              "";     

                //$('#eventCarousel').html($('#eventCarousel').html() + content);

                $('#joined-events').html($('#joined-events').html() + content);
              }      
            }
          });          
        }      
      });

      if( counter > 1 ) {
        $("#joined-events").owlCarousel({
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
      } else if (counter == 1) {
        $("#joined-events").owlCarousel({
           margin:25,
           stagePadding: 25,
           center:true,
             nav:true,
             navText: [
              "<i class='glyphicon glyphicon-chevron-left'></i>",
              "<i class='glyphicon glyphicon-chevron-right'></i>"
            ],
            responsive:{
                0:{
                    items:1
                },
                900:{
                    items:2
                }
            }

        });
      } else {
        $('#eventJoined-panel').html($('#eventJoined-panel').html() + '<center>None at the moment.</center>')
      }
    } else {
      $('#eventJoined-panel').html($('#eventJoined-panel').html() + '<center>None at the moment.</center>')
    }   
  });
}

// Populate event produced
function populateEventProduced() {
  var id = $('#userId').html();
  $.getJSON('/users/id/' + id, function( userData ) {
    if(userData.role == "Producer") {
      var counter = 0;
      var dateCreated = "";      
      $('#eventProduced-panel').html('<div class="section-home our-sponsors fadeIn">' +
                                        '<div class="container">' +
                                          '<h2 class="title-style-1">Hosted Events <span class="title-under"></span></h2>' +
                                          '<div id="hosted-events" class="owl-carousel list-unstyled"></div>' +
                                        '</div>' +
                                      '</div>');
      $.ajax({
        url: '/events/producedevents/' + id,
        dataType: 'json',
        async: false,
        success: function( data ) {
          $.each(data, function(){
            if(this.status != "Cancelled") {
              counter++;
              var content = "" +
                              '<div class="reasons-col fadeIn" style="height: 350px; margin: 20px 0"><img src="' + this.eventImage + '" alt=""/>' +
                              '<div class="reasons-titles">' +
                                '<h3 class="reasons-title"><a href="/events/' + this._id + '">' + this.eventName + '<a/></h3>' +
                                '<h5 class="reason-subtitle">' + this.meetingAddress + '</h5>' + 
                                '<h4><i class="fa fa-clock-o"></i> ' + this.meetingTime + ' - <i class="fa fa-calendar"></i> ' + this.eventDate.split(' - ')[0] + '</h4>' +
                              '</div>' +
                              '<div class="on-hover hidden-xs">' +
                                '<p>' + this.eventShortDescription + '</p>' +
                              '</div>' +
                            '</div>' +
                            "";     

              //$('#eventCarousel').html($('#eventCarousel').html() + content);

              $('#hosted-events').html($('#hosted-events').html() + content);
            }      
          });
        }
      });

      if( counter  > 1 ) {
        $("#hosted-events").owlCarousel({
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
       } else if( counter == 1 ) {
        $("#hosted-events").owlCarousel({
           margin:25,
           stagePadding: 25,
           center:true,
           nav:false,
            responsive:{
                0:{
                    items:1
                },
                900:{
                    items:2
                }
            }

        });
      } else {
        $('#eventProduced-panel').html($('#eventProduced-panel').html() + '<center>None at the moment.</center>');
      }
    } else {
      $('#eventProduced-panel').html('');
      $('#companyInfoDiv').html('');
    }
  });  
}

// Populate event sponsored
function populateEventSponsored() {
  var id = readCookie('user');
  $.getJSON('/users/id/' + id, function( userData ) {
    if(userData.role == "Sponsor") {
      var counter = 0;
      var dateCreated = "";
      $.getJSON('/events/sponsoredevents/' + id, function( data ) {
        var table = $('#eventSponsoredTable').DataTable();    
        $.each(data, function(){      
          dateCreated = new Date(this.dateCreated);
          counter++;        
          table.row.add([
              counter,
              this.eventName,
              this.eventType,
              this.eventDate,
              '<a data-toggle="tooltip" title="View" class="btn btn-info btn-xs" href="../events/' + this._id + '">'
                + '<span class="glyphicon glyphicon-search"></span>'
              + '</a>'
          ]).draw( false );
        });
      });
    } else {
      $('#eventSponsored-panel').html('');
    }
  });
}