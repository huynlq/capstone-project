// DOM Ready ===============================================

$(document).ready(function() {
	var id = readCookie("user");
  var postId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];

  $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
  } );

  $('[data-toggle="tooltip"]').tooltip(); 

  var content = $('#content').html();

  $('#postContent').html(decodeURIComponent(content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, "&").replace(/&quot;/g, '"')));

  
  var date = new Date($('#postDate').html());
  $('#eventDay').html(date.getDate());
  $('#eventMonthYear').html(date.toLocaleString("en-us", { month: "long" }) + ', ' + date.getFullYear());
  $('#eventTime').html(date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes());

  populateLanguage();
  populatePost(postId);
  populateAuthor();
  populateComments();
  populateEditPane(postId);

  $('#commentPane').on('click', 'a.linkeditcomment', editComment);
  $('#commentPane').on('click', 'a.linkdeletecomment', deleteComment);  

  
});

// Functions ===============================================

function populateLanguage() {
  $('#headerDescription').html($POSTDETAILS_HEADER_DESC);
  $('#headerComment').html($POSTDETAILS_HEADER_COMMENT + '<span class="title-under"></span>');
  $('#headerAuthor').html($POSTDETAILS_HEADER_AUTHOR);
  $('#formContent').html($POSTDETAILS_FORM_COMMENT + '<span class="required">*</span>');
  $('#formSubmit').html($POSTDETAILS_FORM_SUBMIT);
}

// Populate Post
function populatePost(postId) {
  $.getJSON( '/posts/details/' + postId, function( data ) {
    if(data.postType != "News") {
      var user = "";
      $.getJSON( '/users/id/' + data.userId, function(dataUser) {        
        user = dataUser.username;
        console.log(user);
        var dateCreated = new Date(data.dateCreated);
        var content = '<div>' +
                        '<span><b>' + $POSTDETAILS_AUTHOR  + ': </b><a href="/users/' + data.userId + '">' + user + '</a></span>' +
                        '<span style="float:right"><b>' + $POSTDETAILS_DATE + ': </b>' + dateCreated.toLocaleTimeString() + ' - ' + dateCreated.toLocaleDateString() + '</span>' +
                      '</div><hr>' +
                      '<h2 class="title-style-2">' + data.postName + ' <span class="title-under"></span></h2>';
        $('#newsPane').html(content);
      });      
    }

    $('#newsPane').removeAttr('style');
  });
}

function populateEditPane(postId) {
  var content = "";  

  if($('#dateCreated').html() != $('#dateModified').html()) {    
    $.getJSON( '/users/id/' + $("#lastEditedUser").html(), function(data) {
      if(data != '') {
        var date = new Date($('#dateModified').html());
        content += '<i style="float:right"><b>' + $POSTDETAILS_LAST_EDITED + ' ' + date.toLocaleString("vn", { date:"long"}) + ' ' + $POSTDETAILS_LAST_EDITED_BY +
                    ' <a href="/users/' + data._id + '">' + data.username + '</a></b></i>';
        $('#editPostPane').html(content);        
      }     
    });    
  }

  $.getJSON( '/users/id/' + readCookie('user'), function(dataUser) {
    if(dataUser != '') {
      if($('#txtUserId').val() == readCookie('user') || dataUser.role == 'Admin') {
        $('#editPostPane').html($('#editPostPane').html() + '<br><hr><div class="pull-right"><a class="btn btn-info" href="/posts/updatepost/' + postId + '"><span class="glyphicon glyphicon-edit">&nbsp;</span><strong>' + $POSTDETAILS_FORM_EDIT + '</strong></a>' +
            '<a class="btn btn-danger" onclick="deletePost(\'' + postId + '\')"><span class="glyphicon glyphicon-remove">&nbsp;</span><strong>' + $POSTDETAILS_FORM_DELETE + '</strong></a></div>');
      }
    }        
  });
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
  if($('#txtCommentContent').val().trim() != '') {
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
    $('#commentForm').html('<div class="row" style="text-align: center"><a href="/login" class="btn btn-info">' + $POSTDETAILS_FORM_LOGIN + '</a></div>');
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
                              '<a data-toggle="tooltip" title="' + $POSTDETAILS_COMMENT_EDIT + '" class="btn btn-info btn-xs linkeditcomment" rel="' + commentData._id + '" href="#">' +
                                '<span class="glyphicon glyphicon-edit"></span>' +
                              '</a>&nbsp;&nbsp;' +
                              '<a data-toggle="tooltip" title="' + $POSTDETAILS_COMMENT_DELETE + '" class="btn btn-danger btn-xs linkdeletecomment" rel="' + commentData._id + '" href="#">' +
                                '<span class="glyphicon glyphicon-remove"></span>' +
                              '</a>' +
                            '</div>';
          } else {
            optionContent = '';
          }

          date = new Date(commentData.dateCreated);

          // content = '<div class="media">' +
          //             '<div class="media-left">' +
          //               '<img src="' + dataUser.image + '" class="media-object" style="width:45px">' +
          //             '</div>' +
          //             '<div class="media-body">' +
          //               '<h3 class="media-heading"><a href="/users/' + dataUser._id + '">' + dataUser.username + '</a> <small><i>' + date.toLocaleDateString() + ' - ' + date.toLocaleDateString() + '</i></small></h3>' +
          //               '<p>' + commentData.content + '</p>' +
          //               optionContent +
          //             '</div>' +
          //           '</div>'

          content = '<div class="media" style="margin: 20px">' +
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
  $('#commentButtons').html('<a style="float: right" onclick="postComment()" class="btn btn-info col-xs-12">' + $POSTDETAILS_FORM_SUBMIT + '</a>');
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
          showAlert('danger', $LAYOUT_ERROR + response.msg);

      } else {

        showAlert('success', $POSTDETAILS_COMMENT_EDIT_ALERT);
        cancelEditComment();
        populateComments();

      }
  });
}

// Delete comment
function deleteComment(event) {
  var r = confirm($POSTDETAILS_COMMENT_DELETE_CONFIRM);
  if (r == true) {
    $.ajax({
      type: 'DELETE',
      url: '/posts/deletecomment/' + $(this).attr('rel')
    }).done(function( response ) {

        // Check for a successful (blank) response
        if (response.msg === '') {
          // Update the table
          showAlert('success', $POSTDETAILS_COMMENT_DELETE_ALERT);
          populateComments();
        } else {
            showAlert('danger', $LAYOUT_ERROR + response.msg);
        }
    });
  }
}

// Delete post
function deletePost(postId) {
  var r = confirm($POSTDETAILS_FORM_DELETE_CONFIRM);
  if (r == true) {
    $.ajax({
      type: 'DELETE',
      url: '/posts/deletepost/' + postId
    }).done(function( response ) {

        // Check for a successful (blank) response
        if (response.msg === '') {
          // Update the table
          window.location = "/community_board";
        } else {
            showAlert('danger', $LAYOUT_ERROR + response.msg);
        }
    });
  }
}