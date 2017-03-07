// DOM Ready ===============================================

$(document).ready(function() {
  $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
  } );

  $('[data-toggle="tooltip"]').tooltip(); 

  populateTables();

  document.getElementById("active-tab").click();

  $('#tableDonation tbody').on('click', 'td a.linkremovedonation', deleteDonation);

  $('#tableParticipants tbody').on('click', 'td a.linkabsent', markAbsent);

  $('#tableParticipants tbody').on('click', 'td a.linkpresent', markPresent);


} );

// Functions ===============================================

function populateTables() {
	// jQuery AJAX call for JSON
    $.getJSON( '/events/details/' + $('#eventId').html(), function( data ) {

        showDonations(data);


        // For each item in our JSON, add a table row and cells to the content string
        // showDonations(data);
        showParticipants(data._id);
        // showActivities(data);
        $('[data-toggle="tooltip"]').tooltip(); 
    }); 
}

// Populate Donation Item
function showDonations(data) {
    
    //Set donation items variables
    var items = { 'Cash': 0 };
    var itemsRequire = { 'Cash': data.donationNeeded };

    //Populate select input and get required items
    $('#txtDonationItem').html('<option>Cash</option>');
    if(data.otherDonationItem != null && data.otherDonationItem != ""){
        if(data.otherDonationItem.constructor !== Array) {

            items[data.otherDonationItem.trim()] = 0;
            itemsRequire[data.otherDonationItem.trim()] = data.otherDonationNumber;

            $('#txtDonationItem').html( $('txtDonationItem').html() +
                    '<option>' + data.otherDonationItem + '</option>'
                );
        } else {
            for (var i = 0; i < data.otherDonationItem.length; i++) {

                items[data.otherDonationItem[i].trim()] = 0;
                itemsRequire[data.otherDonationItem[i].trim()] = data.otherDonationNumber[i];

                $('#txtDonationItem').html( $('#txtDonationItem').html() +
                        '<option>' + data.otherDonationItem[i] + '</option>'
                    );
            }
        }
    }

    //Get Donation data from the database
    $.getJSON( '/events/donations/' + $('#eventId').html(), function( dataDonation ) {
        //Populate the table
        var table = $('#tableDonation').DataTable();
        table.clear().draw();
        var counter = 0;        
        if(dataDonation != null) {
            $.each(dataDonation, function(){

                if(items.hasOwnProperty(this.donationItem)) {
                    items[this.donationItem] = parseInt(items[this.donationItem]) + parseInt(this.donationNumber);
                } else {
                    items[this.donationItem] = this.donationNumber;
                }

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
            });
        }
        $('[data-toggle="tooltip"]').tooltip(); 
        
        //Populate the progressbar panel
        $('#event-currentDonation').html(parseInt(items['Cash']).toLocaleString());
        $('#event-donation').html(parseInt(itemsRequire['Cash']).toLocaleString());
        var percent = (parseInt(items['Cash']) / parseInt(itemsRequire['Cash'])) * 100;
        $('#donationProgress').attr("style", "width: " + percent + "%");

        var key = Object.keys(itemsRequire);
        var current;
        var required;
        $('#event-other-donation-progress').html('');
        for(var i = 1; i < key.length; i++) {
            current = parseInt(items[key[i]]);
            required = parseInt(itemsRequire[key[i]]);
            $('#event-other-donation-progress').html( $('#event-other-donation-progress').html() +
                '<label>' + key[i] + ': </label> ' + current.toLocaleString() + '/<span id="event-donation">' + required.toLocaleString() + '</span>' +
                '<div class="progress">' +                                 
                    '<div role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:' + (current/required)*100 + '%" class="progress-bar progress-bar-striped active"></div>' +
                '</div>'
            );
        }
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

    var table = $('#tableDonation').DataTable();
    var data = table.row( $(this).parents('tr') ).data();
    
    var item = data[3];
    var number = data[4];

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

// Populate Participant Table
function showParticipants(_id) {
    console.log(_id);
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

// Populate Upcoming Events Table
// function showDonations(data) {
// 	var counter = 0;
// 	var dateCreated = "";
// 	var tableContent = "";
// 	var table = $('#tableUpcomingEvents').DataTable();
//     table.clear().draw();
//     var now = new Date();
//     var eventEndDate = "";

//     // For each item in our JSON, add a table row and cells to the content string
//     $.each(data, function(){
//         eventStartDate = new Date(this.eventDate.split(" - ")[0]);
//         eventEndDate = new Date(this.eventDate.split(" - ")[1]);
//         if(eventEndDate.getTime() >= now.getTime() && this.status != "Cancelled"){            
//             counter++;
//             dateCreated = new Date(this.dateCreated);
//             table.row.add([
//                 counter,
//                 '<center>'
//                     + '<a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="events/' + this._id + '">'
//                         + '<span class="glyphicon glyphicon-search"></span>'
//                     + '</a>'
//                     + '<a data-toggle="tooltip" title="Cancel" class="btn btn-danger btn-xs linkcancelevent" rel="' + this._id + '" href="#">'
//                         + '<span class="glyphicon glyphicon-remove"></span>'
//                     + '</a>'
//                 + '</center>',
//                 this.eventName,
//                 this.eventType,
//                 this.user,
//                 this.contactEmail,
//                 this.contactPhone,
//                 eventStartDate.getDate() + '/' + (eventStartDate.getMonth() + 1) + '/' +  eventStartDate.getFullYear(),
//                 this.meetingAddress,
//                 this.donationNeeded,
//                 dateCreated.getDate() + '/' + (dateCreated.getMonth() + 1) + '/' +  dateCreated.getFullYear()
//             ]).draw( false );
//         }
//     });
    
//     $('#countUpcomingEvents').html(counter);
//     $('[data-toggle="tooltip"]').tooltip(); 
// }