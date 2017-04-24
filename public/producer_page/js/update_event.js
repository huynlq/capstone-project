// DOM Ready ===============================================

$(document).ready(function() {
    populateLanguage();

    $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
        $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
    } );

    $('[data-toggle="tooltip"]').tooltip(); 

    populateTables();        

    $('#tab-pane li a').first().click();

    $('#tableDonation tbody').on('click', 'td a.linkremovedonation', deleteDonation);

    $('#tablePendingDonation tbody').on('click', 'td a.linkapprovedonation', approveDonation);

    $('#tablePendingDonation tbody').on('click', 'td a.linkremovedonation', deleteDonation);

    $('#tableParticipants tbody').on('click', 'td a.linkabsent', markAbsent);

    $('#tableParticipants tbody').on('click', 'td a.linkpresent', markPresent);

    $('#tableActivityCosts tbody').on('click', 'td a.linkeditactualcost', editActualCost);

    $('#tablePendingSponsor tbody').on('click', 'td a.linkapprovesponsor', approveSponsor);

    $('#tablePendingSponsor tbody').on('click', 'td a.linkdisapprovesponsor', disapproveSponsor);

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
    $('.tab-pending-donation').html($EVENTUPDATE_TAB_PENDING_DONATION);
    $('.tab-participant').html($EVENTUPDATE_TAB_PARTICIPANT);
    $('.tab-cost').html($EVENTUPDATE_TAB_COST);
    $('.tab-sponsor').html($EVENTUPDATE_TAB_SPONSOR);
    $('.tab-gallery').html($EVENTUPDATE_TAB_GALLERY);
    $('.tab-pending-donation-long').html($EVENTUPDATE_TAB_PENDING_DONATION_LG);
    $('.tab-current-sponsor').html($EVENTUPDATE_TAB_SPONSOR_CR);
    $('.tab-pending-sponsor').html($EVENTUPDATE_TAB_SPONSOR_PD);

    $('.th-action').html();

    $('.th-donator').html($EVENTDETAILS_DONATION_NAME);
    $('.th-donator-email').html($EVENTDETAILS_DONATION_EMAIL);
    $('.th-donator-phone').html($EVENTDETAILS_DONATION_PHONE);
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
    $('.th-donation').html($EVENTUPDATE_TH_DONATION);

    $('#gallery-upload').val($EVENTUPDATE_GALLERY_UPLOAD);
    $('#gallery-require').html($EVENTUPDATE_GALLERY_REQUIRE);
}

