// DOM Ready ===============================================

$(document).ready(function() {
	var id = readCookie("user");

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

});

// Functions ===============================================
