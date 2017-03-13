// DOM Ready ===============================================

$(document).ready(function() {
  $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
      $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
  } );

  $('[data-toggle="tooltip"]').tooltip(); 

  $('#tableNews tbody').on('click', 'td a.linkdeletepost', deletePost);

  $('#tablePosts tbody').on('click', 'td a.linkdeletepost', deletePost);

  populateTables();
} );

// Functions ===============================================

function populateTables() {
	// jQuery AJAX call for JSON
    $.getJSON( '/posts/all', function( data ) {
        // For each item in our JSON, add a table row and cells to the content string
        showNews(data);
        showPosts(data);
    });    
}

function showNews(data) {
	var counter = 0;
    var dateCreated = "";
    var tableContent = "";
    var table = $('#tableNews').DataTable();
    table.clear().draw();
    var user = "";


    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
    	console.log(this.postType === 'Announcement' || this.postType === 'Report');
        if(this.postType === 'Announcement' || this.postType === 'Report'){            
            counter++;

            dateCreated = new Date(this.dateCreated);      
            table.row.add([
                counter,
                '<center>'
                    + '<a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="/posts/' + this._id + '">'
                        + '<span class="glyphicon glyphicon-search"></span>'
                    + '</a>'
                    + '<a data-toggle="tooltip" title="Details" class="btn btn-success btn-xs" href="/posts/updatepost/' + this._id + '">'
                        + '<span class="glyphicon glyphicon-edit"></span>'
                    + '</a>'
                    + '<a data-toggle="tooltip" title="Delete" class="btn btn-danger btn-xs linkdeletepost" rel="' + this._id + '" href="#">'
                        + '<span class="glyphicon glyphicon-remove"></span>'
                    + '</a>'
                + '</center>',
                this.postName,                
                this.userId,
                this.rating,
                this.comment,
                dateCreated.getDate() + '/' + (dateCreated.getMonth() + 1) + '/' +  dateCreated.getFullYear() + ' ' + dateCreated.getHours() + ':'  + dateCreated.getMinutes()
            ]).draw( false );
        }
    });
    
    $('#countNews').html(counter);
    $('[data-toggle="tooltip"]').tooltip(); 
}

function showPosts(data) {
	var counter = 0;
    var dateCreated = "";
    var tableContent = "";
    var table = $('#tablePosts').DataTable();
    table.clear().draw();
    var user = "";

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
        if(this.postType !== 'Announcement' && this.postType !== 'Report'){            
            counter++;

            dateCreated = new Date(this.dateCreated);      
            table.row.add([
                counter,
                '<center>'
                    + '<a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="/posts/' + this._id + '">'
                        + '<span class="glyphicon glyphicon-search"></span>'
                    + '</a>'
                    + '<a data-toggle="tooltip" title="Delete" class="btn btn-danger btn-xs linkdeletepost" rel="' + this._id + '" href="#">'
                        + '<span class="glyphicon glyphicon-remove"></span>'
                    + '</a>'
                + '</center>',
                this.postName,                
                this.user,
                this.rating,
                this.comment,
                dateCreated.getDate() + '/' + (dateCreated.getMonth() + 1) + '/' +  dateCreated.getFullYear()
            ]).draw( false );
        }
    });
    
    $('#countPosts').html(counter);
    $('[data-toggle="tooltip"]').tooltip(); 
}

function deletePost(event) {
    event.preventDefault();

    // If they did, do our delete
    $.ajax({
        type: 'DELETE',
        url: '/posts/deletepost/' + $(this).attr('rel')
    }).done(function( response ) {

        // Check for a successful (blank) response
        if (response.msg === '') {
        }
        else {
            alert('Error: ' + response.msg);
        }

        // Update the table
        populateTables();

    });
}