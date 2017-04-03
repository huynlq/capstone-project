// DOM Ready =============================================================

$(document).ready(function() {
  
  populateNotifications();

  markRead();

});

// Functions =============================================================

function populateNotifications() {
	var userId = readCookie('user');
	var content = "";
	var link = "";
	$.getJSON('/notifications/' + userId, function(data) {
		$.each(data, function(){
			if(this.link == null || this.link == undefined || this.link == 'undefined')
				link = "";
			else
				link = this.link;

			if(this.image == null || this.image == undefined || this.image == 'undefined')
				image = '<div class="media-left media-object"></div>';
			else
				image = '<div class="media-left"><img src="' + this.image + '" style="height:30px" class="media-object"/></div>';

			content += '<div class="media" style="width:100%">' +
						  image +
						  '<div class="media-body" style="width:100%">' +
						  	'<a href="' + link + '">' +
							    '<p>' + this.content + '</p>' +
							    '<p class="pull-right"><small>' + get_time_diff(new Date(this.dateCreated)) + '</small></p>' +
							'</a>' +
						  '</div>' +
						'</div><hr>';
		});

		$('#notificationPane').html(content);
	})
	console.log(content);
	
}

function markRead() {
	var status = {
		'markedRead': 'Read'
	}

	$.ajax({
        type: 'PUT',
        data: status,
        url: '/notifications/markread/' + readCookie('user')
    }).done(function( response ) {
        // Check for a successful (blank) response
        if (response.msg === '') {
            
        }
        else {
            showAlert('danger', $LAYOUT_ERROR + response.msg);
        }
    });  
}

function get_time_diff( datetime )
{
    var datetime = typeof datetime !== 'undefined' ? datetime : "2014-01-01 01:02:03.123456";

    var datetime = new Date( datetime ).getTime();
    var now = new Date().getTime();

    if( isNaN(datetime) )
    {
        return "";
    }

    console.log( datetime + " " + now);

    if (datetime < now) {
        var milisec_diff = now - datetime;
    }else{
        var milisec_diff = datetime - now;
    }

    var days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24));

    var date_diff = new Date( milisec_diff );

    var content = "";
    var limit = 2;
    var counter = 0;

    if(days != 0) {
    	content = days + ' ' + $LAYOUT_TIME_DAY + ' ' + (date_diff.getHours() - 7) + ' ' + $LAYOUT_TIME_HOUR;
    } else {
    	if((date_diff.getHours() - 7) != 0) {
    		content = (date_diff.getHours() - 7) + ' ' + $LAYOUT_TIME_HOUR + ' ' + date_diff.getMinutes() + ' ' + $LAYOUT_TIME_MINUTE;
    	} else {
    		content = date_diff.getMinutes() + ' ' + $LAYOUT_TIME_MINUTE;
    	}
    }


    return content;
}