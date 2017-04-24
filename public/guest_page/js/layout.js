// DOM Ready =============================================================
$(document).ready(function() {
    numberField();
    populateLanguageLayout();
    var languageContent = "";
    if(localStorage.getItem('language') == 'vi' || localStorage.getItem('language') == null) {
      languageContent = "<a style='cursor: pointer' onclick='changeLanguage(\"en\")'><img src='https://lipis.github.io/flag-icon-css/flags/4x3/gb.svg' style='height:13px'/></a>";
    } else {
      languageContent = "<a style='cursor: pointer' onclick='changeLanguage(\"vi\")'><img src='https://lipis.github.io/flag-icon-css/flags/4x3/vn.svg' style='height:13px'/></a>";
    }

    // Check Login
    var loginSession = readCookie("user");

    if(loginSession != '') {
      $.getJSON( '/users/id/' + loginSession, function( data ) {
        if(data.markBanned == 1 || data == '') {
          // Automatically sign out if user data is deleted or being banned
          signOut();
        } else {
          $.getJSON( '/notifications/number/' + loginSession, function( countNoti ) {
            var noti = "";
            if(countNoti > 0) {
              noti = '<li><a href="/notifications"><i class="fa fa-envelope-o"></i> <span class="badge" style="background-color: red">' + countNoti + '</span></a></li>';
            } else {
              noti = '<li><a href="/notifications"><i class="fa fa-envelope-o"></i></a></li>';
            }
            $('#navbar').html('<li>' + $LAYOUT_NAVBAR_WELCOME + data.username + '</li>' +
                              '<li>|</li>' +
                              noti +
                              '<li>|</li>' +
                              '<li>' + languageContent + '</li>' +
                              '<li>|</li>' +
                              '<li><a style="cursor: pointer" onclick="signOut()">' + $LAYOUT_NAVBAR_SIGNOUT + '</a>' +
                              '</li>');
            $('#navbar-user').html($LAYOUT_NAVBAR_WELCOME + data.username);
            $('#navbar-signlink').html("<a onclick='signOut()'>" + $LAYOUT_NAVBAR_SIGNOUT + "</a>");
            if(data.role == "Producer") {
              $('#navbar-below').html($('#navbar-below').html() + '<li><a>' + $LAYOUT_NAVBAR_PRODUCER + '  <i class="fa fa-chevron-circle-down" style="font-size: 10px" aria-hidden="true"></i></a>' +
                                                                    '<ul class="submenu">' +
                                                                      '<li class="submenu-item"><a href="/my">' + $LAYOUT_NAVBAR_USER_PAGE + '</a></li>' +
                                                                      '<li class="submenu-item"><a href="/events">' + $LAYOUT_NAVBAR_EVENT_LIST + '</a></li>' +
                                                                      '<li class="submenu-item"><a href="/events/creator_event">' + $LAYOUT_NAVBAR_EVENT_CREATE + '</a></li>' +
                                                                    '</ul>' +
                                                                  '</li>');
            } else if(data.role == "Admin") {
              $('#navbar-below').html($('#navbar-below').html() + '<li><a>' + $LAYOUT_NAVBAR_ADMIN + '  <i class="fa fa-chevron-circle-down" style="font-size: 10px" aria-hidden="true"></i></a>' +
                                                                    '<ul class="submenu">' +
                                                                      '<li class="submenu-item"><a href="/my">' + $LAYOUT_NAVBAR_USER_PAGE + '</a></li>' +
                                                                      '<li class="submenu-item"><a href="/users">' + $LAYOUT_NAVBAR_USER_LIST + '</a></li>' +
                                                                      '<li class="submenu-item"><a href="/events">' + $LAYOUT_NAVBAR_EVENT_LIST + '</a></li>' +
                                                                      '<li class="submenu-item"><a href="/posts">' + $LAYOUT_NAVBAR_POST_LIST + '</a></li>' +
                                                                      '<li class="submenu-item"><a href="/posts/creator">' + $LAYOUT_NAVBAR_POST_CREATE + '</a></li>' +                                                                  
                                                                    '</ul>' +
                                                                  '</li>');
            } else if(data.role == "Sponsor") {
              $('#navbar-below').html($('#navbar-below').html() + '<li><a>' + $LAYOUT_NAVBAR_USER + '  <i class="fa fa-chevron-circle-down" style="font-size: 10px" aria-hidden="true"></i></a>' +
                                                                    '<ul class="submenu">' +
                                                                      '<li class="submenu-item"><a href="/my">' + $LAYOUT_NAVBAR_USER_PAGE + '</a></li>' +                                                                      
                                                                    '</ul>' +
                                                                  '</li>');
            } else {
              $('#navbar-below').html($('#navbar-below').html() + '<li><a>' + $LAYOUT_NAVBAR_USER + '  <i class="fa fa-chevron-circle-down" style="font-size: 10px" aria-hidden="true"></i></a>' +
                                                                    '<ul class="submenu">' +
                                                                      '<li class="submenu-item"><a href="/my">' + $LAYOUT_NAVBAR_USER_PAGE + '</a></li>' +
                                                                      '<li class="submenu-item"><a href="/promote">' + $LAYOUT_NAVBAR_PROMOTE + '</a></li>' +
                                                                    '</ul>' +
                                                                  '</li>');
            }
          });
        }                
      });
    } else {
      $('#navbar').html('<li>' + $LAYOUT_NAVBAR_WELCOME + $LAYOUT_NAVBAR_GUEST + '</li>' +
                          '<li>|</li>' +
                          '<li>' + languageContent + '</li>' +
                          '<li>|</li>' +
                          '<li><a onclick="showLogin()" style="cursor: pointer">' + $LAYOUT_NAVBAR_SIGNIN + '</a>' +
                          '</li>');
    }

    populateFeed('1562432787368293','404393089920980|jCrsml4DJDN41CWNUZCQZYV0_LQ');
    //$('.fb-share-button').attr('data-href', window.location.href);
    console.log(window.location.href);

    //========================== DIALOG HIDING FUNCTIONS ===================

    var loginDialog = $( "#login-form" ).dialog({
          autoOpen: false,
          show: {
              effect: "fade",
              duration: 200
            },
          hide: {
              effect: "fade",
              duration: 200
            },
          modal: true,
          resizable: true,
          width: 500
    });

    var registerDialog = $( "#register-form" ).dialog({
          autoOpen: false,
          show: {
              effect: "fade",
              duration: 200
            },
          hide: {
              effect: "fade",
              duration: 200
            },
          modal: true,
          resizable: true,
          width: 500
    });    
});

