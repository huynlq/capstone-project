// DOM Ready ===============================================

$(document).ready(function() {
    populateLanguage();

  $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
  } );

  $('[data-toggle="tooltip"]').tooltip(); 

  populateTables();

  $('#tableUpcomingEvents tbody').on('click', 'td a.linkcancelevent', cancelEvent);

  document.getElementById("active-tab").click();

} );

// Functions ===============================================

function populateLanguage() {
    $('#header-event').html($LISTEVENT_HEADER_EVENT);
    $('#tab-totalEvent').html($LISTEVENT_TAB_TOTALEVENT);
    $('#tab-upcomingEvent').html($LISTEVENT_TAB_UPCOMINGEVENT);
    $('#tab-pastEvent').html($LISTEVENT_TAB_PASTEVENT);
    $('#tab-cancelledEvent').html($LISTEVENT_TAB_CANCELLEDEVENT);
    $('#tabContent-totalEvent').html($LISTEVENT_TAB_TOTALEVENT);
    $('#tabContent-upcomingEvent').html($LISTEVENT_TAB_UPCOMINGEVENT);
    $('#tabContent-pastEvent').html($LISTEVENT_TAB_PASTEVENT);
    $('#tabContent-cancelledEvent').html($LISTEVENT_TAB_CANCELLEDEVENT);

    $('.th-action').html($LISTEVENT_TH_ACTION);
    $('.th-event').html($LISTEVENT_TH_EVENT);
    $('.th-status').html($LISTEVENT_TH_STATUS);
    $('.th-user').html($LISTEVENT_TH_USER);
    $('.th-email').html($LISTEVENT_TH_EMAIL);
    $('.th-phone').html($LISTEVENT_TH_PHONE);
    $('.th-start').html($LISTEVENT_TH_START);
    $('.th-location').html($LISTEVENT_TH_LOCATION);
    $('.th-created').html($LISTEVENT_TH_CREATED);
}

