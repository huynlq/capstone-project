// DOM Ready ===============================================

$(document).ready(function() {
    populateLanguage();

    $.fn.dataTable.ext.errMode = 'none';

	$('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
    $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
    });    

    populateTables();

    $('#tableAdmins tbody').on('click', 'td a.linkremoveadmin', deleteUser);

    $('#tablePendingUsers tbody').on('click', 'td a.linkapproveuser', approveUser);

    $('#tablePendingUsers tbody').on('click', 'td a.linkdisapproveuser', disapproveUser);

    $('#tableUsers tbody').on('click', 'td a.linkbanuser', banUser);

    $('#tableProducers tbody').on('click', 'td a.linkbanuser', banUser);

    $('#tableSponsors tbody').on('click', 'td a.linkbanuser', banUser);

    $('#tableBannedUsers tbody').on('click', 'td a.linkunbanuser', unbanUser);

    $('#tableProducers tbody').on('click', 'td a.linkdemoteuser', demoteUser);

    $('#tableSponsors tbody').on('click', 'td a.linkdemoteuser', demoteUser);   

    $('[data-toggle="tooltip"]').tooltip();    

    //========================== DIALOG HIDING FUNCTIONS ===================

    var dialog = $( "#ban-reason-form" ).dialog({
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
        width: 400,
        height: 250,
        resizable: false,
        buttons: {
            "OK" : {
            text: "OK",
            id: "confirmBanUser",
                click: function(){
                    confirmBanUser();
                }
            },
            "Cancel" : {
                text: "Cancel",
                click: function() {
                    dialog.dialog( "close" );
                }
            }
        }                
    });

    var dialog2 = $( "#disapprove-reason-form" ).dialog({
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
        width: 400,
        height: 250,
        resizable: false,
        buttons: {
            "OK" : {
            text: "OK",
            id: "confirmDisapproveUser",
                click: function(){
                    confirmDisapproveUser();
                }
            },
            "Cancel" : {
                text: "Cancel",
                click: function() {
                    dialog2.dialog( "close" );
                }
            }
        }                
    }); 
});

// Functions ===============================================

function populateLanguage(){
    $('#header-user').html($LISTUSER_HEADER_USER);
    $('.tab-pending').html($LISTUSER_TAB_PENDING);
    $('.tab-admins').html($LISTUSER_TAB_ADMINS);
    $('.tab-users').html($LISTUSER_TAB_USERS);
    $('.tab-producers').html($LISTUSER_TAB_PRODUCERS);
    $('.tab-sponsors').html($LISTUSER_TAB_SPONSORS);
    $('.tab-banned').html($LISTUSER_TAB_BANNED);

    $('.th-action').html($LISTUSER_TH_ACTION);
    $('.th-username').html($LISTUSER_TH_USER);
    $('.th-fullName').html($LISTUSER_TH_FULLNAME);
    $('.th-companyName').html($LISTUSER_TH_COMPANYNAME);
    $('.th-promote').html($LISTUSER_TH_PROMOTE);
    $('.th-email').html($LISTUSER_TH_EMAIL);
    $('.th-phone').html($LISTUSER_TH_PHONE);
    $('.th-address').html($LISTUSER_TH_ADDRESS);
    $('.th-created').html($LISTUSER_TH_CREATED);
    $('.th-event').html($LISTUSER_TH_EVENT);
    $('.th-reason').html($LISTUSER_TH_REASON);

    $('#adminForm-header').html($LISTUSER_ADMINFORM_HEADER);
    $('#adminForm-username').html($LISTUSER_ADMINFORM_USERNAME);
    $('#adminForm-password').html($LISTUSER_ADMINFORM_PASSWORD);
    $('#adminForm-email').html($LISTUSER_ADMINFORM_EMAIL);
    $('#adminForm-create').html($LISTUSER_ADMINFORM_CREATE);

    $('#ban-reason-form').attr('title', $LISTUSER_BANFORM_TITLE);
    $('#banForm_username').html($LISTUSER_BANFORM_USER);
    $('#banForm_id').html($LISTUSER_BANFORM_ID);
    $('#banForm_reason').html($LISTUSER_BANFORM_REASON);
    $('#banForm_require').html($LISTUSER_BANFORM_REQUIRE);
}