// Functions =============================================================

function changeLanguage(lang) {
  localStorage.setItem('language', lang);
  location.reload();
}

function populateLanguageLayout() {
  $('#welcome').html($LAYOUT_NAVBAR_WELCOME + $LAYOUT_NAVBAR_GUEST);
  $('#login').html($LAYOUT_NAVBAR_SIGNIN);
  $('#navbar-home').html($LAYOUT_NAVBAR_HOME);
  $('#navbar-about').html($LAYOUT_NAVBAR_ABOUT);
  $('#navbar-events').html($LAYOUT_NAVBAR_EVENTS);
  $('#navbar-news').html($LAYOUT_NAVBAR_NEWS);
  $('#navbar-board').html($LAYOUT_NAVBAR_BOARD);
  $('#navbar-sponsors').html($LAYOUT_NAVBAR_SPONSORS);
  $('#about-us').html($LAYOUT_FOOTER_ABOUT);
  $('#about-us-desc').html($LAYOUT_FOOTER_ABOUT_DESC);

  $('#login-form').attr('title', $LAYOUT_FORM_LOGIN_HEADER);
  $('#register-form').attr('title', $LAYOUT_FORM_REGISTER_HEADER);
  $('.form-username').attr('placeholder',$LAYOUT_FORM_LOGIN_USERNAME);
  $('.form-password').attr('placeholder',$LAYOUT_FORM_LOGIN_PASSWORD);
  $('.form-email').attr('placeholder',$LAYOUT_FORM_REGISTER_EMAIL);
  $('#btnLogin').attr('value',$LAYOUT_FORM_LOGIN_BUTTON);
  $('#btnShowLogin').html($LAYOUT_FORM_LOGIN_BUTTON + " >>");
  $('#btnRegister').attr('value',$LAYOUT_FORM_REGISTER_BUTTON);
  $('#btnShowRegister').html($LAYOUT_FORM_REGISTER_BUTTON + " >>");
}

