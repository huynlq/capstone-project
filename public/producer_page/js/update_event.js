// DOM Ready ===============================================

$(document).ready(function() {
    populateLanguage();

    $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
        $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
    } );

    $('[data-toggle="tooltip"]').tooltip(); 

    populateTables();    

    $('#tableDonation tbody').on('click', 'td a.linkremovedonation', deleteDonation);

    $('#tablePendingDonation tbody').on('click', 'td a.linkapprovedonation', approveDonation);

    $('#tablePendingDonation tbody').on('click', 'td a.linkremovedonation', deleteDonation);

    $('#tableParticipants tbody').on('click', 'td a.linkabsent', markAbsent);

    $('#tableParticipants tbody').on('click', 'td a.linkpresent', markPresent);

    $('#tableActivityCosts tbody').on('click', 'td a.linkeditactualcost', editActualCost);

    $('#tablePendingSponsor tbody').on('click', 'td a.linkapprovesponsor', approveSponsor);

    $('#tablePendingSponsor tbody').on('click', 'td a.linkremovesponsor', removeSponsor);

    $('#tableSponsor tbody').on('click', 'td a.linkfeaturesponsor', featureSponsor);

    $('#tableSponsor tbody').on('click', 'td a.linkunfeaturesponsor', unfeatureSponsor);

    $('#tableSponsor tbody').on('click', 'td a.linkremovesponsor', removeSponsor);

    $('#galleryPane').on('click', '.linkdeletephoto', removePhoto);

    //========================== DIALOG HIDING FUNCTIONS ===================

    $('#uploadForm').submit(function() {
        $("#status").empty().text("File is uploading...");
        $(this).ajaxSubmit({
            error: function(xhr) {
                status('Error: ' + xhr.status);
            },
            success: function(response) {
                console.log(response)
                $("#status").empty().text(response);
            }
        });
        return false;
    });    

    var dialog = $( "#edit-actual-cost-form" ).dialog({
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
        resizable: false,
        width: $(window).width() * 50 / 100,
        buttons: {
            "OK" : {
            text: "OK",
            id: "confirmEditActualCost",
                click: function(){
                    confirmEditActualCost();
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
    $('#header').html($EVENTUPDATE_HEADER);

    $('.tab-donation').html($EVENTUPDATE_TAB_DONATION);
    $('.tab-participant').html($EVENTUPDATE_TAB_PARTICIPANT);
    $('.tab-cost').html($EVENTUPDATE_TAB_COST);
    $('.tab-gallery').html($EVENTUPDATE_TAB_GALLERY);

    $('.th-action').html();

    $('.th-donator').html($EVENTDETAILS_DONATION_NAME);
    $('.th-item').html($EVENTDETAILS_DONATION_ITEM);
    $('.th-quantity').html($EVENTDETAILS_DONATION_QUANTITY);
    $('#donateForm-add').html($EVENTUPDATE_DONATEFORM_ADD);

    $('.th-day').html($EVENTDETAILS_ACTIVITY_DAY);
    $('.th-time').html($EVENTDETAILS_ACTIVITY_TIME);
    $('.th-place').html($EVENTDETAILS_ACTIVITY_LOCATION);
    $('.th-activity').html($EVENTDETAILS_ACTIVITY_ACT);
    $('.th-note').html($EVENTDETAILS_ACTIVITY_NOTE);
    $('.th-cost').html($EVENTDETAILS_ACTIVITY_COST);

    $('.th-action').html($EVENTUPDATE_TH_ACTION);
    $('.th-user').html($EVENTUPDATE_TH_USER);
    $('.th-fullName').html($EVENTUPDATE_TH_FULLNAME);
    $('.th-email').html($EVENTUPDATE_TH_EMAIL);
    $('.th-phone').html($EVENTUPDATE_TH_PHONE);
    $('.th-join').html($EVENTUPDATE_TH_JOIN);

    $('#gallery-upload').val($EVENTUPDATE_GALLERY_UPLOAD);
    $('#gallery-require').html($EVENTUPDATE_GALLERY_REQUIRE);
}

function populateTables() {
	// jQuery AJAX call for JSON    
    var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
    $.getJSON( '/events/details/' + eventId, function( data ) {        

        $('#eventName').html('<a href="/events/' + data._id + '">' + data.eventName + '</a>');
        showPendingDonations(data);


        // For each item in our JSON, add a table row and cells to the content string
        showDonations(data);
        showPendingDonations(data);
        showParticipants(data._id);
        showActivityCosts(data._id);        
        showGallery(data._id);
        showSponsors(data._id);
        // showActivities(data);
        $('[data-toggle="tooltip"]').tooltip(); 
        $('#tab-pane li a').first().click();
    }); 
}

// Populate Donation Item
function showDonations(data) {
    //Get Donation data from the database
    $.getJSON( '/events/donations/' + data._id, function( dataDonation ) {
        console.log("WUT");
        //Populate the table
        var table = $('#tableDonation').DataTable();
        table.clear().draw();
        var counter = 0;        
        if(dataDonation != null) {
            $.each(dataDonation, function(){
                if(this.status != "Pending") {
                    counter++;
                    dateCreated = new Date(this.dateCreated);        
                    table.row.add([
                        counter,
                        '<center>'
                            + '<a data-toggle="tooltip" title="' + $EVENTUPDATE_TIP_DELETE + '" class="btn btn-danger btn-xs linkremovedonation" rel="' + this._id + '" href="#">'
                                + '<span class="glyphicon glyphicon-remove"></span>'
                            + '</a>'
                        + '</center>',
                        this.donatorName,
                        this.donationItem,
                        this.donationNumber,                    
                        dateCreated.getDate() + '/' + (dateCreated.getMonth() + 1) + '/' +  dateCreated.getFullYear()
                    ]).draw( false );
                }                
            });
            $('#countDonations').html(counter);
        }
        $('[data-toggle="tooltip"]').tooltip(); 
    }); 
}

// Populate Pending Donation Item
function showPendingDonations(data) {
    //Get Donation data from the database
    $.getJSON( '/events/donations/' + data._id, function( dataDonation ) {
        //Populate the table
        var table = $('#tablePendingDonation').DataTable();
        table.clear().draw();
        var counter = 0;        
        if(dataDonation != null) {
            $.each(dataDonation, function(){
                if(this.status == "Pending") {
                    counter++;
                    dateCreated = new Date(this.dateCreated);        
                    table.row.add([
                        counter,
                        '<center>'
                            + '<a data-toggle="tooltip" title="Approve" class="btn btn-success btn-xs linkapprovedonation" rel="' + this._id + '" href="#">'
                                + '<span class="glyphicon glyphicon-ok"></span>'
                            + '</a>'
                            + '<a data-toggle="tooltip" title="Disapprove" class="btn btn-danger btn-xs linkremovedonation" rel="' + this._id + '" href="#">'
                                + '<span class="glyphicon glyphicon-remove"></span>'
                            + '</a>'
                        + '</center>',
                        this.donatorName,
                        this.donatorEmail,
                        this.donatorPhoneNumber,
                        this.donationItem,
                        this.donationNumber,                    
                        dateCreated.getDate() + '/' + (dateCreated.getMonth() + 1) + '/' +  dateCreated.getFullYear()
                    ]).draw( false );
                }                
            });
            $('#countPendingDonations').html(counter);
        }
        $('[data-toggle="tooltip"]').tooltip(); 
    }); 
}

// Approve Pending Donation
function approveDonation(event) {
    event.preventDefault();

    var donationId = $(this).attr('rel');

    var donation = {
        'status': 'Approved'
    };
    
    $.ajax({
        type: 'PUT',
        data: donation,
        url: '/events/updatedonation/' + $(this).attr('rel')
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            populateTables();

            $.getJSON( '/events/donations/id/' + donationId, function( data ) {
                var eventId = data.eventId;
                $.getJSON( '/events/details/' + eventId, function( dataEvent ) {
                    eventName = dataEvent.eventName;
                    var newNotification = {
                        'userId': data.userId,
                        'content': 'Your donation for ' + eventName + ' has been approved.',
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
                });    
            });
        }
        else {
            alert('Error: ' + response.msg);
        }
    });
}

// Populate Sponsors Tables
function showSponsors(_id) {
    $('#tableSponsor_wrapper .row').first().css('margin-left', '30px');
    $('#tableSponsor_wrapper .row .col-sm-6').first().removeClass("col-sm-6").addClass("col-sm-2");

    $('#tablePendingSponsor_wrapper .row').first().css('margin-left', '30px');
    $('#tablePendingSponsor_wrapper .row .col-sm-6').first().removeClass("col-sm-6").addClass("col-sm-2");

    var sponsorData;

    //Get Donation data from the database
    $.getJSON( '/events/sponsor/' + _id, function( dataSponsor ) {
        var tableSponsor = $('#tableSponsor').DataTable();
        var tablePendingSponsor = $('#tablePendingSponsor').DataTable();
        tableSponsor.clear().draw();
        tablePendingSponsor.clear().draw();
        var counter = 0;
        var pendingCounter = 0;
        var actionPanel = "";
        var status = "";
        if(dataSponsor != null) {
            $.each(dataSponsor, function(){
                sponsorData = this;
                if(this.status == "Pending") {
                    pendingCounter++;
                    $.getJSON( '/users/id/' + this.userId, function( dataUser ) {
                        tablePendingSponsor.row.add([
                            pendingCounter,
                            '<center>'
                                + '<a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" rel="' + '" href="/users/' + sponsorData.userId + '">'
                                    + '<span class="glyphicon glyphicon-search"></span>'
                                + '</a>'
                                + '<a data-toggle="tooltip" title="Approve" class="btn btn-success btn-xs linkapprovesponsor" rel="' + sponsorData._id + '" href="#">'
                                    + '<span class="glyphicon glyphicon-ok"></span>'
                                + '</a>'
                                + '<a data-toggle="tooltip" title="Disapprove" class="btn btn-danger btn-xs linkremovesponsor" rel="' + sponsorData._id + '" href="#">'
                                    + '<span class="glyphicon glyphicon-remove"></span>'
                                + '</a>'
                            + '</center>',
                            dataUser.companyName,
                            dataUser.companyEmail,
                            dataUser.companyPhoneNumber,
                        ]).draw('false');
                        $('[data-toggle="tooltip"]').tooltip(); 
                    });
                } else {
                    counter++;
                    if(this.status == "Approved") {
                        actionPanel = '<a data-toggle="tooltip" title="Mark Featured" class="btn btn-success btn-xs linkfeaturesponsor" rel="' + sponsorData._id + '" href="#">'
                                    + '<span class="glyphicon glyphicon-ok"></span>'
                                + '</a>';
                        status = ""
                    } else {
                        actionPanel = '<a data-toggle="tooltip" title="Mark Unfeatured" class="btn btn-warning btn-xs linkunfeaturesponsor" rel="' + sponsorData._id + '" href="#">'
                                    + '<span class="glyphicon glyphicon-arrow-down"></span>'
                                + '</a>';
                        status = "Featured"
                    }
                    $.getJSON( '/users/id/' + this.userId, function( dataUser ) {
                        tableSponsor.row.add([
                            counter,
                            '<center>'
                                + '<a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" rel="' + '" href="/users/' + sponsorData.userId + '">'
                                    + '<span class="glyphicon glyphicon-search"></span>'
                                + '</a>'
                                + actionPanel
                                + '<a data-toggle="tooltip" title="Remove" class="btn btn-danger btn-xs linkremovesponsor" rel="' + sponsorData._id + '" href="#">'
                                    + '<span class="glyphicon glyphicon-remove"></span>'
                                + '</a>'
                            + '</center>',
                            dataUser.companyName,
                            dataUser.companyEmail,
                            dataUser.companyPhoneNumber,
                            status
                        ]).draw('false');
                        $('[data-toggle="tooltip"]').tooltip(); 
                    });
                }
            });
        }

        $('#countSponsors').html(counter + ' - ' + pendingCounter);
    });
}

// Add new donation
function addDonation() {
    var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
    var newDonation = {
        'eventId': eventId,
        'donatorName': $('#txtDonatorName').val(),
        'donationItem': $('#txtDonationItem').val(),
        'donationNumber': $('#txtDonationNumber').val(),
        'dateCreated': new Date()
    };

    $.ajax({
        type: 'POST',
        data: newDonation,
        url: '/events/addDonation',
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if(response.msg == '') {
            // Clear the form inputs
            $('#txtDonatorName').val('');
            $('#txtDonationItem').val('');
            $('#txtDonationNumber').val('');

            // Update the table
            populateTables();
        } else {
            showAlert('danger', $LAYOUT_ERROR + response.msg);
        }
    });
}

// Delete donation
function deleteDonation(event) {

    event.preventDefault();

    //If they did, do our delete
    $.ajax({
        type: 'DELETE',
        url: '/events/deletedonation/' + $(this).attr('rel')
    }).done(function( response ) {

        // Check for a successful (blank) response
        if(response.msg == '') {
            // Update the table
            populateTables();
        } else {
            showAlert('danger', $LAYOUT_ERROR + response.msg);
        }
    });    
}

// Populate Pending Donation Item
function showPendingDonations(data) {
    //Get Donation data from the database
    $.getJSON( '/events/donations/' + data._id, function( dataDonation ) {
        //Populate the table
        var table = $('#tablePendingDonation').DataTable();
        table.clear().draw();
        var counter = 0;        
        if(dataDonation != null) {
            $.each(dataDonation, function(){
                if(this.status == "Pending") {
                    counter++;
                    dateCreated = new Date(this.dateCreated);        
                    table.row.add([
                        counter,
                        '<center>'
                            + '<a data-toggle="tooltip" title="Approve" class="btn btn-success btn-xs linkapprovedonation" rel="' + this._id + '" href="#">'
                                + '<span class="glyphicon glyphicon-ok"></span>'
                            + '</a>'
                            + '<a data-toggle="tooltip" title="Disapprove" class="btn btn-danger btn-xs linkremovedonation" rel="' + this._id + '" href="#">'
                                + '<span class="glyphicon glyphicon-remove"></span>'
                            + '</a>'
                        + '</center>',
                        this.donatorName,
                        this.donatorEmail,
                        this.donatorPhoneNumber,
                        this.donationItem,
                        this.donationNumber,                    
                        dateCreated.getDate() + '/' + (dateCreated.getMonth() + 1) + '/' +  dateCreated.getFullYear()
                    ]).draw( false );
                }                
            });
            $('#countPendingDonations').html(counter);
        }
        $('[data-toggle="tooltip"]').tooltip(); 
    }); 
}

// Approve Pending Donation
function approveDonation(event) {
    event.preventDefault();

    var donationId = $(this).attr('rel');

    var donation = {
        'status': 'Approved'
    };
    
    $.ajax({
        type: 'PUT',
        data: donation,
        url: '/events/updatedonation/' + $(this).attr('rel')
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            populateTables();

            $.getJSON( '/events/donations/id/' + donationId, function( data ) {
                var eventId = data.eventId;
                $.getJSON( '/events/details/' + eventId, function( dataEvent ) {
                    eventName = dataEvent.eventName;
                    var newNotification = {
                        'userId': data.userId,
                        'content': 'Your donation for ' + eventName + ' has been approved.',
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
                });    
            });
        }
        else {
            alert('Error: ' + response.msg);
        }
    });
}

// Populate Participant Table
function showParticipants(_id) {    
    var table = $('#tableParticipants').DataTable();
    table.clear().draw();
    var dateJoined = "";
    var counter = 0;
    var actionPanel = "";

    $.getJSON( '/events/participants/' + _id, function( data ) {
        $.each(data, function(){
            var participantId = this._id;
            var participantStatus = this.status;
            counter++;
            dateCreated = new Date(this.dateCreated);
            $.getJSON( '/users/id/' + this.userId, function( dataUser ) {
                if(participantStatus == 'Absent') {
                    actionPanel = '<a data-toggle="tooltip" title="' + $EVENTUPDATE_TIP_MARK_PRESENT + '" class="btn btn-info btn-xs linkpresent" rel="' + participantId + '" href="#">'
                                    + '<span class="glyphicon glyphicon-user"></span>'
                                + '</a>';
                } else {
                    actionPanel = '<a data-toggle="tooltip" title="' + $EVENTUPDATE_TIP_MARK_ABSENT + '" class="btn btn-danger btn-xs linkabsent" rel="' + participantId + '" href="#">'
                                    + '<span class="glyphicon glyphicon-remove"></span>'
                                + '</a>';
                }
                table.row.add([
                    counter +
                    '<p class="participantId" style="display:none">' + participantId + '</p>',
                    '<center>' + actionPanel + '</center>',
                    dataUser.username,
                    dataUser.fullName,
                    dataUser.email,
                    dataUser.phoneNumber,
                    dateCreated.toLocaleDateString()
                ]).draw(false);
                $('[data-toggle="tooltip"]').tooltip(); 
            });
        });        
        $('#countParticipants').html(counter);
    });    
}

// Mark absent a user
function markAbsent(event) {
    event.preventDefault();

    
    var table = $('#tableParticipants').DataTable();
    var data = table.row( $(this).parents('tr') ).data();
    var dataId = data[0];
    dataId = dataId.substring(dataId.indexOf(">") + 1, dataId.lastIndexOf("<"));
    var username = data[2];

    console.log(dataId);

    var participant = {
        'status': 'Absent'
    };
    
    $.ajax({
        type: 'PUT',
        data: participant,
        url: '/events/updateparticipant/' + dataId
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            populateTables();
        }
        else {
            showAlert('danger', $LAYOUT_ERROR + response.msg);
        }
    });
}

// Mark present a user
function markPresent(event) {
    event.preventDefault();

    
    var table = $('#tableParticipants').DataTable();
    var data = table.row( $(this).parents('tr') ).data();
    var dataId = data[0];
    dataId = dataId.substring(dataId.indexOf(">") + 1, dataId.lastIndexOf("<"));
    var username = data[2];

    console.log(dataId);

    var participant = {
        'status': 'Present'
    };
    
    $.ajax({
        type: 'PUT',
        data: participant,
        url: '/events/updateparticipant/' + dataId
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            populateTables();
        }
        else {
            showAlert('danger', $LAYOUT_ERROR + response.msg);
        }
    });
}

// Populate Activity Cost Table
function showActivityCosts(_id) {
    console.log(_id);
    var table = $('#tableActivityCosts').DataTable();
    table.clear().draw();
    var counter = 0;
    var actualCost = 0;

    $.getJSON( '/events/activities/' + _id, function( data ) {
        console.log(data);
        $.each(data, function(){
            if(this.actualCost == null)
                actualCost = "";
            else
                actualCost = this.actualCost;
            counter++;
            table.row.add([
                counter + '<input type="hidden" name="txtActivityId" value="' + this._id + '"/>',
                this.day,
                this.time,
                this.place,
                this.activity,
                this.note,
                actualCost,
                '<center><a data-toggle="tooltip" title="' + $EVENTUPDATE_TIP_EDIT_COST + '" class="btn btn-info btn-xs linkeditactualcost" rel="' + this._id + '" href="#">'
                    + '<span class="glyphicon glyphicon-edit"></span>'
                + '</a></center>'
            ]).draw(false);
        });
        $('#countActivities').html(counter);
    });
}

// Show edit actual cost dialog
function editActualCost(event) {
    event.preventDefault();

    $.getJSON( '/events/activities/id/' + $(this).attr('rel'), function( data ) {
        console.log(data);
        console.log(data.day);
        $('#txtEditActivityDay').val(data.day);
        $('#txtEditActivityTime').val(data.time);
        $('#txtEditActivityPlace').val(data.place);
        $('#txtEditActivity').val(data.activity);
        $('#txtEditActivityEstCost').val(data.note);
        if(data.actualCost != null)
            $('#txtEditActivityActualCost').val(data.actualCost);
    });

    $('#txtEditActivityId').val($(this).attr('rel'));
    
    $('#edit-actual-cost-form').dialog('open');    
}

// Confirm edit actual cost
function confirmEditActualCost() {
    var activity = {
        'actualCost': $('#txtEditActivityActualCost').val()
    };

    $.ajax({
        type: 'PUT',
        data: activity,
        url: '/events/updateactivity/' + $('#txtEditActivityId').val()
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            populateTables();
            $('#txtEditActivityDay').val("");
            $('#txtEditActivityTime').val("");
            $('#txtEditActivityPlace').val("");
            $('#txtEditActivity').val("");
            $('#txtEditActivityEstCost').val("");
            $('#txtEditActivityId').val("");
            $('#txtEditActivityActualCost').val("");
            $('#edit-actual-cost-form').dialog('close');
        }
        else {
            showAlert('danger', $LAYOUT_ERROR + response.msg);
        }
    });  
}

// Approve sponsor
function approveSponsor(event) {
    event.preventDefault();
    var sponsorId = $(this).attr('rel');

    $.getJSON( '/events/sponsor/id/' + sponsorId, function( data ) {
        var userId = data.userId;
        var eventId = data.eventId;
        var eventName = "";
        $.getJSON( '/events/details/' + eventId, function( dataEvent ) {
            eventName = dataEvent.eventName;
            var status = {
                'status': 'Featured'
            }

            $.ajax({
                type: 'PUT',
                data: status,
                url: '/events/updatesponsor/' + sponsorId
            }).done(function( response ) {
                // Check for a successful (blank) response
                
                    showSponsors();
                    
                    var newNotification = {
                        'userId': userId,
                        'content': 'Your request to sponsor for ' + eventName + ' has been approved.',
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
                            showAlert('danger', $LAYOUT_ERROR + response.msg);

                        }
                    });
                
            });  
        });
    });    
}

