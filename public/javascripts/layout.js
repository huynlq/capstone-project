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