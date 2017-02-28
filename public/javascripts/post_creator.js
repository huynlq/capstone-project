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

	if($('#postId').val() != '') {
		$('#creatorForm').attr('action', '/posts/updatepost');
		$('#txtPostType').val($('#postType').html());
		console.log($('#postType').html());
	} else {

	}
});

// Functions ===============================================

function submit() {
	console.debug(tinyMCE.activeEditor.getContent());
}