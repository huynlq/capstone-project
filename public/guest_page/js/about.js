// DOM Ready =============================================================
$(document).ready(function() {
	var user = readCookie('user');
	if(user != '') {
		$.getJSON( '/users/id/' + user, function( data ) {
			populateAboutButtons(data.role);
		});		
	} else {
		populateAboutButtons("Guest");
	}

	populateLanguage();
})

// FUNCTIONS =============================================================

function populateLanguage() {
	$('#header').html($ABOUT_HEADER);
	$('#header-desc').html($ABOUT_HEADER_DESC);
	$('#header-about').html($ABOUT_HEADER_ABOUT);
	$('#about-desc').html($ABOUT_ABOUT);
	$('#header-team').html($ABOUT_HEADER_TEAM);
	$('#header-you').html($ABOUT_HEADER_YOU);
	$('#you-desc').html($ABOUT_YOU);
	$('#volunteer-desc').html($ABOUT_VOLUNTEER);
	$('#sponsor-desc').html($ABOUT_SPONSOR);
	$('#producer-desc').html($ABOUT_PRODUCER);
	$('#volunteer-btn').html($ABOUT_VOLUNTEER_BTN);
	$('#sponsor-btn').html($ABOUT_SPONSOR_BTN);
	$('#producer-btn').html($ABOUT_PRODUCER_BTN);
}

function populateAboutButtons(role) {
	if(role == "User") {

	} else if(role == "Guest") {
		$('#btnPromote1').removeAttr('href');
		$('#btnPromote2').removeAttr('href');
		$('#btnPromote1').attr('onclick','showLogin()');
		$('#btnPromote2').attr('onclick','showLogin()');
	} else {
		$('#btnPromote1').attr('disabled','disabled');
		$('#btnPromote2').attr('disabled','disabled');
	}
}