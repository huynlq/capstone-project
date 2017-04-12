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
            if (response.msg === '') {
                writeCookie('username', username, 7);
                writeCookie('role', 'User', 7);
                writeCookie('user', response.id, 7);
                window.location.replace(location.origin + '/');
            }
            else {
                $('#errMsg').html(response.msg);
            }
        });    
    } else {
        $('#errMsg').html("Email is not valid");
    }	
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
            writeCookie('user', response.id, 7);
            window.location.replace(location.origin + '/');
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

// Validate Email
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}