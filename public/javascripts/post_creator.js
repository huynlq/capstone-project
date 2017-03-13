// DOM Ready ===============================================

$(document).ready(function() {
	tinymce.init({ 
		selector:'textarea' ,
        theme: 'modern',
        plugins: [
        "advlist autolink lists link image charmap print preview anchor",
        "searchreplace visualblocks code fullscreen",
        "insertdatetime media table contextmenu paste imagetools"
	    ],
	    toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
  		toolbar2: 'print preview media | forecolor backcolor',
	  	imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io']
	});

	if($('#postId').val() != '' && $('#postId').val() != 'undefined') {
		
		$('#creatorForm').attr('action', '/posts/updatepost');
		$('#txtPostType').val($('#postType').html());
		console.log($('#postType').html());
	} else {
		$('#txtPostName').val("");
	}

	populateType();
});

// Functions ===============================================

function submit() {
	console.debug(tinyMCE.activeEditor.getContent());
}

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