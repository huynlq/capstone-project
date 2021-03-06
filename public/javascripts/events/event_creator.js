// DOM Ready =============================================================

$(document).ready(function() {
  $('#txtUser').val(readCookie('user'));

  $("#inputEventImage").change(function(e) {

      for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
          
          var file = e.originalEvent.srcElement.files[i];
          
          var img = document.createElement("img");
          var reader = new FileReader();
          reader.onloadend = function() {
            var date = (new Date).toString().replace(/ /g,'');
            img.src = reader.result;
            $("#txtImage").attr('src', img.src);              
            var extension = img.src.substring(img.src.indexOf("/")+1,img.src.indexOf(";"));
            $('#txtImageSrc').val("/images/event/" + date + "." + extension);
          }
          reader.readAsDataURL(file);
          
      }
  });
});           

// Functions =============================================================

// Validate and return image extension
function validateImageExtension(url) {
  if(url.indexOf(".jpg") != -1){
    return ".jpg";
  } else if(url.indexOf(".png") != -1) {
    return ".png";
  } else if(url.indexOf(".jpeg") != -1) {
    return ".jpeg";
  } else {
    return -1;
  }
}

function changeDate() {
  document.getElementById("txtDate").value = document.getElementById("reservation").value;
}

function initialize() {
    var mapOptions = {
        zoom: 17,
        center: new google.maps.LatLng(16.07565, 108.16980899999999),
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,              
    };            
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);            
    var input = document.getElementById('txtMeetingAddress');
    var autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
        var lat = place.geometry.location.lat();
        var lng = place.geometry.location.lng();
        document.getElementById('txtMeetingAddressLat').value = lat;
        document.getElementById('txtMeetingAddressLng').value = lng;
        var marker = new google.maps.Marker({position: new google.maps.LatLng(lat, lng)});
        marker.setMap(map);
        var panPoint = new google.maps.LatLng(lat, lng);
        map.panTo(panPoint);
        //alert("This function is working!");
        //alert(place.name);
       // alert(place.address_components[0].long_name);

    });
}
google.maps.event.addDomListener(window, 'load', initialize);      


function goNext() {  
  if($('#txtImageSrc').attr('src') != '' ) {
    var ext = validateImageExtension($('#txtImageSrc').attr('src'));
    if(ext == -1)
      alert("Only accept JPG and PNG image.");
    else {
      var donateNo = parseInt(document.getElementById("txtNumberOfDonation").value);
      var otherDonationItem = [];
      var otherDonationNumber = [];
      var donations = [];
      for (var i = 0; i < donateNo; i++) {
        if(document.getElementById("donation-row-" + (i + 1)) != null) {
          // otherDonationItem.push(document.getElementById("donation-item-" + (i + 1)).innerHTML);
          // otherDonationNumber.push(document.getElementById("donation-number-" + (i + 1)).innerHTML);              
          donations.push({
            'donationItem'    : $('#donation-item-' + (i + 1)).html(),
            'donationNumber'  : $('#donation-number-' + (i + 1)).html(),
            'donationUnit'    : $('#donation-unit-' + (i + 1)).html(),
            'donationMinimum' : $('#donation-minimum-' + (i + 1)).html()
          });
        }
      }

      var content = {
        eventName: document.getElementById("txtEventName").value,
        eventType: document.getElementById("txtEventType").value,
        eventDate: document.getElementById("txtDate").value,
        meetingTime: document.getElementById("txtMeetingTime").value,
        meetingAddress: document.getElementById("txtMeetingAddress").value,
        meetingAddressLat: document.getElementById("txtMeetingAddressLat").value,
        meetingAddressLng: document.getElementById("txtMeetingAddressLng").value,
        contractEmail: document.getElementById("txtEmail").value,
        contractPhone: document.getElementById("txtPhone").value,
        eventDescription: document.getElementById("txtDescription").value.replace(/\n/g,"<br />"),
        volunteerMax: document.getElementById("txtVolunteersMax").value,
        budget: document.getElementById("txtBudget").value,        
        imageSrc: document.getElementById('txtImage').value,
        imageExt: ext
      };
      localStorage.setItem("eventItem", JSON.stringify(content));
      localStorage.setItem("eventDonation", JSON.stringify(donations));

      window.location = "creator_activity";
    }
  }
}

function readURL() {    
            $('#txtImageSrc')
                .attr('src', $('#txtImage').val())
                .height(150);
}