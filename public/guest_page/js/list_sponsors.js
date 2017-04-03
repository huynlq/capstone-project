		
$(function(){

	/*  Populate countdown
 	================================================*/ 
 	populateLanguage();
 	populateSponsors();

});

function populateLanguage() {
	$('#header').html($SPONSORLIST_HEADER);
	$('#header-desc').html($SPONSORLIST_HEADER_DESC);
}

function populateSponsors() {
	$.ajax({
        url: '/users/role/Sponsor',
        dataType: 'json',
        async: false,
        success: function( data ) {
	    	$.each(data, function(){
		    	var content = "<div class='col-md-3 col-sm-3 col-sm-6 col-xs-6'>" +
						        '<div class="reasons-col fadeIn" style="height:300px; margin-bottom: 20px">' +
						        	'<a href="/users/' + this._id + '">' +
						          		'<img src="' + this.companyImage + '" alt=""/>' +						          								  		
								  		'<div class="on-hover" style="height:300px">' +
										  	'<center><h3><strong>' + this.companyName + '</strong></h3></center>' +
										    '<center><p>' + this.companyEmail + '</p></center>' +
										    '<p><i class="fa fa-phone" />&nbsp;&nbsp;&nbsp;' + this.companyPhoneNumber + '</p>' +
										    '<p><i class="fa fa-globe" />&nbsp;&nbsp;&nbsp;' + this.companyWebsite + '</p>' +
								  		'</div>' +
								  	'</a>' +
								'</div>' +
					    	"</div>";    	
		    	$('#listSponsors').html($('#listSponsors').html() + content);
	    	});
        }
    });
}	