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