// Create new admin
function createAdmin(){
    var newUser = {
        'username': $('#txtAdminUsername').val(),
        'password': $('#txtAdminPassword').val(),
        'email': $('#txtAdminEmail').val(),
        'role': 'Admin',
        'dateCreated': new Date()
    }

    // Use AJAX to post the object to our adduser service        
    $.ajax({
        type: 'POST',
        data: newUser,
        url: '/users/adduser',
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.msg === '') {

            // Clear the form inputs
            $('#txtAdminUsername').val('');
            $('#txtAdminPassword').val('');
            $('#txtAdminEmail').val('');

            // Update the table
            populateTables();

        }
        else {

            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);

        }
    });
}

// Populate all tables
function populateTables(){
	// jQuery AJAX call for JSON
    $.getJSON( '/users/all', function( data ) {

        var counter = 1;
        var dateCreated = "";
        var tableContent = "";
        var table = $('#tableUsers').DataTable();

        // For each item in our JSON, add a table row and cells to the content string
        showPendingUsers(data);
        showUsers(data);
        showAdmin(data);
        showBannedUser(data);
        showProducers(data);
        showSponsors(data);
        $('[data-toggle="tooltip"]').tooltip(); 
    });    
}

// Populate PendingUsers Table
function showPendingUsers(data) {
    var counter = 0;
    var dateCreated = "";
    var tableContent = "";
    var table = $('#tablePendingUsers').DataTable();
    table.clear().draw();

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
        console.log("ROLE: " + this.role);
        if(this.markBanned != '1' && this.role.indexOf("Pending") !== -1){            
            counter++;
            console.log(counter);
            dateCreated = new Date(this.dateCreated);      
            table.row.add([
                counter,
                '<center>'
                    + '<a data-toggle="tooltip" title="' + $LISTUSER_TIP_DETAILS + '" class="btn btn-info btn-xs" href="users/' + this._id + '">'
                        + '<span class="glyphicon glyphicon-search"></span>'
                    + '</a>'
                    + '<a data-toggle="tooltip" title="' + $LISTUSER_TIP_APPROVE + '" class="btn btn-success btn-xs linkapproveuser" rel="' + this._id + '" href="#">'
                        + '<span class="glyphicon glyphicon-ok"></span>'
                    + '</a>'
                    + '<a data-toggle="tooltip" title="' + $LISTUSER_TIP_DISAPPROVE + '" class="btn btn-danger btn-xs linkdisapproveuser" rel="' + this._id + '" href="#">'
                        + '<span class="glyphicon glyphicon-remove"></span>'
                    + '</a>'
                + '</center>',
                this.username,                
                this.fullName,
                this.role.split("Pending")[0],
                this.companyName,
                this.companyEmail,
                this.companyPhoneNumber,
                this.companyAddress,
                dateCreated.getDate() + '/' + (dateCreated.getMonth() + 1) + '/' +  dateCreated.getFullYear()
            ]).draw( false );
        }
    });
    
    $('#countPendingUsers').html(counter);
    $('[data-toggle="tooltip"]').tooltip(); 
}

// Populate All Users Table
function showUsers(data) {
	var counter = 0;
	var dateCreated = "";
	var tableContent = "";
	var table = $('#tableUsers').DataTable();
    table.clear().draw();

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
        if(this.markBanned != '1' && this.role == "User"){            
            counter++;
            console.log(counter);
            dateCreated = new Date(this.dateCreated);        
            table.row.add([
                counter,
                '<center>'
                    + '<a data-toggle="tooltip" title="' + $LISTUSER_TIP_DETAILS + '" class="btn btn-info btn-xs" href="users/' + this._id + '">'
                        + '<span class="glyphicon glyphicon-search"></span>'
                    + '</a>'
                    + '<a data-toggle="tooltip" title="' + $LISTUSER_TIP_BAN + '" class="btn btn-danger btn-xs linkbanuser" rel="' + this._id + '" href="#">'
                        + '<span class="glyphicon glyphicon-remove"></span>'
                    + '</a>'
                + '</center>',
                this.username,
                this.fullName,
                this.email,
                this.phoneNumber,
                this.address,
                dateCreated.getDate() + '/' + (dateCreated.getMonth() + 1) + '/' +  dateCreated.getFullYear()
            ]).draw( false );
        }
    });
    
    $('#countUsers').html(counter);
    $('[data-toggle="tooltip"]').tooltip(); 
}

