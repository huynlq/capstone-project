// DOM Ready ===============================================

$(document).ready(function() {
	var id = readCookie("user");
  populateLanguage();

  $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
  } );

  $('[data-toggle="tooltip"]').tooltip(); 

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
  populateCheckbox();
});

// Functions ===============================================

function populateLanguage() {
  $('#header').html($PROMOTE_HEADER);
  $('#header-desc').html($PROMOTE_HEADER_DESC);
  $('#header-terms').html($PROMOTE_HEADER_TERMS);
  $('#header-companyInfo').html($PROMOTE_HEADER_INFO);

  $('#form-position').html($PROMOTE_FORM_POSITION);
  $('#form-name').html($PROMOTE_FORM_NAME);
  $('#form-email').html($PROMOTE_FORM_EMAIL);
  $('#form-address').html($PROMOTE_FORM_ADDRESS);
  $('#form-phone').html($PROMOTE_FORM_PHONE);
  $('#form-website').html($PROMOTE_FORM_WEBSITE);

  $('#accept').html($PROMOTE_FORM_ACCEPT);
  $('#btnSubmit').html($PROMOTE_FORM_SUBMIT);

}

function populateCheckbox() {
  if($('#btnAccept').is(':checked')) {
    $('#btnSubmit').removeAttr('disabled');
  } else {
    $('#btnSubmit').attr('disabled','disabled');
  }
}