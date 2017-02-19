// DOM Ready ===============================================

$(document).ready(function() {
	$('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
    $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
    });

    $('[data-toggle="tooltip"]').tooltip(); 

    populateTables();
});

// Functions ===============================================

// Put admin info parameter in form
function editAdmin(that){
	var table = $('#tableAdmins').DataTable();
	var data = table.row( $(that).parents('tr') ).data();
	$('#txtAdminUser').val(data[2]);
	$('#txtAdminEmail').val(data[3]);
	$('#txtAdminRole').val(data[4]);
}

// Populate all tables
function populateTables(){
	showUsers();
}

// Show all users in user table
function showUsers(){
	// jQuery AJAX call for JSON
    $.getJSON( '/users/all', function( data ) {

    	var counter = 1;
    	var dateCreated = "";
    	var tableContent = "";
    	var table = $('#tableUsers').DataTable();

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
        	counter++;
        	dateCreated = new Date(this.dateCreated);
        	table.row.add([
        		counter,
        		'<center>'
            		+ '<a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs linkshowuser" rel="' + this._id + '">'
            			+ '<span class="glyphicon glyphicon-search"></span>'
            		+ '</a>'
            		+ '<a data-toggle="tooltip" title="Ban" class="btn btn-danger btn-xs linkbanuser" rel="' + this._id + '"" href="#">'
            			+ '<span class="glyphicon glyphicon-remove"></span>'
            		+ '</a>'
            	+ '</center>',
            	this.username,
            	this.fullName,
            	this.email,
            	this.phoneNumber,
            	this.address,
            	dateCreated.toDateString()
        	]).draw( false );
        });

        $('#countUsers').html(counter);
    });
}