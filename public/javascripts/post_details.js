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

  populateComments();
  populateRate();

  $('#postRating').on('click', 'a.linkupvotepost', upvote);
  $('#postRating').on('click', 'a.linkdownvotepost', downvote);

  $('#commentPane').on('click', 'a.linkupvotecomment', upvote);
  $('#commentPane').on('click', 'a.linkdownvotecomment', downvote);

  $('#commentPane').on('click', 'a.linkeditcomment', editComment);
  $('#commentPane').on('click', 'a.linkdeletecomment', deleteComment);  

});

// Functions ===============================================

// Populate Post Rating
function populateRate() {
  var postId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
  var userRating = "";
  var postRating = "";
  var ratingContent = "";

  $.ajax({
    url: '/ratings/id/' + postId + '/' + readCookie('user'),
    dataType: 'json',
    async: false,
    success: function(dataUserRating) {
      if(dataUserRating != '' && dataUserRating != null) {
        userRating = dataUserRating.ratingPoint;
      }
    }
  });

  $.ajax({
    url: '/ratings/id/' + postId,
    dataType: 'json',
    async: false,
    success: function(dataRating) {
      postRating = dataRating;
    }
  });
  
  ratingContent = '<div class="row" style="text-align:center;">';
  if(userRating <= 0 && readCookie('user') != '')
    ratingContent += '<a data-toggle="tooltip" title="Upvote" class="linkupvotepost" rel="' + postId + '"><i class="glyphicon glyphicon-chevron-up" style="font-size:15px;margin:10px;color:green"></i></a>';
  ratingContent += '<br><span style="font-size: 25px"><b>' + postRating + '</b></span><br>';
  if(userRating >= 0 && readCookie('user') != '')
    ratingContent += '<a data-toggle="tooltip" data-placement="bottom" title="Downvote" class="linkdownvotepost" rel="' + postId + '"><i class="glyphicon glyphicon-chevron-down" style="font-size:15px;margin:10px;color:red"></i></a>';
  ratingContent += '</div>';

  $('#postRating').html(ratingContent);
  $('[data-toggle="tooltip"]').tooltip();   
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
                              '</a>' +
                              '<a data-toggle="tooltip" title="Delete" class="btn btn-danger btn-xs linkdeletecomment" rel="' + commentData._id + '" href="#">' +
                                '<span class="glyphicon glyphicon-remove"></span>' +
                              '</a>' +
                            '</div>';
          } else {
            optionContent = '';
          }

          date = new Date(commentData.dateCreated);

          $.ajax({
            url: '/ratings/id/' + commentData._id + '/' + readCookie('user'),
            dataType: 'json',
            async: false,
            success: function(dataUserRating) {
              if(dataUserRating != '' && dataUserRating != null) {
                userRating = dataUserRating.ratingPoint;
              }
            }
          });

          $.ajax({
            url: '/ratings/id/' + commentData._id,
            dataType: 'json',
            async: false,
            success: function(dataRating) {
              commentRating = dataRating;
            }
          });

          
          ratingContent = '<div class="row" style="text-align:center;">';
          if(userRating <= 0 && readCookie('user') != '')
            ratingContent += '<a data-toggle="tooltip" title="Upvote" class="linkupvotecomment" rel="' + commentData._id + '"><i class="glyphicon glyphicon-chevron-up" style="font-size:15px;margin:10px;color:green"></i></a>';
          ratingContent += '<br><span style="font-size: 25px"><b>' + commentRating + '</b></span><br>';
          if(userRating >= 0 && readCookie('user') != '')
            ratingContent += '<a data-toggle="tooltip" data-placement="bottom" title="Downvote" class="linkdownvotecomment" rel="' + commentData._id + '"><i class="glyphicon glyphicon-chevron-down" style="font-size:15px;margin:10px;color:red"></i></a>';
          ratingContent += '</div>';

          content = '<div class="row" style="margin: 20px">' +
                      '<div class="col-sm-3"></div>' +
                      '<div class="col-sm-5 col-sm-12" style="background-color: white; padding-left: 0">' +
                        '<div class="col-sm-1 col-xs-1" style="text-align: center; padding: 10px; height: 150px; background-color: #F7F7F7">' +
                          ratingContent +
                        '</div>' +
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

// Post Comment
function postComment() {
  console.log("Comment");
  console.log($('#txtCommentContent').val());
  if($('#txtCommentContent').val() != '') {
    var postId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
    var userId = readCookie('user');
    var comment = {
      'postId': postId,
      'commentId': '',
      'userId': userId,
      'content': $('#txtCommentContent').val(),
      'rating': 0,
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

// Upvote
function upvote(event) {
  event.preventDefault();

  var subjectId = $(this).attr('rel');
  var userId = readCookie('user');
  var rating = {
    'userId': userId,
    'subjectId': subjectId,
    'ratingPoint': 1
  };

  $.ajax({
      type: 'POST',
      data: rating,
      url: '/ratings/updaterating',
      dataType: 'JSON'
  }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg !== '') {

          // If something goes wrong, alert the error message that our service returned
          alert('Error: ' + response.msg);

      } else {

        populateRate();
        populateComments();

      }
  });
}

// Downvote
function downvote(event) {
  event.preventDefault();

  var subjectId = $(this).attr('rel');
  var userId = readCookie('user');
  var rating = {
    'userId': userId,
    'subjectId': subjectId,
    'ratingPoint': -1
  };

  $.ajax({
      type: 'POST',
      data: rating,
      url: '/ratings/updaterating',
      dataType: 'JSON'
  }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg !== '') {

          // If something goes wrong, alert the error message that our service returned
          alert('Error: ' + response.msg);

      } else {

        populateRate();
        populateComments();

      }
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

  $('#commentButtons').html('<div class="col-md-6 col-sm-6"></div>' +
                            '<div class="col-md-1 col-sm-1 col-xs-12">' +
                              '<a class="btn btn-info col-xs-12" style="float: right" onclick="confirmEditComment()">Edit</a>' +
                            '</div>' +
                            '<div class="col-md-1 col-sm-1 col-xs-12">' +
                              '<a class="btn btn-danger col-xs-12" style="float: right" onclick="cancelEditComment()">Cancel</a>' +
                            '</div>');
 $('#txtCommentContent').focus();
}

// Cancel edit comment
function cancelEditComment(event) {
  $('#txtCommentId').val('');
  $('#txtCommentContent').val('');
  $('#commentButtons').html('<div class="col-md-7 col-sm-7"></div>' +
                            '<div class="col-md-1 col-sm-1 col-xs-12">' +
                              '<a class="btn btn-info col-xs-12" style="float: right" onclick="postComment()">Submit</a>' +
                            '</div>');
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