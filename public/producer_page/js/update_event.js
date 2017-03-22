// DOM Ready ===============================================

$(document).ready(function() {
    $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
        $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
    } );

    $('[data-toggle="tooltip"]').tooltip(); 

    populateTables();

    document.getElementById("active-tab").click();

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

    //========================== DIALOG HIDING FUNCTIONS ===================

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

function populateTables() {
	// jQuery AJAX call for JSON    
    var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
    $.getJSON( '/events/details/' + eventId, function( data ) {        
        showPendingDonations(data);


        // For each item in our JSON, add a table row and cells to the content string
        showDonations(data);
        showParticipants(data._id);
        showActivityCosts(data._id);        
        // showActivities(data);
        $('[data-toggle="tooltip"]').tooltip(); 
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
                            + '<a data-toggle="tooltip" title="Remove" class="btn btn-danger btn-xs linkremovedonation" rel="' + this._id + '" href="#">'
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

// Populate Sponsors Tables
function showSponsors(_id) {
    $('#tableSponsor_wrapper .row').first().css('margin-left', '30px');
    $('#tableSponsor_wrapper .row .col-sm-6').first().removeClass("col-sm-6").addClass("col-sm-2");

    $('#tablePendingSponsor_wrapper .row').first().css('margin-left', '30px');
    $('#tablePendingSponsor_wrapper .row .col-sm-6').first().removeClass("col-sm-6").addClass("col-sm-2");

    var sponsorData;

    //Get Donation data from the database
    $.getJSON( '/events/sponsor/' + $('#eventId').html(), function( dataSponsor ) {
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
    var newDonation = {
        'eventId': $('#eventId').html(),
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
            alert('Error: ' + response.msg);
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
            alert('Error: ' + response.msg);
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
            dateJoined = new Date(data.dateCreated);
            $.getJSON( '/users/id/' + this.userId, function( dataUser ) {
                if(participantStatus == 'Absent') {
                    actionPanel = '<a data-toggle="tooltip" title="Mark Present" class="btn btn-info btn-xs linkpresent" rel="' + participantId + '" href="#">'
                                    + '<span class="glyphicon glyphicon-user"></span>'
                                + '</a>';
                } else {
                    actionPanel = '<a data-toggle="tooltip" title="Mark Absent" class="btn btn-danger btn-xs linkabsent" rel="' + participantId + '" href="#">'
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
                    dateCreated.getDate() + '/' + (dateCreated.getMonth() + 1) + '/' +  dateCreated.getFullYear()
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
            alert('Error: ' + response.msg);
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
            alert('Error: ' + response.msg);
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
                '<center><a data-toggle="tooltip" title="Edit Actual Cost" class="btn btn-info btn-xs linkeditactualcost" rel="' + this._id + '" href="#">'
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
        $('#txtEditActivityEstCost').val(data.estBudget);
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
            alert('Error: ' + response.msg);
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
                            alert('Error: ' + response.msg);

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
            alert('Error: ' + response.msg);
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
            alert('Error: ' + response.msg);
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
            alert('Error: ' + response.msg);
        }
    });  
}