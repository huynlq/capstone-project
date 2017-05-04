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

function validatePromoteForm() {
  if(validateEmail($('#txtCompanyEmail').val())) {
    sendNotification();
  } else {
    event.preventDefault();
    $('#txtCompanyEmail').focus();
    showAlert('danger',$USERPAGE_ALERT_WRONG_EMAIL);
  }
}

function sendNotification() {
  var userData;

  $.ajax({
    type: 'GET',
    url: '/users/id/' + readCookie('user'),
    async: false
  }).done(function( docs ) {
    userData = docs;
  });

  $.getJSON('/users/role/Admin', function(data) {
    for(var i = 0; i < data.length; i++) {
      var newNotification = {
        'userId': data[i]._id,
        'content': '<b>' + userData.username + '</b> muốn đăng kí làm <b>"' + $('#txtPosition').val() + '"</b> với tư cách là <b>"' + $('#txtCompanyName').val() + '"</b>',
        'link': '/users/',
        'markedRead': 'Unread',
        'dateCreated': new Date()
      }

      $.ajax({
          type: 'POST',
          data: newNotification,
          url: '/notifications/addnotification',
          dataType: 'JSON'
      }).done(function( response ) {

          // Check for successful (blank) response
          if (response.msg !== '') {

              // If something goes wrong, alert the error message that our service returned
              showAlert('error', $LAYOUT_ERROR + response.msg);

          } else {
            var socket = io.connect('http://localhost:3000');
            socket.emit('notification', newNotification);
          }
      });
    }
  });
}


function validateCompanyForm() {
  if(!validateEmail($('#txtCompanyEmail').val())){
    event.preventDefault();
    $('#txtCompanyEmail').focus();
    showAlert('danger',$USERPAGE_ALERT_WRONG_EMAIL);
  };
}

// Validate Email
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}