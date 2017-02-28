// DOM Ready ===============================================

$(document).ready(function() {
	var id = readCookie("user");

  $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
  } );

  $('[data-toggle="tooltip"]').tooltip(); 

  var author = $('#userId').html();

  $.getJSON( '/users/id/' + author, function( data ) {
      // For each item in our JSON, add a table row and cells to the content string
      $('#author').html(data.username);
  });

  var content = $('#content').html();

  $('#postContent').html(content.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));

});

// Functions ===============================================
