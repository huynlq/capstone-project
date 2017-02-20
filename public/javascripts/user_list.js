// DOM Ready ===============================================

$(document).ready(function() {
    $.fn.dataTable.ext.errMode = 'none';

	$('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
    $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
    });    

    populateTables();

    $('#tableAdmins tbody').on('click', 'td a.linkremoveadmin', deleteUser);

    $('#tableUsers tbody').on('click', 'td a.linkbanuser', banUser);

    $('#tableProducers tbody').on('click', 'td a.linkbanuser', banUser);

    $('#tableSponsors tbody').on('click', 'td a.linkbanuser', banUser);

    $('#tableBannedUsers tbody').on('click', 'td a.linkunbanuser', unbanUser);

    $('[data-toggle="tooltip"]').tooltip(); 
});

// Functions ===============================================

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
        showUsers(data);
        showAdmin(data);
        showBannedUser(data);
        showProducers(data);
        showSponsors(data);
        $('[data-toggle="tooltip"]').tooltip(); 
    });    
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
                    + '<a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="users/' + this._id + '">'
                        + '<span class="glyphicon glyphicon-search"></span>'
                    + '</a>'
                    + '<a data-toggle="tooltip" title="Ban" class="btn btn-danger btn-xs linkbanuser" rel="' + this._id + '" href="#">'
                        + '<span class="glyphicon glyphicon-remove"></span>'
                    + '</a>'
                + '</center>',
                this.username,
                this.role,
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
                    + '<a data-toggle="tooltip" title="Remove" class="btn btn-danger btn-xs linkremoveadmin" rel="' + this._id + '">'
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
    table.clear().draw();
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
        if(this.role == "Producer") {
            counter++;
            dateCreated = new Date(this.dateCreated);
            table.row.add([
                counter,
                '<center>'
                    + '<a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="/producers/' + this._id + '">'
                        + '<span class="glyphicon glyphicon-search"></span>'
                    + '</a>'
                    + '<a data-toggle="tooltip" title="Remove" class="btn btn-danger btn-xs linkbanuser" rel="' + this._id + '">'
                        + '<span class="glyphicon glyphicon-remove"></span>'
                    + '</a>'
                + '</center>',
                this.username,
                this.fullName,
                this.email,
                this.phoneNumber,
                this.address,
                "",
                "",
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
        if(this.role == "Sponsor") {
            counter++;
            dateCreated = new Date(this.dateCreated);
            table.row.add([
                counter,
                '<center>'
                    + '<a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="/sponsors/' + this._id + '">'
                        + '<span class="glyphicon glyphicon-search"></span>'
                    + '<a data-toggle="tooltip" title="Remove" class="btn btn-danger btn-xs linkremoveadmin" rel="' + this._id + '">'
                        + '<span class="glyphicon glyphicon-remove"></span>'
                    + '</a>'
                + '</center>',
                this.username,
                this.fullName,
                this.email,
                this.phoneNumber,
                this.address,
                "",
                "",
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
                    + '<a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="users/' + this._id + '">'
                        + '<span class="glyphicon glyphicon-search"></span>'
                    + '</a>'
                    + '<a data-toggle="tooltip" title="Unban" class="btn btn-success btn-xs linkunbanuser" rel="' + this._id + '">'
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

// Ban User
function banUser(event) {
    event.preventDefault();

    var user = {
        'markBanned': '1',
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

// /Unban User
function unbanUser(event) {
    console.log('asc');
    event.preventDefault();

    var user = {
        'markBanned': '0',
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