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
  populateEventSponsored();
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

function validateUserForm() {
  if(!validateEmail($('#txtEmail').val())){
    event.preventDefault();
    $('#txtEmail').focus();
    showAlert('danger',$USERPAGE_ALERT_WRONG_EMAIL);
  };
}

function validateCompanyForm() {
  if(!validateEmail($('#txtCompanyEmail').val())){
    event.preventDefault();
    $('#txtCompanyEmail').focus();
    showAlert('danger',$USERPAGE_ALERT_WRONG_EMAIL);
  };
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
                                    '<h2 class="title-style-1">' + $USERPAGE_HEADER_JOINEDEVENTS + ' <span class="title-under"></span></h2>' +
                                    '<table id="eventJoinedTable" class="table table-striped table-bordered dt-responsive nowrap datatable-responsive fadeIn"><thead>' +
                                      '<tr>' +
                                        '<th>#</th>' +
                                        '<th>' + $LISTEVENT_TH_EVENT + '</th>' +
                                        '<th>' + $LISTEVENT_TH_START + '</th>' +
                                        '<th>' + $LISTEVENT_TH_LOCATION + '</th>' +
                                      '</tr>' +
                                    '</thead><tbody></tbody></table>' +
                                  '</div>' +
                                '</div>');
  $.getJSON('/events/getparticipatedevents/' + id, function( data ) {
    var table = $('#eventJoinedTable').DataTable({"columnDefs": [{ "width": "20px", "targets": 0 }]});    
    $.each(data, function(){
      if(this.status != "Absent") {
        dateCreated = new Date(this.dateCreated);
        eventId = this.eventId;
        $.getJSON('/events/details/' + eventId, function( dataEvent ) {
          if(dataEvent != null) {
            counter++;        
            table.row.add([
                counter,
                '<a href="/events/' + dataEvent._id + '">' + dataEvent.eventName + '</a>',
                dataEvent.eventDate,
                dataEvent.meetingAddress
            ]).draw( false );
            $('[data-toggle="tooltip"]').tooltip(); 
          }          
        });
      }      
    });
  });
}

// Populate event produced
function populateEventProduced() {
  var id = readCookie('user');
  var eventId = "";
  $.getJSON('/users/id/' + id, function( userData ) {
    if(userData.role == "Producer") {
      var counter = 0;
      var dateCreated = "";    
      $('#eventProduced-panel').html('<div class="section-home our-sponsors fadeIn">' +
                                      '<div class="container">' +
                                        '<h2 class="title-style-1">' + $USERPAGE_HEADER_HOSTEDEVENTS + ' <span class="title-under"></span></h2>' +
                                        '<table id="eventHostedTable" class="table table-striped table-bordered dt-responsive nowrap datatable-responsive fadeIn"><thead>' +
                                          '<tr>' +
                                            '<th>#</th>' +
                                            '<th>' + $LISTEVENT_TH_EVENT + '</th>' +
                                            '<th>' + $LISTEVENT_TH_START + '</th>' +
                                            '<th>' + $LISTEVENT_TH_LOCATION + '</th>' +
                                          '</tr>' +
                                        '</thead><tbody></tbody></table>' +
                                      '</div>' +
                                    '</div>');
      $.getJSON('/events/producedevents/' + id, function( data ) {
        var table = $('#eventHostedTable').DataTable({"columnDefs": [{ "width": "20px", "targets": 0 }]});    
        $.each(data, function(){
          if(this.status == "Published") {
            dateCreated = new Date(this.dateCreated);
            eventId = this._id;
            $.getJSON('/events/details/' + eventId, function( dataEvent ) {
              counter++;        
              table.row.add([
                  counter,
                  '<a href="/events/' + dataEvent._id + '">' + dataEvent.eventName + '</a>',
                  dataEvent.eventDate,
                  dataEvent.meetingAddress,
              ]).draw( false );
              $('[data-toggle="tooltip"]').tooltip(); 
            });
          }      
        });
      });
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
      $('#eventSponsored-panel').html('<div class="section-home our-sponsors fadeIn">' +
                                      '<div class="container">' +
                                        '<h2 class="title-style-1">' + $USERPAGE_HEADER_SPONSOREDEVENTS + ' <span class="title-under"></span></h2>' +
                                        '<table id="eventSponsoredTable" class="table table-striped table-bordered dt-responsive nowrap datatable-responsive fadeIn"><thead>' +
                                          '<tr>' +
                                            '<th>#</th>' +
                                            '<th>' + $LISTEVENT_TH_EVENT + '</th>' +
                                            '<th>' + $LISTEVENT_TH_START + '</th>' +
                                            '<th>' + $LISTEVENT_TH_LOCATION + '</th>' +
                                          '</tr>' +
                                        '</thead><tbody></tbody></table>' +
                                      '</div>' +
                                    '</div>');
      $.getJSON('/events/sponsoredevents/' + id, function( data ) {
        var table = $('#eventSponsoredTable').DataTable({"columnDefs": [{ "width": "20px", "targets": 0 }]});    
        $.each(data, function(){          
          console.log(data);
          dateCreated = new Date(this.dateCreated);
          counter++;        
          table.row.add([
              counter,
              '<a href="/events/' + this._id + '">' + this.eventName + '</a>',
              this.eventDate,
              this.meetingAddress,
          ]).draw( false );
          $('[data-toggle="tooltip"]').tooltip();            
        });
      });
    } else {
      $('#eventSponsored-panel').html('');
    }
  });
}