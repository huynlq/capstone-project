// DOM Ready ===============================================

$(document).ready(function() {
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
  populateErrors();
} );

// Functions ===============================================

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