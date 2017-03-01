// DOM Ready ===============================================

$(document).ready(function() {
	var id = readCookie("user");

  $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
  } );

  $('[data-toggle="tooltip"]').tooltip(); 

  var author = $('.userId').html();

  console.log($('.userId').html());

  $.getJSON( '/users/username/' + author, function( data ) {
      $('.userId').attr('href','/users/' + data);
      console.log($('.userId').attr('href'));
  });

  var content = $('#content').html();

  $('#postContent').html(content.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));

});

// Functions ===============================================
