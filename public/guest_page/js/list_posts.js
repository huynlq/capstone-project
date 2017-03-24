		
$(function(){

	/*  Populate countdown
 	================================================*/ 
 	populateLanguage();
 	populatePosts();

});

function populateLanguage() {
	$('#header').html($POSTLIST_HEADER);
	$('#header-desc').html($POSTLIST_HEADER_DESC);
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

	// jQuery AJAX call for JSON
	$.ajax({
        url: '/posts/news',
        dataType: 'json',
        async: false,
        success: function( data ) {
        	var counter = 0;
        	var content = "";
        	var date = "";
        	var dateString = "";
        	$.each(data, function(){
    			date = new Date(this.dateCreated);
        		dateString = date.toLocaleDateString();
        		counter ++;
        		content = 	'<div class="row col-md-12 col-xs-12" style="margin: 20px 0">' +
							  '<div class="col-md-6 col-xs-12">' +
							    '<a href="/posts/' + this._id + '"><div style="background-image:url(\'' + this.postImage + '\')" class="thumb"></div></a>' +
							  '</div>' +
							  '<div class="col-md-6 col-xs-12">' +
							    '<a href="/posts/' + this._id + '"><h3 style="text-transform: uppercase;">' +
							    	this.postName +
							    '</h3></a>' +
							    '<p>' + this.postDescription + '</p>' +
							  '</div>' +
							  '<div style="position:absolute; bottom: 20px; right: 0px">' +
							  	'<span style="margin-right: 20px">' + dateString + '</span>' +
							  	'<a href="/posts/' + this._id + '" class="btn btn-primary"><strong>' + $POSTLIST_READ_MORE + '</strong></a>' +
							  '</div>' +
							'</div>';
        		$('#listPosts').html($('#listPosts').html() + content);
    		});        		
    	}
    });
}