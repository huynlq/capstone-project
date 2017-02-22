// DOM Ready ===============================================

$(document).ready(function() {
  $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
  } );

  $('[data-toggle="tooltip"]').tooltip(); 

  populateTables();
} );

// Functions ===============================================

function populateTables() {
	// jQuery AJAX call for JSON
    $.getJSON( '/events/all', function( data ) {

        var counter = 1;
        var dateCreated = "";
        var tableContent = "";
        var table = $('#tableUsers').DataTable();

        // For each item in our JSON, add a table row and cells to the content string
        showPendingEvents(data);
        showEvents(data);
        $('[data-toggle="tooltip"]').tooltip(); 
    }); 
}

// Populate Pending Events Table
function showPendingEvents(data) {
	var counter = 0;
	var dateCreated = "";
	var tableContent = "";
	var table = $('#tablePendingEvents').DataTable();
    table.clear().draw();

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
    	console.log("Status: " + this.status);
        if(this.status.indexOf("Pending") !== -1){            
            counter++;
            dateCreated = new Date(this.dateCreated);        
            table.row.add([
                counter,
                '<center>'
                    + '<a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="events/' + this._id + '">'
                        + '<span class="glyphicon glyphicon-search"></span>'
                    + '</a>'
                    + '<a data-toggle="tooltip" title="Approve" class="btn btn-success btn-xs linkapproveevent" rel="' + this._id + '" href="#">'
                        + '<span class="glyphicon glyphicon-ok"></span>'
                    + '</a>'
                    + '<a data-toggle="tooltip" title="Disapprove" class="btn btn-danger btn-xs linkdisapproveevent" rel="' + this._id + '" href="#">'
                        + '<span class="glyphicon glyphicon-remove"></span>'
                    + '</a>'
                + '</center>',
                this.eventName,
                this.eventType,
                this.user,
                this.contractEmail,
                this.contractPhone,
                this.eventDate.split(" - ")[0],
                this.meetingAddress,
                this.donationNeeded,
                dateCreated.getDate() + '/' + (dateCreated.getMonth() + 1) + '/' +  dateCreated.getFullYear(),
                this.status.split("Pending")[1]
            ]).draw( false );
        }
    });
    
    $('#countPendingEvents').html(counter);
    $('[data-toggle="tooltip"]').tooltip(); 
}

// Populate All Events Table
function showEvents(data) {
	var counter = 0;
	var dateCreated = "";
	var tableContent = "";
	var table = $('#tableEvents').DataTable();
    table.clear().draw();

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
        counter++;
        dateCreated = new Date(this.dateCreated);        
        table.row.add([
            counter,
            '<center>'
                + '<a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="events/' + this._id + '">'
                    + '<span class="glyphicon glyphicon-search"></span>'
                + '</a>'
		        + '<a data-toggle="tooltip" title="Disapprove" class="btn btn-danger btn-xs linkdisapproveevent" rel="' + this._id + '" href="#">'
                    + '<span class="glyphicon glyphicon-remove"></span>'
                + '</a>'
            + '</center>',
            this.eventName,
            this.status,
            this.eventType,
            this.user,
            this.contractEmail,
            this.contractPhone,
            this.eventDate.split(" - ")[0],
            this.meetingAddress,
            this.donationNeeded,
            dateCreated.getDate() + '/' + (dateCreated.getMonth() + 1) + '/' +  dateCreated.getFullYear()
        ]).draw( false );
        
    });
    
    $('#countEvents').html(counter);
    $('[data-toggle="tooltip"]').tooltip(); 
}