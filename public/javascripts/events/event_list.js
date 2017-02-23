// DOM Ready ===============================================

$(document).ready(function() {
  $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
  } );

  $('[data-toggle="tooltip"]').tooltip(); 

  populateTables();

  document.getElementById("active-tab").click();
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
        showEvents(data);
        showUpcomingEvents(data);
        showPastEvents(data);
        showCancelledEvents(data);
        $('[data-toggle="tooltip"]').tooltip(); 
    }); 
}

// Populate Upcoming Events Table
function showUpcomingEvents(data) {
	var counter = 0;
	var dateCreated = "";
	var tableContent = "";
	var table = $('#tableUpcomingEvents').DataTable();
    table.clear().draw();
    var now = new Date();
    var eventEndDate = "";

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
        eventStartDate = new Date(this.eventDate.split(" - ")[0]);
        eventEndDate = new Date(this.eventDate.split(" - ")[1]);
        if(eventEndDate.getTime() >= now.getTime() && this.status != "Cancelled"){            
            counter++;
            dateCreated = new Date(this.dateCreated);
            table.row.add([
                counter,
                '<center>'
                    + '<a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="events/' + this._id + '">'
                        + '<span class="glyphicon glyphicon-search"></span>'
                    + '</a>'
                    + '<a data-toggle="tooltip" title="Cancel" class="btn btn-danger btn-xs linkcancelevent" rel="' + this._id + '" href="#">'
                        + '<span class="glyphicon glyphicon-remove"></span>'
                    + '</a>'
                + '</center>',
                this.eventName,
                this.eventType,
                this.user,
                this.contractEmail,
                this.contractPhone,
                eventStartDate.getDate() + '/' + (eventStartDate.getMonth() + 1) + '/' +  eventStartDate.getFullYear(),
                this.meetingAddress,
                this.donationNeeded,
                dateCreated.getDate() + '/' + (dateCreated.getMonth() + 1) + '/' +  dateCreated.getFullYear()
            ]).draw( false );
        }
    });
    
    $('#countUpcomingEvents').html(counter);
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

// Populate Past Events Table
function showPastEvents(data) {
    var counter = 0;
    var dateCreated = "";
    var tableContent = "";
    var table = $('#tablePastEvents').DataTable();
    table.clear().draw();
    var now = new Date();
    var eventEndDate = "";
    var eventStatus = "";

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
        eventStartDate = new Date(this.eventDate.split(" - ")[0]);
        eventEndDate = new Date(this.eventDate.split(" - ")[1]);
        if(eventEndDate.getTime() < now.getTime() && this.status != "Cancelled"){            
            if(this.status == "Published") {
                eventStatus = 'Not yet';
            } else {
                eventStatus = "Done";
            }
            counter++;
            dateCreated = new Date(this.dateCreated);
            table.row.add([
                counter,
                '<center>'
                    + '<a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="events/' + this._id + '">'
                        + '<span class="glyphicon glyphicon-search"></span>'
                    + '</a>'
                + '</center>',
                this.eventName,
                this.eventType,
                this.user,
                this.contractEmail,
                this.contractPhone,
                eventStartDate.getDate() + '/' + (eventStartDate.getMonth() + 1) + '/' +  eventStartDate.getFullYear(),,
                this.meetingAddress,
                this.donationNeeded,
                dateCreated.getDate() + '/' + (dateCreated.getMonth() + 1) + '/' +  dateCreated.getFullYear(),
                eventStatus
            ]).draw( false );
        }
    });
    
    $('#countPastEvents').html(counter);
    $('[data-toggle="tooltip"]').tooltip(); 
}

// Populate Cancelled Events Table
function showCancelledEvents(data) {
    var counter = 0;
    var dateCreated = "";
    var tableContent = "";
    var table = $('#tableCancelledEvents').DataTable();
    table.clear().draw();
    var now = new Date();
    var eventEndDate = "";
    var eventStatus = "";

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
        eventStartDate = new Date(this.eventDate.split(" - ")[0]);
        eventEndDate = new Date(this.eventDate.split(" - ")[1]);
        if(this.status == "Cancelled"){                        
            counter++;
            dateCreated = new Date(this.dateCreated);
            table.row.add([
                counter,
                '<center>'
                    + '<a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="events/' + this._id + '">'
                        + '<span class="glyphicon glyphicon-search"></span>'
                    + '</a>'
                + '</center>',
                this.eventName,
                this.eventType,
                this.user,
                this.contractEmail,
                this.contractPhone,
                eventStartDate.getDate() + '/' + (eventStartDate.getMonth() + 1) + '/' +  eventStartDate.getFullYear(),,
                this.meetingAddress,
                this.donationNeeded,
                dateCreated.getDate() + '/' + (dateCreated.getMonth() + 1) + '/' +  dateCreated.getFullYear(),
                eventStatus
            ]).draw( false );
        }
    });
    
    $('#countCancelledEvents').html(counter);
    $('[data-toggle="tooltip"]').tooltip(); 
}