// DOM Ready ===============================================

$(document).ready(function() {
  populateLanguage();

  $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
  } );

  $('[data-toggle="tooltip"]').tooltip(); 

  var id = readCookie("user");

  $("#inputUserImage").change(function(e) {

      for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
          
          var file = e.originalEvent.srcElement.files[i];
          
          var img = document.createElement("img");
          var reader = new FileReader();
          reader.onloadend = function() {
               img.src = reader.result;
               $("#txtUserImageSrc").attr('src', img.src);              
               var extension = img.src.substring(img.src.indexOf("/")+1,img.src.indexOf(";"));
               $('#txtImageSrc').val("/images/user/" + id + "." + extension);
          }
          reader.readAsDataURL(file);
          
      }
  });

  $("#inputCompanyImage").change(function(e) {

      for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
          
          var file = e.originalEvent.srcElement.files[i];
          
          var img = document.createElement("img");
          var reader = new FileReader();
          reader.onloadend = function() {
               img.src = reader.result;
               $("#txtCompanyImageSrc").attr('src', img.src);              
               var extension = img.src.substring(img.src.indexOf("/")+1,img.src.indexOf(";"));
               $('#txtImageSrc').val("/images/user/company-" + id + "." + extension);
          }
          reader.readAsDataURL(file);
          
      }
  });

  populateForms();
  populateEventJoined();
  populateEventProduced();
  //populateEventSponsored();
} );

// Functions ===============================================

function populateLanguage() {
  $('#header').html($MYUSERPAGE_HEADER);
  $('#header-desc').html($MYUSERPAGE_HEADER_DESC);
  $('#header-userInfo').html($MYUSERPAGE_HEADER_USERINFO);
  $('#userForm-username').html($MYUSERPAGE_USERFORM_USERNAME);
  $('#userForm-fullName').html($MYUSERPAGE_USERFORM_FULLNAME);
  $('#userForm-address').html($MYUSERPAGE_USERFORM_ADDRESS);
  $('#userForm-email').html($MYUSERPAGE_USERFORM_EMAIL);
  $('#userForm-phone').html($MYUSERPAGE_USERFORM_PHONE);
  $('#userForm-save').html($MYUSERPAGE_USERFORM_SAVE);

  $('#header-companyInfo').html($MYUSERPAGE_HEADER_COMPANYINFO);
  $('#companyForm-name').html($MYUSERPAGE_COMPFORM_COMPNAME);
  $('#companyForm-address').html($MYUSERPAGE_COMPFORM_ADDRESS);
  $('#companyForm-email').html($MYUSERPAGE_COMPFORM_EMAIL);
  $('#companyForm-phone').html($MYUSERPAGE_COMPFORM_PHONE);
  $('#companyForm-website').html($MYUSERPAGE_COMPFORM_WEBSITE);
  $('#companyForm-save').html($MYUSERPAGE_COMPFORM_SAVE);
}

function populateForms() {
	var id = readCookie("user");
	$.getJSON( '/users/id/' + id, function( data ) {
        $('#txtUsername').val(data.username);
        $('#txtFullName').val(data.fullName);
        $('#txtAddress').val(data.address);
        $('#txtEmail').val(data.email);
        $('#txtPhone').val(data.phoneNumber);
        $('#txtUserImageSrc').attr("src", data.image);

        $.getJSON('/users/getrolebyid/' + id, function( data2 ) {
        	if(data2.role != 'Producer' && data2.role != 'Sponsor') {
        		$('#companyInfoDiv').remove();
        	} else {        		
            $('#btnPromote').remove();

        		$('#txtCompanyName').val(data.companyName);
		        $('#txtCompanyAddress').val(data.companyAddress);
		        $('#txtCompanyEmail').val(data.companyEmail);
		        $('#txtCompanyPhone').val(data.companyPhoneNumber);
            $('#txtCompanyWebsite').val(data.companyWebsite);
		        // REMEMBER TO CHANGE THIS CODE BELOW
		        $('#txtCompanyImageSrc').attr("src", data.companyImage);            
        	}
        });		
    }); 
}

function populateErrors() {
  if($('#uploadError').html() == '')
    $('#alert-panel').html('');
}

function saveInfo() {
  var userData = {
    fullName: $('#txtFullName').val(),
    address: $('#txtAddress').val(),
    email: $('#txtEmail').val(),
    phoneNumber: $('#txtPhone').val(),
    dateModified: new Date()
  };

  var id = readCookie("user");

  $.getJSON('/users/getrolebyid/' + id, function( data ) {
    if(data.role == 'Producer' && data.role == 'Sponsor') {
      userData.companyName = $('#txtCompanyFullName').val();
      userData.companyAddress = $('#txtCompanyAddress').val();
      userData.companyEmail = $('#txtCompanyEmail').val();
      userData.companyPhoneNumber = $('#txtCompanyPhone').val();
    }
  });

  $.ajax({
      type: 'PUT',
      data: userData,
      url: '/users/updateuser/' + id,
      dataType: 'JSON'
  }).done(function( response ) {
    console.log("MESSAGE: " + response.message);
      if (response.msg === '') {
        $('#alert-panel').html('<div class="alert alert-success alert-dismissable fade in" style="position:fixed; bottom:50px; right:50px;">'
                + '<a class="close" data-dismiss="alert" aria-label="close">&times;</a>'
                + '<span>' + response.message + '</span>');
      } else {
        $('#alert-panel').html('<div class="alert alert-danger alert-dismissable fade in" style="position:fixed; bottom:50px; right:50px;">'
                + '<a class="close" data-dismiss="alert" aria-label="close">&times;</a>'
                + '<span>' + response.message + '</span>');
      }
  });
}

// Populate Participated Events
function populateEventJoined() {
  var id = readCookie('user');
  var counter = 0;
  var dateCreated = "";
  var eventId = "";
  $('#eventJoined-panel').html('<div class="section-home our-sponsors fadeIn">' +
                                        '<div class="container">' +
                                          '<h2 class="title-style-1">' + $MYUSERPAGE_HEADER_JOINEDEVENTS + ' <span class="title-under"></span></h2>' +
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

      if( counter > 0 ) {
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
      } else {
        $('#eventJoined-panel').html($('#eventJoined-panel').html() + '<center>' + $MYUSERPAGE_NO_EVENT + '</center>')
      }
    } else {
      $('#eventJoined-panel').html($('#eventJoined-panel').html() + '<center>' + $MYUSERPAGE_NO_EVENT + '</center>')
    }   
  });
}

// Populate event produced
function populateEventProduced() {
  var id = readCookie('user');
  $.getJSON('/users/id/' + id, function( userData ) {
    if(userData.role == "Producer") {
      var counter = 0;
      var dateCreated = "";      
      $('#eventProduced-panel').html('<div class="section-home our-sponsors fadeIn">' +
                                        '<div class="container">' +
                                          '<h2 class="title-style-1">' + $MYUSERPAGE_HEADER_HOSTEDEVENTS + ' <span class="title-under"></span></h2>' +
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

      if( counter  > 0 ) {
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
      } else {
        $('#eventProduced-panel').html($('#eventProduced-panel').html() + '<center>' + $MYUSERPAGE_NO_EVENT + '</center>');
      }
    } else {
      $('#eventProduced-panel').html('');
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