//Populate Facebook feed
function populateFeed(pageId, accessToken) {
  $.getJSON( 'https://graph.facebook.com/' + pageId + '/feed?access_token=' + accessToken + '&limit=1', function( data ) {
    var content = "";
    var message = "";
    var messageContent = "";
    $.each(data.data, function(){
      messageContent = "";
      message = this.message.split(' ');
      if(message.length > 50) {
        for(var i = 0; i < 50; i++) {
          if(i == 49) {
            messageContent += message[i] + '...';
          } else {
            messageContent += message[i] + ' ';
          }          
        }
      } else {
        messageContent = this.message;
      }
      content = '<li class="tweet">' +
                  '<div data-href="https://www.facebook.com/' + this.id + '" data-width="500" data-show-text="true" class="fb-post">' +
                    '<blockquote cite="https://www.facebook.com/' + this.id + '" class="fb-xfbml-parse-ignore">Posted by <a href="https://www.facebook.com/' + this.id.split('_')[0] + '">Facebook</a> on <a href="https://www.facebook.com/' + this.id + '">Thursday, August 27, 2015</a></blockquote>' +
                  '</div>' +
                '</li>';
      $('#feed').html($('#feed').html() + content);
    });
  });
}

//Read cookie
function readCookie(name) {
    var i, c, ca, nameEQ = name + "=";
    ca = document.cookie.split(';');
    for(i=0;i < ca.length;i++) {
        c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return '';
}

//Delete cookie
function deleteCookie(name) {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

//Get Notifications
function populateNotifications() {
    var id = readCookie('user');
    if(id != '') {        
        var counter = 0;
        var content = "";
        var dateCreated = "";
        var time = "";
        var notiCounter = "";
        $.getJSON( '/notifications/' + id, function( data ) {
            $.each(data, function(){  
                notiCounter++;
                if(notiCounter < 10) {
                    dateCreated = new Date(this.dateCreated);
                    time = dateCreated.getHours() + ":" + dateCreated.getMinutes() + " " + dateCreated.getDate() + "/" + dateCreated.getMonth() + "/" + dateCreated.getFullYear();
                    
                    content+= '<li>' +
                              '<a>' +                                
                                '<span class="message">' +
                                  this.content +
                                '</span>' +                                
                                '<span>' +
                                  '<span style="font-size: 11px;font-style: italic;font-weight: 700;position: absolute;right: 35px;">' + time + '</span>' +
                                '</span>' +
                                '<br>' +
                              '</a>' +
                            '</li>'
                }

                if(this.markedRead == "Unread") {
                    counter++;
                }
            });
            var counterContent = '';
            if(counter != 0)
                counterContent = '<span class="badge bg-green">' + counter + '</span>';
            var mainContent = '<a href="javascript:;" class="dropdown-toggle info-number" data-toggle="dropdown" aria-expanded="false" onclick="readNotification()">' +
                '<i class="fa fa-envelope-o"></i>' +
                counterContent +
              '</a>' +
              '<ul id="menu1" class="dropdown-menu list-unstyled msg_list" role="menu">';            
            var endContent = '<li>' +
                      '<div class="text-center">' +
                        '<a>' +
                          '<strong>See All Notifications</strong>' +
                          '<i class="fa fa-angle-right"></i>' +
                        '</a>' +
                      '</div>' +
                    '</li>' +
                  '</ul>';
            $('#notiBar').html(mainContent + content + endContent);
        });
    }
}

//Sign Out Function
function signOut() {
    deleteCookie('user');
    deleteCookie('role');
    deleteCookie('username');
    window.location.replace('/');
}

//Show alert | type = {"info", "success", "danger", "warning"}
function showAlert(type, message) {
  $('#alert_placeholder').html('<div class="alert alert-' + type + ' fade in alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><span id="alert_message"><strong>' + message + '</strong></span></div>');
}

// Validate number field
function numberField() {
  $('.numberField').keydown(function (e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
         // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) || 
         // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
             // let it happen, don't do anything
             return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
  });
}

// Validate Email
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// Show Login Dialog
function showLogin() {
  $('#txtLoginUsername').val("");
  $('#txtLoginPassword').val("");  
  $('#errLoginMsg').html("");
  $( "#register-form" ).dialog('close');
  $( "#login-form" ).dialog('open');
}

// Login function
function login() {
  event.preventDefault();
  var username = $('#txtLoginUsername').val();
  var password = $('#txtLoginPassword').val();

  //Login Success => Add new user to database
  var user = {
      'username': username,
      'password': password
  }

  // Use AJAX to post the object to our adduser service        
  $.ajax({
      type: 'POST',
      data: user,
      url: '/login',
      dataType: 'JSON'
  }).done(function( response ) {
      // Check for successful (blank) response
      if (response.msg === '') {
          writeCookie('username', username, 7);
          writeCookie('role', response.role, 7);
          writeCookie('user', response.id, 7);
          window.location.replace(window.location.href);
      }
      else if(response.msg == 1) {
        $('#errLoginMsg').html($LAYOUT_FORM_LOGIN_MSG_INVALID);
      } else {
        $('#errLoginMsg').html($LAYOUT_FORM_LOGIN_MSG_BANNED + response.reason);
      }
  });
}

// Show Register Dialog
function showRegister() {
  $('#txtRegisterUsername').val("");
  $('#txtRegisterPassword').val("");  
  $('#txtRegisterEmail').val("");  
  $('#errRegisterMsg').html("");
  $( "#login-form" ).dialog('close');
  $( "#register-form" ).dialog('open');
}

// Register function
function register() {
  event.preventDefault();
  var username = $('#txtRegisterUsername').val();
  var email    = $('#txtRegisterEmail').val();
  var password = $('#txtRegisterPassword').val();

  if(validateEmail(email)) {
      //Login Success => Add new user to database
      var newUser = {
          'username': username,
          'password': password,
          'email': email,
          'role': "User",
          'fullName': '',
          'phoneNumber': '',
          'address': '',
          'image': '',
          'markBanned': '0',
          'dateCreated': Date(),
          'dateModified': Date(),
          'deleteFlag': ''
      }

      // Use AJAX to post the object to our adduser service        
      $.ajax({
          type: 'POST',
          data: newUser,
          url: '/register',
          dataType: 'JSON'
      }).done(function( response ) {
          // Check for successful (blank) response
          console.log(response.msg);
          if (response.msg === '') {
              writeCookie('username', username, 7);
              writeCookie('role', 'User', 7);
              writeCookie('user', response.id, 7);
              window.location.replace(window.location.href);
          } else if (response.msg == 1) {
              $('#errRegisterMsg').html($LAYOUT_USER_EXIST_MESSAGE);
          } else {
            $('#errRegisterMsg').html(response.msg);
          }
      });    
  } else {
      $('#errRegisterMsg').html($LAYOUT_FORM_REGISTER_MSG_EMAIL);
  } 
}