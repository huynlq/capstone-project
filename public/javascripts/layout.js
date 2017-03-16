// DOM Ready =============================================================
$(document).ready(function() {

    // Check Login
    var loginSession = readCookie("username");

    if(loginSession != '') {
        $('#usernameCookie').html(loginSession);
        $('#usernameCookieNav').html(loginSession + " ");
    } else {
        $('#usernameCookie').html("Guest");
        $('#nav-bar-ul').html("<li><a href='/login'>Please Log In</a></li>")
    }

    populateNotifications();
    populateNavBar();
    populateSidebar();
});

// Functions =============================================================

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

//Get Sidebar
function populateSidebar() {
    var id = readCookie('user');
    var content = '';
    if(id == '') {
        content +=  '<li><a><i class="fa fa-users"></i> Guest <span class="fa fa-chevron-down"></span></a>'+
                        '<ul class="nav child_menu">'+
                          '<li><a href="/login" readonly="readonly">Log In</a></li>'+
                        '</ul>'+
                      '</li>';
        $('#sidebar_menu').html($('#sidebar_menu').html() + content);
    } else {
        content +=  '<li><a><i class="fa fa-user"></i>User<span class="fa fa-chevron-down"></span></a>' +
                        '<ul class="nav child_menu">' +
                          '<li><a href="/my">My User Page</a></li>' +
                          '<li><a href="#" onclick="signOut()">Sign Out</a></li>' +
                        '</ul>' +
                      '</li>';

        $.ajax({
            url: '/users/id/' + id,
            dataType: 'json',
            async: false,
            success: function( data ) {
                if(data.role == 'Admin') {
                    content += '<li><a><i class="fa fa-user"></i> Admin<span class="fa fa-chevron-down"></span></a>'+
                                    '<ul class="nav child_menu">'+
                                      '<li><a href="/admin_dashboard">Dashboard (WIP)</a></li>'+
                                      '<li><a href="/events">Event List</a></li>'+
                                      '<li><a href="/users">User List</a></li>'+
                                      '<li><a href="/posts">Post List</a></li>'+
                                    '</ul>'+
                                  '</li>';
                } else if(data.role == 'Producer') {
                    content += '<li><a><i class="fa fa-street-view"></i> Producer <span class="fa fa-chevron-down"></span></a>'+
                                    '<ul class="nav child_menu">'+
                                      '<li><a href="/events">My Events</a></li>'+
                                    '</ul>'+
                                  '</li>';
                }

                $('#sidebar_menu').html($('#sidebar_menu').html() + content);
            }
        });
    }
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

// Populate navbar
function populateNavBar() {
    var id = readCookie('user');
    $.getJSON( '/users/id/' + id, function( data ) {
        $('#layoutUserImage').attr('src',data.image);
        $('#sidebarUserImage').attr('src',data.image);
    });   
}

//Function read notification
function readNotification() {
    var id = readCookie('user');

    var notiStatus = {
        'markedRead' : 'Read'
    };

    $.ajax({
      type: 'PUT',
      data: notiStatus,
      url: '/notifications/markread/' + id,
      dataType: 'JSON'
  }).done(function( response ) {
        populateNotifications();
  });
}

//Sign Out Function
function signOut() {
    deleteCookie('user');
    deleteCookie('role');
    deleteCookie('username');
    window.location = "/login";
}