// DOM Ready ===============================================

$(document).ready(function() {
  $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
  } );

  $('[data-toggle="tooltip"]').tooltip(); 

  populateForms();
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
        	if(data2.role != 'Producer') {
        		//$('#companyInfoDiv').remove();
        	} else {        		
        		$('#txtCompanyFullName').val(data.companyName);
		        $('#txtCompanyAddress').val(data.companyAddress);
		        $('#txtCompanyEmail').val(data.companyEmail);
		        $('#txtCompanyPhone').val(data.companyPhoneNumber);
		        // REMEMBER TO CHANGE THIS CODE BELOW
		        $('#txtCompanyImageSrc').attr("src", data.image);
        	}
        });		
    }); 
}

function saveInfo() {
  var userData = {
    fullName: $('#txtFullName').val(),
    
  };
}

function changeImage() {

}