function populateTables() {
	// jQuery AJAX call for JSON
    $.getJSON( '/events/alllist', function( data ) {
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
    var user = "";
    var email = "";
    var phone = "";

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
        eventStartDate = new Date(this.eventDate.split(" - ")[0]);
        eventEndDate = new Date(this.eventDate.split(" - ")[1]);
        eventEndDate.setDate(eventEndDate.getDate() + 1);
        if(eventEndDate.getTime() >= now.getTime() && this.status != "Cancelled"){            
            counter++;
            dateCreated = new Date(this.dateCreated);
            $.ajax({
                url: '/users/id/' + this.userId,
                dataType: 'json',
                async: false,
                success: function( dataUser ){
                    user = '<a href="users/' + dataUser._id + '">' + dataUser.username + '</a>';
                    email = dataUser.companyEmail;
                    phone = dataUser.companyPhoneNumber;
                }
            }); 
            table.row.add([
                counter,
                '<center>'
                    + '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_CANCEL + '" style="margin:5px" class="btn btn-danger btn-xs linkcancelevent" rel="' + this._id + '" href="#">'
                        + '<span class="glyphicon glyphicon-remove"></span>'
                    + '</a>'
                    + '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_EDIT + '" style="margin:5px" class="btn btn-info btn-xs" href="/events/edit/' + this._id + '">'
                        + '<span class="glyphicon glyphicon-edit"></span>'
                    + '</a>'
                    + '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_UPDATE + '" style="margin:5px" class="btn btn-success btn-xs" href="/events/update/' + this._id + '">'
                        + '<span class="glyphicon glyphicon-stats"></span>'
                    + '</a>'
                + '</center>',
                '<a href="/events/' + this._id + '">' + this.eventName + '</a>',
                user,
                email,
                phone,
                eventStartDate.getDate() + '/' + (eventStartDate.getMonth() + 1) + '/' +  eventStartDate.getFullYear(),
                this.meetingAddress,
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
    var user = "";
    var email = "";
    var phone = "";
    table.clear().draw();

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
        counter++;
        dateCreated = new Date(this.dateCreated);     
        $.ajax({
            url: '/users/id/' + this.userId,
            dataType: 'json',
            async: false,
            success: function( dataUser ){
                user = '<a href="users/' + dataUser._id + '">' + dataUser.username + '</a>';
                email = dataUser.companyEmail;
                phone = dataUser.companyPhoneNumber;
            }
        });    
        table.row.add([
            counter,
            '<center>'                
                + '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_EDIT + '" style="margin:5px" class="btn btn-info btn-xs" href="/events/edit/' + this._id + '">'
                    + '<span class="glyphicon glyphicon-edit"></span>'
                + '</a>'
                + '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_UPDATE + '" style="margin:5px" class="btn btn-success btn-xs" href="/events/update/' + this._id + '">'
                    + '<span class="glyphicon glyphicon-stats"></span>'
                + '</a>'
            + '</center>',
            '<a href="/events/' + this._id + '">' + this.eventName + '</a>',
            this.status,            
            user,
            email,
            phone,
            this.eventDate.split(" - ")[0],
            this.meetingAddress,
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
    var user = "";
    var email = "";
    var phone = "";

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
        eventStartDate = new Date(this.eventDate.split(" - ")[0]);
        eventEndDate = new Date(this.eventDate.split(" - ")[1]);
        eventEndDate.setDate(eventEndDate.getDate() + 1);
        if(eventEndDate.getTime() < now.getTime() && this.status != "Cancelled"){            
            counter++;
            dateCreated = new Date(this.dateCreated);
            $.ajax({
                url: '/users/id/' + this.userId,
                dataType: 'json',
                async: false,
                success: function( dataUser ){
                    user = '<a href="users/' + dataUser._id + '">' + dataUser.username + '</a>';
                    email = dataUser.companyEmail;
                    phone = dataUser.companyPhoneNumber;
                }
            }); 
            table.row.add([
                counter,                
                '<center>'                
                    + '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_EDIT + '" style="margin:5px" class="btn btn-info btn-xs" href="/events/edit/' + this._id + '">'
                        + '<span class="glyphicon glyphicon-edit"></span>'
                    + '</a>'
                    + '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_UPDATE + '" style="margin:5px" class="btn btn-success btn-xs" href="/events/update/' + this._id + '">'
                        + '<span class="glyphicon glyphicon-stats"></span>'
                    + '</a>'
                + '</center>',
                '<a href="/events/' + this._id + '">' + this.eventName + '</a>',                
                user,
                email,
                phone,
                eventStartDate.getDate() + '/' + (eventStartDate.getMonth() + 1) + '/' +  eventStartDate.getFullYear(),
                this.meetingAddress,
                dateCreated.getDate() + '/' + (dateCreated.getMonth() + 1) + '/' +  dateCreated.getFullYear(),
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
    var user = "";
    var email = "";
    var phone = "";

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
        eventStartDate = new Date(this.eventDate.split(" - ")[0]);
        eventEndDate = new Date(this.eventDate.split(" - ")[1]);
        if(this.status == "Cancelled"){                        
            counter++;
            dateCreated = new Date(this.dateCreated);
            $.ajax({
                url: '/users/id/' + this.userId,
                dataType: 'json',
                async: false,
                success: function( dataUser ){
                    user = '<a href="users/' + data._id + '">' + dataUser.username + '</a>';
                    email = dataUser.companyEmail;
                    phone = dataUser.companyPhoneNumber;
                }
            }); 
            table.row.add([
                counter,
                '<center>'                
                    + '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_EDIT + '" style="margin:5px" class="btn btn-info btn-xs" href="/events/edit/' + this._id + '">'
                        + '<span class="glyphicon glyphicon-edit"></span>'
                    + '</a>'
                    + '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_UPDATE + '" style="margin:5px" class="btn btn-success btn-xs" href="/events/update/' + this._id + '">'
                        + '<span class="glyphicon glyphicon-stats"></span>'
                    + '</a>'
                + '</center>',
                '<a href="/events/' + this._id + '">' + this.eventName + '</a>',                
                user,
                email,
                phone,
                eventStartDate.getDate() + '/' + (eventStartDate.getMonth() + 1) + '/' +  eventStartDate.getFullYear(),
                this.meetingAddress,
                dateCreated.getDate() + '/' + (dateCreated.getMonth() + 1) + '/' +  dateCreated.getFullYear()
            ]).draw( false );
        }
    });
    
    $('#countCancelledEvents').html(counter);
    $('[data-toggle="tooltip"]').tooltip(); 
}

// Cancel Event Function
function cancelEvent() {
    var event = {
        'status': 'Cancelled',
        'dateModified': Date()
    };

    // If they did, do our delete
    $.ajax({
        type: 'PUT',
        data: event,
        url: '/events/updateevent/' + $(this).attr('rel')
    }).done(function( response ) {
        // stats for a successful (blank) response
        if (response.msg === '') {
            populateTables();
        }
        else {
            alert('Error: ' + response.msg);
        }
    });   
}