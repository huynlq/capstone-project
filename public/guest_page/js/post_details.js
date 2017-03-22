// DOM Ready ===============================================

$(document).ready(function() {
	var id = readCookie("user");
  var postId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];

  $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
  } );

  $('[data-toggle="tooltip"]').tooltip(); 

  var content = $('#content').html();

  $('#postContent').html(content.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));

  
  var date = new Date($('#postDate').html());
  $('#eventDay').html(date.getDate());
  $('#eventMonthYear').html(date.toLocaleString("en-us", { month: "long" }) + ', ' + date.getFullYear());
  $('#eventTime').html(date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes());

  populateAuthor();
  populateComments();
  populateEditPane(postId);

  $('#commentPane').on('click', 'a.linkeditcomment', editComment);
  $('#commentPane').on('click', 'a.linkdeletecomment', deleteComment);  

  
});

// Functions ===============================================

function populateEditPane(postId) {
  var content = "";  

  if($('#dateCreated').html() != $('#dateModified').html()) {    
    $.getJSON( '/users/id/' + $("#lastEditedUser").html(), function(data) {
      var date = new Date($('#dateModified').html());
      content += '<i style="float:right"><b>Last edited in ' + date.toLocaleString("vn", { date:"long"}) + ' by ' +
                  '<a href="/users/' + data._id + '">' + data.username + '</a></b></i>';
      $('#editPostPane').html(content);
      if($('#txtUserId').val() == readCookie('user')) {
        $('#editPostPane').html($('#editPostPane').html() + '<br><br><a class="col-sm-12 btn btn-info" href="/posts/updatepost/' + postId + '">Edit Post</a>');
      }
    });    
  }
}

function populateAuthor() {
  $.getJSON( '/users/id/' + $("#txtUserId").val(), function(data) {
    $("#linkUser").attr('href', '/users/' + data._id);
    $('#txtUserImageSrc').attr('src', data.image);
    $('#txtUsername').html('<a href="/users/' + data._id + '">' + data.username + '</a>');
    $('#txtUserPhone').html(data.phoneNumber);
    $('#txtUserEmail').html('<a href="mailto:' + data.email + '">' + data.email + '</a>');
  });
}

// Post Comment
function postComment() {
  if($('#txtCommentContent').val() != '') {
    var postId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
    var userId = readCookie('user');
    var comment = {
      'postId': postId,
      'commentId': '',
      'userId': userId,
      'content': $('#txtCommentContent').val(),
      'dateCreated': new Date(),
      'dateModified': new Date()
    };


    $.ajax({
        type: 'POST',
        data: comment,
        url: '/posts/addcomment',
        dataType: 'JSON'
    }).done(function( response ) {
        // Check for successful (blank) response
        if (response.msg !== '') {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        } else {
          $('#txtCommentContent').val('');
          populateComments();
        }
    });
  }    
}

// Populate Comments
function populateComments() {
  $('#commentPane').html('');
  if(readCookie('user') == '') {
    $('#commentForm').html('<div class="row" style="text-align: center"><a href="/login" class="btn btn-info">Please Log In To Comment</a></div>');
  }

  var counter = 0;
  var postId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
  var content = "";
  var commentData = "";
  var date = "";
  var optionContent = "";
  var ratingContent = "";
  var userRating = "";
  var commentRating = "";

  $.getJSON( '/posts/comment/' + postId, function( data ) {
    $.each(data, function(){

      commentData = this;
      userRating = 0;
      commentRating = 0;

      $.ajax({
        url: '/users/id/' + commentData.userId,
        dataType: 'json',
        async: false,
        success: function(dataUser) {
          if(commentData.userId == readCookie('user')) {
            optionContent = '<div class="row" style="position:absolute;bottom:15px;right:15px">' +
                              '<a data-toggle="tooltip" title="Edit" class="btn btn-info btn-xs linkeditcomment" rel="' + commentData._id + '" href="#">' +
                                '<span class="glyphicon glyphicon-edit"></span>' +
                              '</a>&nbsp;&nbsp;' +
                              '<a data-toggle="tooltip" title="Delete" class="btn btn-danger btn-xs linkdeletecomment" rel="' + commentData._id + '" href="#">' +
                                '<span class="glyphicon glyphicon-remove"></span>' +
                              '</a>' +
                            '</div>';
          } else {
            optionContent = '';
          }

          date = new Date(commentData.dateCreated);

          content = '<div class="row" style="margin: 20px">' +
                      '<div class="col-sm-12 col-sm-12" style="background-color: white; padding-left: 0">' +
                        '<div class="col-sm-2 col-xs-2" style="text-align: center; padding: 10px; height: 150px">' +
                          '<img src="' + dataUser.image + '" style="width: 50px; height: 50px; margin: 15px"/>' +
                          '<br><a href="/users/' + dataUser._id + '"><b>' + dataUser.username + '</b></a>' +
                          '<br><p>' + date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear() + '</p>' +
                        '</div>' +
                        '<div class="col-sm-9 col-xs-9" style=" padding: 20px; height: 150px">' +
                          '<p>' + commentData.content + '</p>' +                      
                          optionContent +
                        '</div>' +
                      '</div>' +
                      '<div class="col-sm-4"></div>' +                    
                    '</div>';
          $('#commentPane').html($('#commentPane').html() + content);
          $('[data-toggle="tooltip"]').tooltip();   
          counter++;
          $('#countComments').html('(' + counter + ')');
        }
      });
    });      
  });
}

// Show edit comment
function editComment(event) {
  event.preventDefault();

  $('#txtCommentId').val($(this).attr('rel'));
  $.ajax({
    url: '/posts/comment/id/' + $(this).attr('rel'),
    dataType: 'json',
    async: false,
    success: function(data) {
      $('#txtCommentContent').val(data.content);
    }
  });

  $('#commentButtons').html('<div class="col-md-6 col-sm-6 col-xs-12">' +
                              '<a class="btn btn-info col-xs-12" style="float: right" onclick="confirmEditComment()"><i class="glyphicon glyphicon-ok" /></a>' +
                            '</div>' +
                            '<div class="col-md-6 col-sm-6 col-xs-12">' +
                              '<a class="btn btn-danger col-xs-12" style="float: right" onclick="cancelEditComment()"><i class="glyphicon glyphicon-remove" /></a>' +
                            '</div>');
 $('#txtCommentContent').focus();
}

// Cancel edit comment
function cancelEditComment(event) {
  $('#txtCommentId').val('');
  $('#txtCommentContent').val('');
  $('#commentButtons').html('<a style="float: right" onclick="postComment()" class="btn btn-info col-xs-12">Submit</a>');
}

// Edit comment
function confirmEditComment(event) {
  var comment = {
    '_id': $('#txtCommentId').val(),
    'content': $('#txtCommentContent').val(),
    'dateModified': new Date()
  }

  $.ajax({
      type: 'POST',
      data: comment,
      url: '/posts/updatecomment/',
      dataType: 'JSON'
  }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg !== '') {

          // If something goes wrong, alert the error message that our service returned
          alert('Error: ' + response.msg);

      } else {

        cancelEditComment();
        populateComments();

      }
  });
}

// Delete comment
function deleteComment(event) {
  $.ajax({
      type: 'DELETE',
      url: '/posts/deletecomment/' + $(this).attr('rel')
  }).done(function( response ) {

      // Check for a successful (blank) response
      if (response.msg === '') {
        // Update the table
        populateComments();
      } else {
          alert('Error: ' + response.msg);
      }
  });
}