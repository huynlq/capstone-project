// DOM Ready ===============================================

$(document).ready(function() {
  $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
  } );

  $('[data-toggle="tooltip"]').tooltip(); 

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
        $('#txtImageSrc').attr("src", data.image);

        $.getJSON('/users/getrolebyid/' + id, function( data2 ) {
        	if(data2.role != 'Producer' && data2.role != 'Sponsor') {
        		$('#companyInfoDiv').remove();
        	} else {        		
            $('#btnPromote').remove();

        		$('#txtCompanyFullName').val(data.companyName);
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