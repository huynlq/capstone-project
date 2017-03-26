// DOM Ready =============================================================
$(document).ready(function() {
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