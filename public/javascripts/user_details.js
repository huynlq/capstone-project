// DOM Ready ===============================================

$(document).ready(function() {
  $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
  } );

  $('[data-toggle="tooltip"]').tooltip(); 

  var id = readCookie("user");

  populateInfo();
  populateEventJoined();
  populateEventProduced();
  populateEventSponsored();
} );

// Functions ===============================================

// Populate Info
function populateInfo() {
  var id = $('#userId').html();
  $.getJSON('/users/id/' + id, function( data ) {
    if(data.role == "Producer") {
      $('#eventSponsored-panel').attr('style','display: none');
    } else if(data.role == "Sponsor") {
      $('#eventProduced-panel').attr('style','display: none');
    } else {
      $('#companyInfoDiv').attr('style','display: none');
      $('#eventProduced-panel').attr('style','display: none');
      $('#eventSponsored-panel').attr('style','display: none');
    }
  });
}

// Populate Participated Events
function populateEventJoined() {
  var id = $('#userId').html();
  var counter = 0;
  var dateCreated = "";
  var eventId = "";
  $.getJSON('/events/getparticipatedevents/' + id, function( data ) {
    var table = $('#eventJoinedTable').DataTable();    
    $.each(data, function(){
      if(this.status != "Absent") {
        dateCreated = new Date(this.dateCreated);
        eventId = this.eventId;
        $.getJSON('/events/details/' + eventId, function( dataEvent ) {
          counter++;        
          table.row.add([
              counter,
              dataEvent.eventName,
              dataEvent.eventType,
              dataEvent.eventDate,
              '<a data-toggle="tooltip" title="View" class="btn btn-info btn-xs" href="../events/' + eventId + '">'
                + '<span class="glyphicon glyphicon-search"></span>'
              + '</a>'
          ]).draw( false );
          $('[data-toggle="tooltip"]').tooltip(); 
        });
      }      
    });
  });
}

// Populate event produced
function populateEventProduced() {
  var username = $('#txtUsername').html();
  var counter = 0;
  var dateCreated = "";
  $.getJSON('/events/producedevents/' + username, function( data ) {
    var table = $('#eventProducedTable').DataTable();    
    $.each(data, function(){
      if(this.status != "Absent") {
        dateCreated = new Date(this.dateCreated);
        counter++;        
        table.row.add([
            counter,
            this.eventName,
            this.eventType,
            this.eventDate,
            '<a data-toggle="tooltip" title="View" class="btn btn-info btn-xs" href="../events/' + this._id + '">'
              + '<span class="glyphicon glyphicon-search"></span>'
            + '</a>'
        ]).draw( false );
      }      
    });
  });
}

// Populate event sponsored
function populateEventSponsored() {
  var id = $('#userId').html();
  var counter = 0;
  var dateCreated = "";
  $.getJSON('/events/sponsoredevents/' + id, function( data ) {
    var table = $('#eventSponsoredTable').DataTable();    
    $.each(data, function(){      
      dateCreated = new Date(this.dateCreated);
      counter++;        
      table.row.add([
          counter,
          this.eventName,
          this.eventType,
          this.eventDate,
          '<a data-toggle="tooltip" title="View" class="btn btn-info btn-xs" href="../events/' + this._id + '">'
            + '<span class="glyphicon glyphicon-search"></span>'
          + '</a>'
      ]).draw( false );
    });
  });
}