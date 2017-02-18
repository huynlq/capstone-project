// DOM Ready ===============================================

$(document).ready(function() {

    // Login button click
    $('#btnLogin').on('click', login);

    // Register button click
    $('#btnRegister').on('click', register);

});

// Functions ===============================================

function register() {
	var username = $('#txtRegisterUsername').val();
	var email    = $('#txtRegisterEmail').val();
	var password = $('#txtRegisterPassword').val();

	//Login Success => Add new user to database
    var newUser = {
        'username': username,
        'password': password,
        'email': email,
        'role': "User",
        'fullName': '',
        'phoneNumber': '',
        'address': '',
        'avatar': '',
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
        if (response.msg === '') {
            writeCookie('username', username, 7);
            writeCookie('role', 'User', 7);
            window.location.replace(location.origin + '/index');
        }
        else {
        	$('#errMsg').html(response.msg);
        }
    });
}

function login() {
	var username = $('#txtUsername').val();
	var password = $('#txtPassword').val();

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
            window.location.replace(location.origin + '/index');
        }
        else {
        	$('#errLoginMsg').html(response.msg);
        }
    });
}

//Create cookie for successful login session
function writeCookie(param, value,days) {
    var date, expires;
    if (days) {
        date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires=" + date.toGMTString();
            }else{
        expires = "";
    }
    document.cookie = param + "=" + value + expires + "; path=/";
}