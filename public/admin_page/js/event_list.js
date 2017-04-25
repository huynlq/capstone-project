// DOM Ready ===============================================

$(document).ready(function() {
    populateLanguage();

  $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
  } );

  $('[data-toggle="tooltip"]').tooltip(); 

  populateTables();

  $('#tableUpcomingEvents tbody').on('click', 'td a.linkcancelevent', cancelEvent);

  $('#tableEvents tbody').on('click', 'td a.linkcancelevent', cancelEvent);

  $('#tableCancelledEvents tbody').on('click', 'td a.linkreopenevent', reopenEvent);

  $('#tableEvents tbody').on('click', 'td a.linkreopenevent', reopenEvent);
  
  setTimeout(function(){ $('#tab-pane li a').first().click(); }, 300);

  //========================== DIALOG HIDING FUNCTIONS ===================

    var dialog = $( "#cancel-reason-form" ).dialog({
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
            id: "confirmCancelEvent",
                click: function(){
                    confirmCancelEvent();
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

    $('#cancelForm_reason').html($LISTEVENT_FORM_CANCEL_REASON);
    $('#cancelForm_eventName').html($LISTEVENT_FORM_CANCEL_EVENT);

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
    var role = "";
    var actionContent = "";

    $.ajax({
        url: '/users/id/' + readCookie('user'),
        dataType: 'json',
        async: false,
        success: function( dataUser ){
            role = dataUser.role;
        }
    });

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
        eventStartDate = new Date(this.eventDate.split(" - ")[0]);
        eventEndDate = new Date(this.eventDate.split(" - ")[1]);
        eventEndDate.setDate(eventEndDate.getDate() + 1);
        if(eventEndDate.getTime() >= now.getTime() && this.status == "Published"){            
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

            actionContent = "";
            if(role == "Producer") {
                actionContent = '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_EDIT + '" style="margin:5px" class="btn btn-info btn-xs" href="/events/edit/' + this._id + '">'
                                    + '<span class="glyphicon glyphicon-edit"></span>'
                                + '</a>'
                                + '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_UPDATE + '" style="margin:5px" class="btn btn-success btn-xs" href="/events/update/' + this._id + '">'
                                    + '<span class="glyphicon glyphicon-stats"></span>'
                                + '</a>';
            }

            actionContent += '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_CANCEL + '" style="margin:5px" class="btn btn-danger btn-xs linkcancelevent" rel="' + this._id + '" href="#">'
                                + '<span class="glyphicon glyphicon-remove"></span>'
                            + '</a>';

            table.row.add([
                counter,
                '<center>'
                    + actionContent
                + '</center>',
                '<a href="/events/' + this._id + '">' + this.eventName + '</a>',
                user,
                email,
                phone,
                eventStartDate.toLocaleDateString(),
                this.meetingAddress,
                dateCreated.toLocaleDateString()
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
    var status = "";
    var actionContent = "";
    var role = "";
    table.clear().draw();

    $.ajax({
        url: '/users/id/' + readCookie('user'),
        dataType: 'json',
        async: false,
        success: function( dataUser ){
            role = dataUser.role;
        }
    });

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
        console.log(data);  
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

        actionContent = "";
        if(this.status == "Published") {
            status = $LISTEVENT_STATUS_PUBLISHED;
            if(role == "Producer") {
                actionContent = '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_EDIT + '" style="margin:5px" class="btn btn-info btn-xs" href="/events/edit/' + this._id + '">'
                                + '<span class="glyphicon glyphicon-edit"></span>'
                            + '</a>'
                            + '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_UPDATE + '" style="margin:5px" class="btn btn-success btn-xs" href="/events/update/' + this._id + '">'
                                + '<span class="glyphicon glyphicon-stats"></span>'
                            + '</a>';
            }
            actionContent += '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_CANCEL + '" style="margin:5px" class="btn btn-danger btn-xs linkcancelevent" href="#" rel="' + this._id + '">'
                                + '<span class="glyphicon glyphicon-remove"></span>'
                            + '</a>';
        } else if(this.status == "Draft") {
            status = $LISTEVENT_STATUS_DRAFT;
            if(role == "Producer") {
                actionContent = '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_EDIT + '" style="margin:5px" class="btn btn-info btn-xs" href="/events/edit/' + this._id + '">'
                                + '<span class="glyphicon glyphicon-edit"></span>'
                            + '</a>';
            }
            actionContent += '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_CANCEL + '" style="margin:5px" class="btn btn-danger btn-xs linkcancelevent" href="#" rel="' + this._id + '">'
                                + '<span class="glyphicon glyphicon-remove"></span>'
                            + '</a>';
        } else if(this.status == "Cancelled") {
            status = $LISTEVENT_STATUS_CANCELLED;
            if(role == "Producer") {
                actionContent = '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_EDIT + '" style="margin:5px" class="btn btn-info btn-xs" href="/events/edit/' + this._id + '">'
                                + '<span class="glyphicon glyphicon-edit"></span>'
                            + '</a>'
                            + '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_UPDATE + '" style="margin:5px" class="btn btn-success btn-xs" href="/events/update/' + this._id + '">'
                                + '<span class="glyphicon glyphicon-stats"></span>'
                            + '</a>';
            }
            if(role == "Admin") {
                actionContent = '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_UNBAN + '" style="margin:5px" class="btn btn-warning btn-xs linkreopenevent" href="#" rel="' + this._id + '">'
                                    + '<span class="glyphicon glyphicon-ok"></span>'
                                + '</a>';
            }
        }

        table.row.add([
            counter,
            '<center>'
                + actionContent
            + '</center>',
            '<a href="/events/' + this._id + '">' + this.eventName + '</a>',
            status,            
            user,
            email,
            phone,
            this.eventDate.split(" - ")[0],
            this.meetingAddress,
            dateCreated.toLocaleDateString()
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
    var role = "";
    var dataContent = "";

    $.ajax({
        url: '/users/id/' + readCookie('user'),
        dataType: 'json',
        async: false,
        success: function( dataUser ){
            role = dataUser.role;
        }
    });

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
            dataContent = "";
            if(role == "Producer") {
                dataContent = '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_EDIT + '" style="margin:5px" class="btn btn-info btn-xs" href="/events/edit/' + this._id + '">'
                                + '<span class="glyphicon glyphicon-edit"></span>'
                            + '</a>'
                            + '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_UPDATE + '" style="margin:5px" class="btn btn-success btn-xs" href="/events/update/' + this._id + '">'
                                + '<span class="glyphicon glyphicon-stats"></span>'
                            + '</a>';
            }

            table.row.add([
                counter,                
                '<center>'                
                    + dataContent
                + '</center>',
                '<a href="/events/' + this._id + '">' + this.eventName + '</a>',                
                user,
                email,
                phone,
                eventStartDate.toLocaleDateString(),
                this.meetingAddress,
                dateCreated.toLocaleDateString(),
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
    var actionContent = '';
    var role = "";

    $.ajax({
        url: '/users/id/' + readCookie('user'),
        dataType: 'json',
        async: false,
        success: function( dataUser ){
            role = dataUser.role;
        }
    });
    

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
            actionContent = "";
            if(role == "Producer") {
                actionContent += '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_EDIT + '" style="margin:5px" class="btn btn-info btn-xs" href="/events/edit/' + this._id + '">'
                                    + '<span class="glyphicon glyphicon-edit"></span>'
                                + '</a>'
                                + '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_UPDATE + '" style="margin:5px" class="btn btn-success btn-xs" href="/events/update/' + this._id + '">'
                                    + '<span class="glyphicon glyphicon-stats"></span>'
                                + '</a>';   
            }
            if(role == "Admin") {
                actionContent += '<a data-toggle="tooltip" title="' + $LISTEVENT_TIP_UNBAN + '" style="margin:5px" class="btn btn-warning btn-xs linkreopenevent" href="#" rel="' + this._id + '">'
                                    + '<span class="glyphicon glyphicon-ok"></span>'
                                + '</a>';
            }
            table.row.add([
                counter,
                '<center>'                
                    + actionContent
                + '</center>',
                '<a href="/events/' + this._id + '">' + this.eventName + '</a>',                
                user,
                email,
                phone,
                eventStartDate.toLocaleDateString(),
                this.meetingAddress,
                dateCreated.toLocaleDateString()
            ]).draw( false );
        }
    });
    
    $('#countCancelledEvents').html(counter);
    $('[data-toggle="tooltip"]').tooltip(); 
}

// Show reason to cancel event
function cancelEvent(event) {
    event.preventDefault();

    $.getJSON( '/events/details/' + $(this).attr('rel'), function( data ) {
        $('#txtEventCancel').val(data.eventName);
    });

    $('#txtEventCancelId').val($(this).attr('rel'));
    $('#txtCancelReason').val("");
    
    $('#cancel-reason-form').dialog('open');    
}

// Cancel Event Function
function confirmCancelEvent() {
    var eventId = $('#txtEventCancelId').val();
    $.getJSON( '/events/details/' + eventId, function( data ) {
        var status = "";
        var producerId = data.userId;
        var eventName = data.eventName;

        if(data.status == "Draft") {
            status = "DraftCancelled";
        } else {
            status = "Cancelled";
        }

        var event = {
            'status': status,
            'dateModified': Date()
        };

        // If they did, do our delete
        $.ajax({
            type: 'PUT',
            data: event,
            url: '/events/updateevent/' + eventId
        }).done(function( response ) {
            // stats for a successful (blank) response
            if (response.msg === '') {
                populateTables();                
                $('#cancel-reason-form').dialog('close');
                showAlert('success', $LISTEVENT_MSG_CANCEL_SUCCESS);

                // Send notifications
                $.getJSON( '/users/id/' + readCookie('user'), function( data ) {
                    if(data.role == "Admin") {
                        // If admin cancel it, send notification for producer
                        var newNotification = {
                            'userId': producerId,
                            'content': 'Sự kiện ' + eventName + ' của bạn đã bị hủy vì lý do: ' + $('#txtCancelReason').val(),
                            'link': '/events/',
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
                                showAlert('error', $LAYOUT_ERROR + response.msg);

                            }
                        });
                    }

                    // Also send notifications for participants
                    $.getJSON( '/events/participants/' + eventId, function( data ) {
                        for(var i = 0; i < data.length; i++) {
                            var newNotification = {
                                'userId': data[i]._id,
                                'content': 'Sự kiện ' + eventName + ' mà bạn đã đăng kí tham gia đã bị hủy vì lý do: ' + $('#txtCancelReason').val(),
                                'link': '',
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
                                    showAlert('error', $LAYOUT_ERROR + response.msg);

                                }
                            });
                        }
                    });                        
                });

            } else {
                showAlert('error', $LAYOUT_ERROR + response.msg);
            }
        });   
    });
}

// Reopen Event Function
function reopenEvent() {
    console.log("COME");
    var eventId = $(this).attr('rel');
    $.getJSON( '/events/details/' + eventId, function( data ) {
        var status = "";
        var producerId = data.userId;
        var eventName = data.eventName;

        if(data.status == "DraftCancelled") {
            status = "Draft";
        } else {
            status = "Published";
        }

        var event = {
            'status': status,
            'dateModified': Date()
        };

        // If they did, do our delete
        $.ajax({
            type: 'PUT',
            data: event,
            url: '/events/updateevent/' + eventId
        }).done(function( response ) {
            // stats for a successful (blank) response
            if (response.msg === '') {
                populateTables();
                showAlert('success', $LISTEVENT_MSG_UNCANCEL_SUCCESS);

                // Send notifications
                $.getJSON( '/users/id/' + readCookie('user'), function( data ) {
                    if(data.role == "Admin") {
                        // If admin cancel it, send notification for producer
                        var newNotification = {
                            'userId': producerId,
                            'content': 'Sự kiện ' + eventName + ' của bạn đã được mở lại.',
                            'link': '/events/',
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
                                showAlert('error', $LAYOUT_ERROR + response.msg);

                            }
                        });
                    }

                    // Also send notifications for participants
                    $.getJSON( '/events/participants/' + eventId, function( data ) {
                        for(var i = 0; i < data.length; i++) {
                            var newNotification = {
                                'userId': data[i]._id,
                                'content': 'Sự kiện ' + eventName + ' mà bạn đã đăng kí tham gia đã được mở lại.',
                                'link': '',
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
                                    showAlert('error', $LAYOUT_ERROR + response.msg);

                                }
                            });
                        }
                    });                        
                });

            } else {
                showAlert('error', $LAYOUT_ERROR + response.msg);
            }
        });   
    });
}