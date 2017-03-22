// DOM Ready ===============================================

$(document).ready(function() {
	tinymce.init({ 
	    mode : "specific_textareas",
	    editor_selector : "mceEditor",
	    theme: 'modern',
	    plugins: [
	      "autolink lists link image charmap",
	      "media table contextmenu paste imagetools"
	    ],
	    menubar: false,
	    toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
	    imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io']
	});

	if($('#txtImage').attr('src') != '') {
	    $("#txtImage").attr('style', 'display:block;max-width:100%');
	  } 

	$("#inputPostImage").change(function(e) {

        for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
          
          	var file = e.originalEvent.srcElement.files[i];
          
          	var img = document.createElement("img");
          	var reader = new FileReader();
          	reader.onloadend = function() {
	            var date = (new Date).toString().replace(/ /g,'');
            	img.src = reader.result;
            	$("#txtImage").attr('src', img.src);           
            	$("#txtImage").attr('style', 'display:block;max-width:100%');
            	var extension = img.src.substring(img.src.indexOf("/")+1,img.src.indexOf(";"));
            	$('#txtImageSrc').val("/images/post/" + date + "." + extension);
          	}
          	reader.readAsDataURL(file);          
  	    }
  });

	if($('#txtPostId').val() != '') {
		$('#txtLastEditedUser').val(readCookie('user'));
	} else {
		$('#txtUserId').val(readCookie('user'));	
	}
	
	populateType();
});

// Functions ===============================================

function populateType() {
	var userId = readCookie('user');
	$.getJSON( '/users/id/' + userId, function( data ) {
		if(data.role == "Admin") {
			$('#txtPostType').val("News");
			$('#txtPostType').html($('#txtPostType').html() + '<option>News</option><option>Community Board</option>');
		} else {
			$('#txtPostType').val("Community Board");
			$('#txtPostType').html($('#txtPostType').html() + '<option>Community Board</option>');
			$('#txtPostType').attr('readonly','readonly');
		}
	});
}