function populateTables() {
	// jQuery AJAX call for JSON    
    var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
    $.getJSON( '/events/details/' + eventId, function( data ) {        

        $('#eventName').html('<a href="/events/' + data._id + '">' + data.eventName + '</a>');        


        // For each item in our JSON, add a table row and cells to the content string
        showDonations(data);
        showPendingDonations(data);
        showParticipants(data._id);
        showActivityCosts(data._id);        
        showGallery(data._id);
        showSponsors(data._id);
        populateDonationForm(data._id);
        populateUnit();
        
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
        var item;
        if(dataDonation != null) {
            for(var i = dataDonation.length - 1; i >= 0; i--) {
                if(dataDonation[i].status != "Pending") {
                    if(dataDonation[i].donationType == "Cash")
                        item = $EVENTDETAILS_DONATION_CASH;
                    else
                        item = dataDonation[i].donationItem;
                    counter++;
                    dateCreated = new Date(dataDonation[i].dateCreated);        
                    table.row.add([
                        counter,
                        '<center>'
                            + '<a data-toggle="tooltip" title="' + $EVENTUPDATE_TIP_DELETE + '" class="btn btn-danger btn-xs linkremovedonation" rel="' + dataDonation[i]._id + '" href="#">'
                                + '<span class="glyphicon glyphicon-remove"></span>'
                            + '</a>'
                        + '</center>',
                        '<a href="/users/' + dataDonation[i].userId + '">' + dataDonation[i].donatorName + '</a>',
                        item,
                        parseInt(dataDonation[i].donationNumber).toLocaleString() + ' ' + dataDonation[i].donationUnit,
                        dateCreated.toLocaleDateString()
                    ]).draw( false );
                }
            }
            $('#countDonations').html(counter);
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
            var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
            $.getJSON( '/events/donations/id/' + donationId, function( data ) {
                $.getJSON( '/events/details/' + eventId, function( dataEvent ) {        
                    showDonations(dataEvent);
                    showPendingDonations(dataEvent);

                    var producerId = dataEvent.userId;
                    var image = "";

                    $.ajax({
                        type: 'GET',
                        url: '/users/id/' + producerId,
                        async: false
                    }).done(function( response ) {
                        image = response.companyImage;
                    })
                    
                    eventName = dataEvent.eventName;

                    var newNotification = {
                        'userId': data.userId,
                        'content': 'Đóng góp của bạn cho sự kiện ' + eventName + 'đã được xác nhận',
                        'link': '/events/' + eventId,
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

    var sponsorData;

    //Get Donation data from the database
    $.getJSON( '/events/allsponsor/' + _id, function( dataSponsor ) {
        console.log(dataSponsor);
        var tableSponsor = $('#tableSponsor').DataTable();
        var tablePendingSponsor = $('#tablePendingSponsor').DataTable();
        tableSponsor.clear().draw();
        tablePendingSponsor.clear().draw();
        var counter = 0;
        var pendingCounter = 0;
        var actionPanel = "";
        var status = "";
        if(dataSponsor != null) {
            for(var i = 0; i < dataSponsor.length; i++) {
                sponsorData = dataSponsor[i];
                if(dataSponsor[i].status == "Pending") {
                    pendingCounter++;
                    $.ajax({
                        type: 'GET',
                        url: '/users/id/' + dataSponsor[i].userId,
                        async: false
                    }).done(function( dataUser ) {
                        tablePendingSponsor.row.add([
                            pendingCounter,
                            '<center>'
                                + '<a data-toggle="tooltip" title="Approve" class="btn btn-success btn-xs linkapprovesponsor" rel="' + sponsorData._id + '" href="#">'
                                    + '<span class="glyphicon glyphicon-ok"></span>'
                                + '</a>'
                                + '<a data-toggle="tooltip" title="Disapprove" class="btn btn-danger btn-xs linkdisapprovesponsor" rel="' + sponsorData._id + '" href="#">'
                                    + '<span class="glyphicon glyphicon-remove"></span>'
                                + '</a>'
                            + '</center>',
                            '<a href="/users/' + dataUser._id + '">' + dataUser.companyName + '</a>',
                            dataUser.companyEmail,
                            dataUser.companyPhoneNumber,
                            sponsorData.donation
                        ]).draw('false');
                        $('[data-toggle="tooltip"]').tooltip(); 
                    });
                } else {
                    counter++;
                    $.ajax({
                        type: 'GET',
                        url: '/users/id/' + dataSponsor[i].userId,
                        async: false
                    }).done(function( dataUser ) {
                        tableSponsor.row.add([
                            counter,
                            '<center>'
                                + '<a data-toggle="tooltip" title="Remove" class="btn btn-danger btn-xs linkremovesponsor" rel="' + sponsorData._id + '" href="#">'
                                    + '<span class="glyphicon glyphicon-remove"></span>'
                                + '</a>'
                            + '</center>',
                            '<a href="/users/' + dataUser._id + '">' + dataUser.companyName + '</a>',
                            dataUser.companyEmail,
                            dataUser.companyPhoneNumber
                        ]).draw('false');
                        $('[data-toggle="tooltip"]').tooltip(); 
                    });
                }
            }
        }

        $('#countSponsors').html(counter + ' - ' + pendingCounter);
    });
}

// Populate Unit
function populateUnit() {
    var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
    $.getJSON( '/events/donationrequire/' + eventId, function( data ) {
        for(var i = 0; i < data.length; i++) {
            if($('#txtDonationItem').val() == data[i].item)
                $('#txtDonationNumber').attr('placeholder',data[i].unit);
        }
    });
}

// Add new donation
function addDonation() {
    if(validateAddDonation() == true) {
        var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
        var newDonation = {
            'eventId': eventId,            
            'userId': '',
            'donatorName': $('#txtDonatorName').val(),
            'donationItem': $('#txtDonationItem').val(),
            'donationNumber': $('#txtDonationNumber').val(),
            'donationUnit': $('#txtDonationNumber').attr('placeholder'),
            'status': 'Approved',
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
                $('#txtDonatorEmail').val('');
                $('#txtDonatorPhone').val('');
                $('#txtDonationItem').val('');
                $('#txtDonationNumber').val('');
                $('#txtDonationUnit').val('');

                // Update the table
                populateTables();
            } else {
                showAlert('danger', $LAYOUT_ERROR + response.msg);
            }
        });
    }    
}

// Validate Form
function validateAddDonation() {
    if($('#txtDonatorName').val() == '') {
        showAlert('danger', $EVENTUPDATE_ALERT_REQUIRE);
        $('#txtDonatorName').focus();
        return false;
    }

    if($('#txtDonatorEmail').val() == '') {
        showAlert('danger', $EVENTUPDATE_ALERT_REQUIRE);
        $('#txtDonatorEmail').focus();
        return false;
    }

    if($('#txtDonatorPhone').val() == '') {
        showAlert('danger', $EVENTUPDATE_ALERT_REQUIRE);
        $('#txtDonatorPhone').focus();
        return false;
    }

    if($('#txtDonationNumber').val() == '') {
        showAlert('danger', $EVENTUPDATE_ALERT_REQUIRE);
        $('#txtDonationNumber').focus();
        return false;
    }

    if(!validateEmail($('#txtDonatorEmail').val())) {
        showAlert('danger', $EVENTUPDATE_ALERT_EMAIL);
        return false;
        $('#txtDonatorEmail').focus();
    }

    if($('#txtDonationNumber').val() <= 0) {
        showAlert('danger', $EVENTUPDATE_ALERT_NUMBER);
        return false;
        $('#txtDonationNumber').focus();
    }

    return true;
}

// Validate email
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// Delete donation
function deleteDonation(event) {
    var donationId = $(this).attr('rel');
    $.ajax({
        type: 'GET',
        url: '/events/donations/id/' + donationId,
        async: false
    }).done(function( docs ) {
        console.log(docs);
        var userId = docs.userId;
        if(userId == '') {
            //If they did, do our delete
            $.ajax({
                type: 'DELETE',
                url: '/events/deletedonation/' + donationId
            }).done(function( response ) {

                // Check for a successful (blank) response
                if(response.msg == '') {
                    // Update the table
                    populateTables();                    
                } else {
                    showAlert('danger', $LAYOUT_ERROR + response.msg);
                }
            }); 
        } else {
            var status = {
                'status': 'Pending'
            };
            
            $.ajax({
                type: 'PUT',
                data: status,
                url: '/events/updatedonation/' + donationId
            }).done(function( response ) {
                // Check for a successful (blank) response
                if (response.msg === '') {
                    // Update the table
                    populateTables();                    
                    var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
                    $.getJSON( '/events/details/' + eventId, function( dataEvent ) {        
                        var producerId = dataEvent.userId;
                        var image = "";

                        $.ajax({
                            type: 'GET',
                            url: '/users/id/' + producerId,
                            async: false
                        }).done(function( response ) {
                            image = response.companyImage;
                        })
                        
                        eventName = dataEvent.eventName;

                        var newNotification = {
                            'userId': userId,
                            'content': 'Đóng góp của bạn cho sự kiện "' + eventName + '" đã bị bác bỏ.',
                            'link': '/events/' + eventId,
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
                    });                      
                }
                else {
                    showAlert('danger', $LAYOUT_ERROR + response.msg);
                }
            });
        }             
    }); 

    event.preventDefault();    
}

// Populate Pending Donation Item
function showPendingDonations(data) {
    //Get Donation data from the database
    $.getJSON( '/events/donations/' + data._id, function( dataDonation ) {
        //Populate the table
        var table = $('#tablePendingDonation').DataTable();
        table.clear().draw();
        var counter = 0;     
        var item;   
        if(dataDonation != null) {
            for(var i = dataDonation.length - 1; i >= 0; i--) {
                if(dataDonation[i].status == "Pending") {
                    if(dataDonation[i].donationType == "Cash")
                        item = $EVENTDETAILS_DONATION_CASH;
                    else
                        item = dataDonation[i].donationItem;
                    counter++;
                    dateCreated = new Date(dataDonation[i].dateCreated);        
                    table.row.add([
                        counter,
                        '<center>'
                            + '<a data-toggle="tooltip" title="Approve" class="btn btn-success btn-xs linkapprovedonation" rel="' + dataDonation[i]._id + '" href="#">'
                                + '<span class="glyphicon glyphicon-ok"></span>'
                            + '</a>'
                            + '<a data-toggle="tooltip" title="Disapprove" class="btn btn-danger btn-xs linkremovedonation" rel="' + dataDonation[i]._id + '" href="#">'
                                + '<span class="glyphicon glyphicon-remove"></span>'
                            + '</a>'
                        + '</center>',
                        '<a href="/users/' + dataDonation[i].userId + '">' + dataDonation[i].donatorName + '</a>',
                        dataDonation[i].donatorEmail,
                        dataDonation[i].donatorPhoneNumber,
                        item,
                        parseInt(dataDonation[i].donationNumber).toLocaleString() + ' ' + dataDonation[i].donationUnit,
                        dateCreated.toLocaleDateString()
                    ]).draw( false );
                }
            }
            $('#countPendingDonations').html(counter);
        }
        $('[data-toggle="tooltip"]').tooltip(); 
    }); 
}

// Populate Participant Table
function showParticipants(_id) {    
    var table = $('#tableParticipants').DataTable();
    table.clear().draw();
    var dateJoined = "";
    var counter = 0;
    var actionPanel = "";
    $('#countParticipants').html(counter);

    $.getJSON( '/events/participants/' + _id, function( data ) {
        $.each(data, function(){
            var participantId = this._id;
            var participantStatus = this.status;            
            dateCreated = new Date(this.dateCreated);
            $.getJSON( '/users/id/' + this.userId, function( dataUser ) {
                counter++;
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
                    counter + '<p class="participantId" style="display:none">' + participantId + '</p>',
                    '<center>' + actionPanel + '</center>',
                    dataUser.username,
                    dataUser.fullName,
                    dataUser.email,
                    dataUser.phoneNumber,
                    dateCreated.toLocaleDateString()
                ]).draw(false);
                $('[data-toggle="tooltip"]').tooltip(); 
                $('#countParticipants').html(counter);
            });
        });        
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
            var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
            
            $.getJSON( '/events/details/' + eventId, function( dataEvent ) {        
                var producerId = dataEvent.userId;
                var image = "";

                $.ajax({
                    type: 'GET',
                    url: '/users/id/' + producerId,
                    async: false
                }).done(function( response ) {
                    image = response.companyImage;
                })
                
                eventName = dataEvent.eventName;

                console.log(dataId);
                $.getJSON( '/events/getparticipantbyid/' + dataId, function( dataParticipant ) {      
                    console.log(dataParticipant);
                    var newNotification = {
                        'userId': dataParticipant[0].userId,
                        'content': 'Bạn đã bị đánh vắng cho sự kiện "' + eventName + '"',
                        'link': '/events/' + eventId,
                        'markedRead': 'Unread',
                        'dateCreated': new Date()
                    }

                    console.log(newNotification);

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
                });                  
            });   
            
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
    var actualCost = "";

    $.getJSON( '/events/activities/' + _id, function( data ) {
        console.log(data);
        $.each(data, function(){
            actualCost = "";
            console.log(this.actualCost);
            if(this.actualCost == null) {
                
            } else {                
                for(var i = 0; i < this.actualCost.length; i++) {
                    actualCost += '<p>' + this.actualCost[i].item + ': ' + parseInt(this.actualCost[i].cost).toLocaleString() + ' (' + this.actualCost[i].unit + ')</p>';
                }
            }                
            counter++;
            table.row.add([
                counter + '<input type="hidden" name="txtActivityId" value="' + this._id + '"/>',
                this.day,
                this.time,
                this.place,
                this.activity,
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

    for(var j = 0; j < $('.donateItem').length; j++) {
        $('.donateItem')[j].value = '';
    }

    $.getJSON( '/events/activities/id/' + $(this).attr('rel'), function( data ) {
        $('#txtEditActivityDay').html(data.day);
        $('#txtEditActivityTime').html(data.time);
        $('#txtEditActivityPlace').html(data.place);
        $('#txtEditActivity').html(data.activity);
        $('#txtEditActivityEstCost').html(data.note);
        if(data.actualCost != null) {
            for(var i = 0; i < data.actualCost.length; i++) {
                if(data.actualCost[i] != null) {
                    for(var j = 0; j < $('.donateItem').length; j++) {
                        if(data.actualCost[i].cost != null && data.actualCost[i].cost != '' && data.actualCost[i].item == $('.donateItemLabel')[j].innerHTML)
                            $('.donateItem')[j].value = data.actualCost[i].cost;
                    }
                }                    
            }
        }        
    });

    $('#txtEditActivityId').val($(this).attr('rel'));
    
    $('#edit-actual-cost-form').dialog('open');    
}

// Confirm edit actual cost
function confirmEditActualCost() {
    var costs = [];
    var cost = new Object();

    for(var i = 0; i < $('.donateItem').length; i++) {
        if($('.donateItem')[i].value != "" && $('.donateItem')[i].value > 0) {
            cost = {
                item: $('.donateItemLabel')[i].innerHTML,
                cost: $('.donateItem')[i].value,
                unit: $('.donateItem')[i].placeholder.split('(')[1].split(')')[0]
            };
            costs.push(cost);
        }
    }

    var activity = {
        'actualCost': costs
    };

    $.ajax({
        type: 'PUT',
        data: activity,
        url: '/events/updateactivity/' + $('#txtEditActivityId').val()
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            populateTables();
            $('#edit-actual-cost-form').dialog('close');
            showAlert('success', $EVENTUPDATE_ALERT_ACTUALCOST);
        }
        else {
            showAlert('danger', $LAYOUT_ERROR + response.msg);
        }
    });  
}

// Populate Donation form
function populateDonationForm(eventId) {
    $.getJSON( '/events/donationrequire/' + eventId, function( data ) {
        //Set donation items variables
        var items = [];
        var donateContent = "";
        var itemContent = "";

        //Get required items
        for(var i = 0; i < data.length; i++) {
            items.push({
                item: data[i].item.trim(),
                number: parseInt(data[i].quantity),
                unit: data[i].unit.trim(),
                current: 0
            });

            donateContent += '<div class="row form-group">' +
                                '<label class="donateItemLabel control-label col-md-3 col-sm-3 col-xs-12">' + data[i].item + '</label>' +
                                '<div class="col-md-8 col-sm-8 col-xs-12">' +
                                  '<input id="' + data[i]._id + '" class="donateItem form-control" type="number" placeholder="(' + data[i].unit + ')" class="form-control col-md-6 col-xs-10"/>' +
                                '</div>' +
                             '</div>';
            itemContent += '<option>' + data[i].item + '</option>';
        }

        $('#donationFormItems').html(donateContent);
        $('#txtDonationItem').html(itemContent);
    });
}

// Approve sponsor
function approveSponsor(event) {
    event.preventDefault();
    var sponsorId = $(this).attr('rel');

    $.getJSON( '/events/sponsor/id/' + sponsorId, function( data ) {   
        console.log(data);
        var userId = data.userId;
        var eventId = data.eventId;
        var eventName = "";
        $.getJSON( '/events/details/' + eventId, function( dataEvent ) {
            console.log(dataEvent);
            eventName = dataEvent.eventName;
            var status = {
                'status': 'Approved'
            }

            var producerId = dataEvent.userId;
            var image = "";

            $.ajax({
                type: 'GET',
                url: '/users/id/' + producerId
            }).done(function( response ) {
                image = response.companyImage;
            })

            console.log(status);

            $.ajax({
                type: 'PUT',
                data: status,
                url: '/events/updatesponsor/' + sponsorId
            }).done(function( response ) {
                // Check for a successful (blank) response
                    var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];
                    showSponsors(eventId);
                    
                    var newNotification = {
                        'userId': userId,
                        'content': 'Bạn đã được xác nhận làm Nhà tài trợ cho sự kiện "' + eventName + '"',
                        'link': '/events/' + eventId,
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
    var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];

    var status = {
        'status': 'Pending'
    }

    $.ajax({
        type: 'PUT',
        data: status,
        url: '/events/updatesponsor/' + $(this).attr('rel')
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            showSponsors(eventId);
        }
        else {
            showAlert('danger', $LAYOUT_ERROR + response.msg);
        }
    });
}

// Remove sponsor
function disapproveSponsor(event) {
    event.preventDefault();
    var eventId = window.location.href.split('/')[window.location.href.split('/').length - 1].split('#')[0];

    var status = {
        'status': 'Pending'
    }

    $.ajax({
        type: 'DELETE',
        data: status,
        url: '/events/removesponsor/' + $(this).attr('rel')
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            $.getJSON( '/events/details/' + eventId, function( dataEvent ) {                                
                eventName = dataEvent.eventName;
                showSponsors(eventId);
                var newNotification = {
                    'userId': response.id,
                    'content': 'Yêu cầu tài trợ cho sự kiện "' + eventName + '" của bạn đã bị bác bỏ',
                    'link': '/events/' + eventId,
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

                    } else {
                        $('#txtUserDisapproveId').val("");
                        $('#txtUserDisapprove').val("");
                        $('#txtDisapproveReason').val("");
                        $('#disapprove-reason-form').dialog('close');
                    }
                });
            });
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