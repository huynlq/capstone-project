		
$(function(){

	/*  Populate countdown
 	================================================*/ 
 	populateLanguage();
 	populateButton();
 	populatePosts();

});

function populateLanguage() {
	$('#header').html($BOARD_HEADER);
	$('#header-desc').html($BOARD_HEADER_DESC);
	$('#th-title').html($BOARD_TABLE_TITLE);
	$('#th-author').html($BOARD_TABLE_AUTHOR);
	$('#th-comment').html($BOARD_TABLE_COMMENT);
	$('#th-date').html($BOARD_TABLE_DATE);
	$('#btnCreatePost').html($BOARD_CREATE_POST);
}

function populateButton() {
	if(readCookie('user') == '') {
		$('#btnCreator').attr('onclick','showLogin()');
	}	
}

function populatePosts() {
	var counter = 0;
	var dates = "";
	var yearStart = "";
	var monthStart = "";
	var dateStart = "";
	var hourStart = "";
	var minStart = "";
	var yearEnd = "";
	var monthEnd = "";
	var dateEnd = "";

	var dayStart = "";
	var dayEnd = ""

	$('#listPosts').DataTable().clear().draw();

	// jQuery AJAX call for JSON
	$.ajax({
        url: '/posts/board',
        dataType: 'json',
        async: false,
        success: function( data ) {
        	var counter = 0;
        	var content = "";
        	var dateCreated;	
        	var comment = 0;
        	var user = "";

        	$.each(data, function(){
        		counter++;

        		dateCreated = new Date(this.dateCreated);

        		$.ajax({
		            url: '/posts/commentnumber/' + this._id,
		            dataType: 'json',
		            async: false,
		            success: function( data ) {
		                comment = data;
		            }
		        });

		        $.ajax({
		            url: '/users/id/' + this.userId,
		            dataType: 'json',
		            async: false,
		            success: function( data ) {
		                user = '<a href="/users/' + data._id + '">' + data.username + '</a>';
		            }
		        });

        		$('#listPosts').DataTable().row.add([
	                counter,
	                '<a href="/posts/' + this._id + '">' + this.postName + '</a>',
	                user,
	                comment,
	                dateCreated.toLocaleTimeString() + ' - ' + dateCreated.toLocaleDateString()
	            ]).draw( false );
    		});        		
    	}
    });
}