// Feature sponsor
function featureSponsor(event) {
    event.preventDefault();

    var status = {
        'status': 'Featured'
    }

    $.ajax({
        type: 'PUT',
        data: status,
        url: '/events/updatesponsor/' + $(this).attr('rel')
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            showSponsors();
        }
        else {
            showAlert('danger', $LAYOUT_ERROR + response.msg);
        }
    });  
}

// Unfeature sponsor
function unfeatureSponsor(event) {
    event.preventDefault();

    var status = {
        'status': 'Approved'
    }

    $.ajax({
        type: 'PUT',
        data: status,
        url: '/events/updatesponsor/' + $(this).attr('rel')
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            showSponsors();
        }
        else {
            showAlert('danger', $LAYOUT_ERROR + response.msg);
        }
    });  
}

// Remove sponsor
function removeSponsor(event) {
    event.preventDefault();

    $.ajax({
        type: 'DELETE',
        url: '/events/removesponsor/' + $(this).attr('rel')
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            showSponsors();
        }
        else {
            showAlert('danger', $LAYOUT_ERROR + response.msg);
        }
    });  
}

// Show Gallery
function showGallery(eventId) {
    var content = '';
    var counter = 0;
    $('#galleryPane').html('');
    $.getJSON( '/events/photo/' + eventId, function( data ) {
        $.each(data, function(){
            counter++;
            content =   '<div class="col-sm-4 col-xs-12 gallery-photo" style="text-align:center">' +
                            '<img style="max-width:90%" src="' + this.image + '"></img>' +
                            '<div style="position: absolute; right: 45px; top: 5px">' +
                                '<a style="border: solid white 2px" data-toggle="tooltip" title="' + $EVENTUPDATE_TIP_DELETE + '" class="btn btn-danger linkdeletephoto" rel="' + this._id + '">' +
                                    '<span class="glyphicon glyphicon-remove"></span>' +
                                '</a>' +
                            '</div>' +
                        '</div>';
            $('#galleryPane').html($('#galleryPane').html() + content);
        });
        $('#countGallery').html(counter);
        $('[data-toggle="tooltip"]').tooltip(); 
    });
}

// Remove photo
function removePhoto(event) {
    event.preventDefault();    
    $.ajax({
        type: 'DELETE',
        url: '/events/removephoto/' + $(this).attr('rel')
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            showGallery($('#eventId').val());
        }
        else {
            showAlert('danger', $LAYOUT_ERROR + response.msg);
        }
    });  
}