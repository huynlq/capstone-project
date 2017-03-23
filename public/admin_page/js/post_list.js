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
        //showPosts(data);
    });    
}

function showNews(data) {
	var counterNews = 0;
    var counterBoard = 0;
    var dateCreated = "";
    var tableContent = "";    
    $('#tableNews').DataTable().clear().draw();
    $('#tablePosts').DataTable().clear().draw();
    var user = "";
    var content = "";
    var comment = 0;

    // For each item in our JSON, add a table row and cells to the content string    
    $.each(data, function(){
        $.ajax({
            url: '/posts/commentnumber/' + this._id,
            dataType: 'json',
            async: false,
            success: function( data ) {
                comment = data;
            }
        });

        $.ajax({
            url: '/users/id/' + this.userId,
            dataType: 'json',
            async: false,
            success: function( data ) {
                user = '<a href="/users/' + data._id + '">' + data.username + '</a>';
            }
        });

        content = '<center>'
                        + '<a data-toggle="tooltip" style="margin: 0 5px" title="Details" class="btn btn-info btn-xs" href="/posts/' + this._id + '">'
                            + '<span class="glyphicon glyphicon-search"></span>'
                        + '</a>'
                        + '<a data-toggle="tooltip" style="margin: 0 5px" title="Edit" class="btn btn-success btn-xs" href="/posts/updatepost/' + this._id + '">'
                            + '<span class="glyphicon glyphicon-edit"></span>'
                        + '</a>'
                        + '<a data-toggle="tooltip" style="margin: 0 5px" title="Delete" class="btn btn-danger btn-xs linkdeletepost" rel="' + this._id + '" href="#">'
                            + '<span class="glyphicon glyphicon-remove"></span>'
                        + '</a>'
                    + '</center>';
        dateCreated = new Date(this.dateCreated);

        if(this.postType === 'News'){
            counterNews++;
            
            $('#tableNews').DataTable().row.add([
                counterNews,
                content,
                this.postName,                
                user,
                this.rating,
                comment,
                dateCreated.toLocaleTimeString() + ' - ' + dateCreated.toLocaleDateString()
            ]).draw( false );
        } else {
            counterBoard++;
            
            $('#tablePosts').DataTable().row.add([
                counterBoard,
                content,
                this.postName,                
                this.user,
                this.rating,
                comment,
                dateCreated.toLocaleTimeString() + ' - ' + dateCreated.toLocaleDateString()
            ]).draw( false );
        }
    });
    
    $('#countNews').html(counterNews);
    $('#countPosts').html(counterBoard);
    $('[data-toggle="tooltip"]').tooltip(); 
}

function showPosts(data) {
	var counter = 0;
    var dateCreated = "";
    var tableContent = "";
    var table = $('#tablePosts').DataTable();
    table.clear().draw();
    var user = "";
    var username = "";
    var role = "User";
    var content = "";
    $.ajax({
        url: '/users/id/' + readCookie('user'),
        dataType: 'json',
        async: false,
        success: function( data ) {
            if(data.role == 'Admin') {
                role = 'Admin';
            }

            username = data.username;
        }
    });

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
        if(this.postType !== 'Announcement' && this.postType !== 'Report'){            
            counter++;
            if(role == "Admin" || username == this.user) {
                content = '<center>'
                            + '<a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="/posts/' + this._id + '">'
                                + '<span class="glyphicon glyphicon-search"></span>'
                            + '</a>'
                            + '<a data-toggle="tooltip" title="Edit" class="btn btn-success btn-xs" href="/posts/updatepost/' + this._id + '">'
                                + '<span class="glyphicon glyphicon-edit"></span>'
                            + '</a>'
                            + '<a data-toggle="tooltip" title="Delete" class="btn btn-danger btn-xs linkdeletepost" rel="' + this._id + '" href="#">'
                                + '<span class="glyphicon glyphicon-remove"></span>'
                            + '</a>'
                        + '</center>';
            } else {
                content = '<center>'
                            + '<a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="/posts/' + this._id + '">'
                                + '<span class="glyphicon glyphicon-search"></span>'
                            + '</a>'
                        + '</center>';
            }

            dateCreated = new Date(this.dateCreated);      
            table.row.add([
                counter,
                content,
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