// Populate Admin Table
function showAdmin(data) {
	var counter = 0;
	var dateCreated = "";
	var tableContent = "";
	var table = $('#tableAdmins').DataTable();
    table.clear().draw();
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
    	if(this.role == "Admin") {
    		counter++;
	    	dateCreated = new Date(this.dateCreated);
	    	table.row.add([
	    		counter,
	    		'<center>'
                    + '<a data-toggle="tooltip" title="' + $LISTUSER_TIP_DELETE + '" class="btn btn-danger btn-xs linkremoveadmin" rel="' + this._id + '">'
                    	+ '<span class="glyphicon glyphicon-remove"></span>'
                    + '</a>'
	        	+ '</center>',
	        	this.username,
	        	this.email
	    	]).draw( false );
    	}    	
    });

    $('#countAdmins').html(counter);
    $('[data-toggle="tooltip"]').tooltip(); 
}

// Populate Producer Table
function showProducers(data) {
    var counter = 0;
    var dateCreated = "";
    var tableContent = "";
    var table = $('#tableProducers').DataTable();
    var eventNumber = 0;
    table.clear().draw();
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
        if(this.role == "Producer" && this.markBanned != '1') {

            $.ajax({
                url: '/events/numberofevent/' + this._id,
                dataType: 'json',
                async: false,
                success: function( eventData ) {
                    eventNumber = eventData;
                }
            });
            counter++;
            dateCreated = new Date(this.dateCreated);
            table.row.add([
                counter,
                '<center>'
                    + '<a data-toggle="tooltip" title="' + $LISTUSER_TIP_DETAILS + '" class="btn btn-info btn-xs" href="/users/' + this._id + '">'
                        + '<span class="glyphicon glyphicon-search"></span>'
                    + '</a>'                    
                    + '<a data-toggle="tooltip" title="' + $LISTUSER_TIP_DEMOTE + '" class="btn btn-warning btn-xs linkdemoteuser" rel="' + this._id + '">'
                        + '<span class="glyphicon glyphicon-arrow-down"></span>'
                    + '</a>'
                    + '<a data-toggle="tooltip" title="' + $LISTUSER_TIP_BAN + '" class="btn btn-danger btn-xs linkbanuser" rel="' + this._id + '">'
                        + '<span class="glyphicon glyphicon-remove"></span>'
                    + '</a>'
                + '</center>',
                this.username,
                this.companyName,
                this.email,
                this.phoneNumber,
                this.address,
                eventNumber,
                dateCreated.getDate() + '/' + (dateCreated.getMonth() + 1) + '/' +  dateCreated.getFullYear()
            ]).draw( false );
        }       
    });

    $('#countProducers').html(counter);
    $('[data-toggle="tooltip"]').tooltip(); 
}

// Populate Sponsor Table
function showSponsors(data) {
    var counter = 0;
    var dateCreated = "";
    var tableContent = "";
    var table = $('#tableSponsors').DataTable();
    table.clear().draw();
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
        if(this.role == "Sponsor" && this.markBanned != '1') {
            counter++;
            dateCreated = new Date(this.dateCreated);
            table.row.add([
                counter,
                '<center>'
                    + '<a data-toggle="tooltip" title="' + $LISTUSER_TIP_DEMOTE + '" class="btn btn-warning btn-xs linkdemoteuser" rel="' + this._id + '">'
                        + '<span class="glyphicon glyphicon-arrow-down"></span>'
                    + '</a>'
                    + '<a data-toggle="tooltip" title="' + $LISTUSER_TIP_BAN +'" class="btn btn-danger btn-xs linkbanuser" rel="' + this._id + '">'
                        + '<span class="glyphicon glyphicon-remove"></span>'
                    + '</a>'
                + '</center>',
                '<a href="/users/' + this._id + '">' + this.username + '</a>',
                this.fullName,
                this.companyName,
                this.companyEmail,
                this.companyPhoneNumber,
                this.companyAddress,
                dateCreated.getDate() + '/' + (dateCreated.getMonth() + 1) + '/' +  dateCreated.getFullYear()
            ]).draw( false );
        }       
    });

    $('#countSponsors').html(counter);
    $('[data-toggle="tooltip"]').tooltip(); 
}

// Populate Banned User Table
function showBannedUser(data) {
    var counter = 0;
    var dateCreated = "";
    var tableContent = "";
    var table = $('#tableBannedUsers').DataTable();
    table.clear().draw();
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
        if(this.markBanned == "1") {
            counter++;
            dateCreated = new Date(this.dateCreated);
            table.row.add([
                counter,
                '<center>'
                    + '<a data-toggle="tooltip" title="' + $LISTUSER_TIP_DETAILS + '" class="btn btn-info btn-xs" href="users/' + this._id + '">'
                        + '<span class="glyphicon glyphicon-search"></span>'
                    + '</a>'
                    + '<a data-toggle="tooltip" title="' + $LISTUSER_TIP_UNBAN + '" class="btn btn-success btn-xs linkunbanuser" rel="' + this._id + '">'
                        + '<span class="glyphicon glyphicon-ok"></span>'
                    + '</a>'
                + '</center>',
                this.username,
                this.role,
                this.fullName,
                this.email,
                this.phoneNumber,
                this.address,
                this.bannedReason,
                dateCreated.getDate() + '/' + (dateCreated.getMonth() + 1) + '/' +  dateCreated.getFullYear()
            ]).draw( false );
        }       
    });

    $('#countBanned').html(counter);
    $('[data-toggle="tooltip"]').tooltip(); 
}

// Delete User
function deleteUser(event) {
    event.preventDefault();

    // If they did, do our delete
    $.ajax({
        type: 'DELETE',
        url: '/users/deleteuser/' + $(this).attr('rel')
    }).done(function( response ) {

        // Check for a successful (blank) response
        if (response.msg === '') {
        }
        else {
            alert('Error: ' + response.msg);
        }

        // Update the table
        populateTables();

    });
}

// Show reaston to ban User
function banUser(event) {
    event.preventDefault();

    $.getJSON( '/users/id/' + $(this).attr('rel'), function( data ) {
        $('#txtUserBan').val(data.username);
    });

    $('#txtUserBanId').val($(this).attr('rel'));
    
    $('#ban-reason-form').dialog('open');    
}

// Confirm ban user
function confirmBanUser() {
    var user = {
        'markBanned': '1',
        'bannedReason': $('#txtReason').val(),
        'dateModified': Date()
    };

    // If they did, do our delete
    $.ajax({
        type: 'PUT',
        data: user,
        url: '/users/updateuser/' + $('#txtUserBanId').val()
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            populateTables();
            $('#txtUserBanId').val("");
            $('#txtUserBan').val("");
            $('#txtReason').val("");
            $('#ban-reason-form').dialog('close');
        }
        else {
            alert('Error: ' + response.msg);
        }
    });
}

// Unban User
function unbanUser(event) {
    event.preventDefault();

    var user = {
        'markBanned': '0',
        'bannedReason': '',
        'dateModified': Date()
    };

    $.ajax({
        type: 'PUT',
        data: user,
        url: '/users/updateuser/' + $(this).attr('rel')
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            populateTables();
            var newNotification = {
                'userId': $(this).attr('rel'),
                'content': 'Your ban have been lifted.',
                'markedRead': 'Unread',
                'dateCreated': new Date()
            }

            // Use AJAX to post the object to our adduser service        
            $.ajax({
                type: 'POST',
                data: newNotification,
                url: '/notifications/addnotification',
                dataType: 'JSON'
            }).done(function( response ) {

                // Check for successful (blank) response
                if (response.msg !== '') {

                    // If something goes wrong, alert the error message that our service returned
                    alert('Error: ' + response.msg);

                } else {
                    // Do nothing
                }
            });
        }
        else {
            alert('Error: ' + response.msg);
        }
    });
}

// Approve User
function approveUser(event) {
    event.preventDefault();

    var data = $('#tablePendingUsers').DataTable().row( $(this).parents('tr') ).data();

    var user = {
        'role': data[4],
        'dateModified' : Date()
    }

    $.ajax({
        type: 'PUT',
        data: user,
        url: '/users/updateuser/' + $(this).attr('rel')
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            populateTables();
        }
        else {
            alert('Error: ' + response.msg);
        }
    });

    var newNotification = {
        'userId': $(this).attr('rel'),
        'content': 'Your request to promote to ' + data[4] + ' has been approved.',
        'markedRead': 'Unread',
        'dateCreated': new Date()
    }

    // Use AJAX to post the object to our adduser service        
    $.ajax({
        type: 'POST',
        data: newNotification,
        url: '/notifications/addnotification',
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.msg !== '') {

            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);

        }
    });
}

// Show reaston to disapprove User
function disapproveUser(event) {
    event.preventDefault();

    var user = {
        'role': 'User',
        'dateModified': Date()
    };

    // If they did, do our delete
    $.ajax({
        type: 'PUT',
        data: user,
        url: '/users/updateuser/' + $(this).attr('rel')
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            populateTables();            
        }
        else {
            alert('Error: ' + response.msg);
        }
    });     
}

// Confirm disapprove user
function confirmDisapproveUser() {
    var user = {
        'role': 'User',
        'dateModified': Date()
    };

    // If they did, do our delete
    $.ajax({
        type: 'PUT',
        data: user,
        url: '/users/updateuser/' + $('#txtUserBanId').val()
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            populateTables();            
            var newNotification = {
                'userId': $(this).attr('rel'),
                'content': 'Your request to promote to ' + data[4] + ' has been disapproved for: ' + $('#txtDisapproveReason').val(),
                'markedRead': 'Unread',
                'dateCreated': new Date()
            }

            // Use AJAX to post the object to our adduser service        
            $.ajax({
                type: 'POST',
                data: newNotification,
                url: '/notifications/addnotification',
                dataType: 'JSON'
            }).done(function( response ) {

                // Check for successful (blank) response
                if (response.msg !== '') {

                    // If something goes wrong, alert the error message that our service returned
                    alert('Error: ' + response.msg);

                } else {
                    $('#txtUserDisapproveId').val("");
                    $('#txtUserDisapprove').val("");
                    $('#txtDisapproveReason').val("");
                    $('#disapprove-reason-form').dialog('close');
                }
            });
        }
        else {
            alert('Error: ' + response.msg);
        }
    });    
}

// Demote User Function
function demoteUser() {
    var user = {
        'role': 'User',
        'dateModified': Date()
    };

    // If they did, do our delete
    $.ajax({
        type: 'PUT',
        data: user,
        url: '/users/updateuser/' + $(this).attr('rel')
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            populateTables();
            var newNotification = {
                'userId': $(this).attr('rel'),
                'content': 'You have been demoted to User.',
                'markedRead': 'Unread',
                'dateCreated': new Date()
            }

            // Use AJAX to post the object to our adduser service        
            $.ajax({
                type: 'POST',
                data: newNotification,
                url: '/notifications/addnotification',
                dataType: 'JSON'
            }).done(function( response ) {

                // Check for successful (blank) response
                if (response.msg !== '') {

                    // If something goes wrong, alert the error message that our service returned
                    alert('Error: ' + response.msg);

                } else {
                    // Do nothing
                }
            });
        }
        else {
            alert('Error: ' + response.msg);
        }
    });   
}