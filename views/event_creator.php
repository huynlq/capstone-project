<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Charity Project | Event Creator</title>

    <!-- Bootstrap -->
    <link href="../vendors/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="../vendors/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <!-- NProgress -->
    <link href="../vendors/nprogress/nprogress.css" rel="stylesheet">
    <!-- iCheck -->
    <link href="../vendors/iCheck/skins/flat/green.css" rel="stylesheet">
  
    <!-- bootstrap-progressbar -->
    <link href="../vendors/bootstrap-progressbar/css/bootstrap-progressbar-3.3.4.min.css" rel="stylesheet">
    <!-- JQVMap -->
    <link href="../vendors/jqvmap/dist/jqvmap.min.css" rel="stylesheet"/>
    <!-- bootstrap-daterangepicker -->
    <link href="../vendors/bootstrap-daterangepicker/daterangepicker.css" rel="stylesheet">
    <!-- Datatables -->
    <link href="../vendors/datatables.net-bs/css/dataTables.bootstrap.min.css" rel="stylesheet">
    <link href="../vendors/datatables.net-buttons-bs/css/buttons.bootstrap.min.css" rel="stylesheet">
    <link href="../vendors/datatables.net-fixedheader-bs/css/fixedHeader.bootstrap.min.css" rel="stylesheet">
    <link href="../vendors/datatables.net-responsive-bs/css/responsive.bootstrap.min.css" rel="stylesheet">
    <link href="../vendors/datatables.net-scroller-bs/css/scroller.bootstrap.min.css" rel="stylesheet">    
    <!-- Custom Theme Style -->
    <link href="../build/css/custom.min.css" rel="stylesheet">
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAxUeMBUbKnW-LKTWTIL656w7nHABuNMTI&libraries=places"></script>
    <!-- jQuery -->
    <script src="../vendors/jquery/dist/jquery.min.js"></script>
    <link href="../vendors/jquery-ui-1.12.1/jquery-ui.css" rel="stylesheet">
    <script src="../vendors/jquery-ui-1.12.1/jquery-ui.js"></script>
    <script type="text/javascript">
        $(document).ready(function() {
          initiateDonation();
          var dialog1 = $( "#edit-donation-form" ).dialog({
              autoOpen: false,
              modal: true,
              resizable: false,
              width: 500,
              height: 230,
              buttons: {
                "OK" : {
                  text: "OK",
                  id: "saveEditDonation",
                  click: function(){}
                },
                "Cancel" : {
                  text: "Cancel",
                  click: function() {
                    dialog.dialog( "close" );
                  }
                }
              }                
            });

          $("#inputImage").change(function(e) {

              for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
                  
                  var file = e.originalEvent.srcElement.files[i];
                  
                  var img = document.createElement("img");
                  var reader = new FileReader();
                  reader.onloadend = function() {
                       img.src = reader.result;
                       $("#image").attr('src', img.src);
                  }
                  reader.readAsDataURL(file);
                  
              }
          });
        });           

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

        function initiateDonation() {          
          var content1 = "";
          var content2 = "";
          
            content1 += '<div class="row clearfix">'
                          + '<div class="col-md-12 column">'
                            + '<table class="table table-bordered table-hover" id="tab_logic">'
                              + '<tbody id="donation-body">'
                                + '<tr id="donation-row-1">'
                                  + '<td><input type="text" id="donation-item-1"  placeholder="Donation Item" class="form-control"/></td>'
                                  + '<td><input type="text" id="donation-number-1" placeholder="Number Required" class="form-control"/></td>'
                                  + '<td id="add-donation"><a id="add-donation-button" class="btn btn-default glyphicon glyphicon-plus" onclick="addOtherDonation(1)"></a></td>'
                                + '</tr>'
                                + '<tr id="donation-row-2"></tr>'
                              + '</tbody>'
                            + '</table>'
                          + '</div>'
                        + '</div>';
          
          document.getElementById("otherDonationContents").innerHTML = content1;
        }

        function addOtherDonation(i) {
          var content1 = 
            '<td id="donation-item-' + i + '">' + document.getElementById('donation-item-' + i).value + '</td>'
            + '<td id="donation-number-' + i + '">' + document.getElementById('donation-number-' + i).value + '</td>'
            + '<td><a id="edit-donation-row-' + i + '" class="btn btn-default glyphicon glyphicon-edit" onclick="editOtherDonation(' + i + ')"></a><a class="btn btn-default glyphicon glyphicon-remove" onclick="removeOtherDonation(' + i +')"></a></td>';
          document.getElementById("donation-row-" + i).innerHTML = content1;

          var content2 = 
            '<td><input type="text" id="donation-item-' + (i + 1) + '"  placeholder="Donation Item" class="form-control"/></td>'
            + '<td><input type="text" id="donation-number-' + (i + 1) + '" placeholder="Number Required" class="form-control"/></td>'
            + '<td id="add-donation"><a id="add-donation-button" class="btn btn-default glyphicon glyphicon-plus" onclick="addOtherDonation(' + (i + 1) + ')"></a></td>'
          document.getElementById("donation-row-" + (i + 1)).innerHTML = content2;

          var content3 = '<tr id="donation-row-' + (i + 2) + '"></tr>';
          document.getElementById("donation-body").innerHTML += content3;

          document.getElementById("txtNumberOfDonation").value = i;
        }

        function removeOtherDonation(i) {
          var element = document.getElementById("donation-row-" + i);
          element.outerHTML = '';
        }        

        function editOtherDonation(num) {
          $("#saveEditDonation").unbind( "click" );
          $("#saveEditDonation").click(function() {
            saveEditOtherDonation(num);
          });  
          $("#txtEditDonationItem")[0].value = $("#donation-item-" + num)[0].innerHTML;        
          $("#txtEditDonationNumber")[0].value = $("#donation-number-" + num)[0].innerHTML;
          
          //document.getElementById('cancelEditActivity').onclick = closeDialog;               
          $("#edit-donation-form").dialog( "open" );              
        }

        function saveEditOtherDonation(num) {
          $("#donation-item-" + num)[0].innerHTML = $("#txtEditDonationItem")[0].value;
          $("#donation-number-" + num)[0].innerHTML = $("#txtEditDonationNumber")[0].value;
          $( "#edit-donation-form" ).dialog("close");
        }

        function goNext() {
          var donateNo = parseInt(document.getElementById("txtNumberOfDonation").value);
          var otherDonationItem = [];
          var otherDonationNumber = [];
          for (var i = 0; i < donateNo; i++) {
            if(document.getElementById("donation-row-" + (i + 1)) != null) {
              otherDonationItem.push(document.getElementById("donation-item-" + (i + 1)).innerHTML);
              otherDonationNumber.push(document.getElementById("donation-number-" + (i + 1)).innerHTML);              
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
            volunteerMin: document.getElementById("txtVolunteersMin").value,
            volunteerMax: document.getElementById("txtVolunteersMax").value,
            budget: document.getElementById("txtBudget").value,
            donationNeeded: document.getElementById("txtDonation").value,
            otherDonationItem: otherDonationItem,
            otherDonationNumber: otherDonationNumber,
            imageSrc: document.getElementById('txtImageSrc').src
          };
          localStorage.setItem("eventItem", JSON.stringify(content));

          var retrievedObject = localStorage.getItem('eventItem');
          console.log('retrievedObject: ', JSON.parse(retrievedObject));

          window.location = "activity_creator.php";
        }

        function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#txtImageSrc')
                        .attr('src', e.target.result)
                        .height(150);
                };

                reader.readAsDataURL(input.files[0]);
            }
        }
    </script>    
  </head>

  <body class="nav-md">    
    <div class="container body">
      <div class="main_container">
        <div class="col-md-3 left_col menu_fixed ">
          <div class="left_col scroll-view">            
            <!-- sidebar menu -->
            <?php include "sidebar.html" ?>
            <!-- /sidebar menu -->

            <!-- /menu footer buttons -->
            <?php include "footer.html" ?>
            <!-- /menu footer buttons -->
          </div>
        </div>

        <!-- top navigation -->
        <?php include "topnav.html" ?>
        <!-- /top navigation -->

        <!-- page content -->
        <div class="right_col" role="main">
          <!-- top tiles -->
          <div class="row page-title">
            <div class="title" style="margin: 10px">
              <h1>Event Creator</h1>
            </div>
          </div>
          <br><br>
          <br>

          <div class="row">            
            <!-- Tabs -->
            <!-- Smart Wizard -->
            <form class="form-horizontal form-label-left">
              <h3 style="margin-left: 50px">Event Description</h3>
              <hr>
              <div class="form-group">
                <label class="control-label col-md-3 col-sm-3 col-xs-12">Event Name <span class="required">*</span></label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <input type="text" id="txtEventName" required="required" class="form-control col-md-7 col-xs-12">
                </div>
              </div>
              <div class="form-group">
                <label class="control-label col-md-3 col-sm-3 col-xs-12">Event Type <span class="required">*</span></label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <select id="txtEventType" class="form-control">
                    <option>== Choose ==</option>
                    <option>Type 1</option>
                    <option>Type 2</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="control-label col-md-3 col-sm-3 col-xs-12">Event Date <span class="required">*</span></label>
                  <div class="controls col-md-3 col-sm-3 col-xs-12">
                  <div class="control-group">
                    <div class="controls">
                      <div class="input-prepend input-group">
                        <span class="add-on input-group-addon"><i class="glyphicon glyphicon-calendar fa fa-calendar"></i></span>
                        <input type="text" style="width: 200px" name="reservation" id="reservation" class="form-control" value="" onchange="changeDate()" />
                        <input type="hidden" id="txtDate" value=""></input>
                      </div>
                    </div>
                    </div>
                  </div>
              </div>
              <div class="form-group">
                    <label class="control-label col-md-3 col-sm-3 col-xs-3">Meeting Time <span class="required">*</span></label>
                    <div class="col-md-6 col-sm-6 col-xs-12">
                      <input id="txtMeetingTime" type="text" class="form-control" data-inputmask="'mask': '99:99'" />
                    </div>
                  </div>
              <div class="form-group">
                <label class="control-label col-md-3 col-sm-3 col-xs-12">Meeting Address <span class="required">*</span>
                </label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <input id="txtMeetingAddress" class="form-control col-md-7 col-xs-12" placeholder="" type="text" autocomplete="on" runat="server" /> 
                  <input type="hidden" id="txtMeetingAddressLat" name="cityLat" />
                  <input type="hidden" id="txtMeetingAddressLng" name="cityLng" />                        
                  <div id="map" class="col-md-6 col-sm-6 col-xs-12" style="height:200px; margin-top: 20px"></div>
                </div>
              </div>
              <div class="form-group">
                <label class="control-label col-md-3 col-sm-3 col-xs-12">Contact Email <span class="required">*</span></label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <input type="text" id="txtEmail" required="required" class="form-control col-md-7 col-xs-12">
                </div>
              </div>
              <div class="form-group">
                <label class="control-label col-md-3 col-sm-3 col-xs-12">Contact Phone <span class="required">*</span></label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <input type="text" id="txtPhone" required="required" class="form-control col-md-7 col-xs-12">
                </div>
              </div>
              <div class="form-group">
                <label class="control-label col-md-3 col-sm-3 col-xs-12">Event Description <span class="required">*</span></label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <textarea id="txtDescription" class="resizable_textarea form-control" style="height: 100px"></textarea>
                </div>
              </div>
              <div class="form-group">
                <label class="control-label col-md-3 col-sm-3 col-xs-12">Event Image <span class="required">*</span><br>Must be smaller than 3.5Mb</label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <input id="txtImage" type="file" name="pic" accept="image/*" onchange="readURL(this);">
                  <img id="txtImageSrc" src="#" alt="your image" style="height: 150px" />
                </div>
              </div>              
              <br>

              <h3 style="margin-left: 50px">Event Requires</h3>
              <hr>
              <div class="form-group">
                <label class="control-label col-md-3 col-sm-3 col-xs-12">Volunteers <span class="required">*</span></label>
                <div class="col-md-3 col-sm-3 col-xs-12">
                  <input type="text" id="txtVolunteersMin" placeholder="Minimum" required="required" class="form-control col-md-7 col-xs-12">
                </div>
                <div class="col-md-3 col-sm-3 col-xs-12">
                  <input type="text" id="txtVolunteersMax" placeholder="Maximum" required="required" class="form-control col-md-7 col-xs-12">
                </div>
              </div>
              <div class="form-group">
                <label class="control-label col-md-3 col-sm-3 col-xs-12">Budget <span class="required">*</span></label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <input type="text" id="txtBudget" placeholder="For each volunteer" required="required" class="form-control col-md-7 col-xs-12">
                </div>
              </div>
              <div class="form-group">
                <label class="control-label col-md-3 col-sm-3 col-xs-12">Budget Donation Needed <span class="required">*</span></label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <input type="text" id="txtDonation" placeholder="VND only" required="required" class="form-control col-md-7 col-xs-12">
                </div>
              </div>
              <div id="other1" class="form-group">
                <label class="control-label col-md-3 col-sm-3 col-xs-12">Other Donations</label>
                <input id="txtNumberOfDonation" type="hidden" value="0"></input>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <div id="otherDonationContents" class="tab-content">
                    
                  </div>
                </div>
              </div>
 
              
              <hr>

              <div class="row">
                <div class="col-md-7 col-sm-7"></div>
                <div class="col-md-2 col-sm-2 col-xs-12">
                  <a class="btn btn-info col-xs-12" onclick="goNext()">Continue >></a>
                </div>
              </div>
            </form>
            <!-- End SmartWizard Content -->
              
              
          <!-- /top tiles -->
        </div>
        <!-- /page content -->

        <!-- footer content -->
        <footer>
          <div class="pull-right">
            Gentelella - Bootstrap Admin Template by <a href="https://colorlib.com">Colorlib</a>
          </div>
          <div class="clearfix"></div>
        </footer>
        <!-- /footer content -->
      </div>
    </div>
    
    <div id="edit-donation-form" title="Edit Donation">
      <p class="validateTips">All form fields are required.</p>
     
      <form>
        <fieldset>
        <div class="form-group">
          <label class="control-label col-md-6 col-sm-6 col-xs-12">Donation Item <span class="required">*</span></label>
          <div class="col-md-6 col-sm-6 col-xs-12">
            <input type="text" id="txtEditDonationItem" required="required" class="text ui-widget-content ui-corner-all form-control col-md-7 col-xs-12">
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-md-6 col-sm-6 col-xs-12">Number Required <span class="required">*</span></label>
          <div class="col-md-6 col-sm-6 col-xs-12">
            <input type="text" id="txtEditDonationNumber" required="required" class="text ui-widget-content ui-corner-all form-control col-md-7 col-xs-12">
          </div>
        </div>
        </fieldset>
      </form>
    </div>

    
    <!-- Bootstrap -->
    <script src="../vendors/bootstrap/dist/js/bootstrap.min.js"></script>
    <!-- FastClick -->
    <script src="../vendors/fastclick/lib/fastclick.js"></script>
    <!-- NProgress -->
    <script src="../vendors/nprogress/nprogress.js"></script>
    <!-- Chart.js -->
    <script src="../vendors/Chart.js/dist/Chart.min.js"></script>
    <!-- gauge.js -->
    <script src="../vendors/gauge.js/dist/gauge.min.js"></script>
    <!-- bootstrap-progressbar -->
    <script src="../vendors/bootstrap-progressbar/bootstrap-progressbar.min.js"></script>
    <!-- iCheck -->
    <script src="../vendors/iCheck/icheck.min.js"></script>
    <!-- Skycons -->
    <script src="../vendors/skycons/skycons.js"></script>
    <!-- Flot -->
    <script src="../vendors/Flot/jquery.flot.js"></script>
    <script src="../vendors/Flot/jquery.flot.pie.js"></script>
    <script src="../vendors/Flot/jquery.flot.time.js"></script>
    <script src="../vendors/Flot/jquery.flot.stack.js"></script>
    <script src="../vendors/Flot/jquery.flot.resize.js"></script>
    <!-- Flot plugins -->
    <script src="../vendors/flot.orderbars/js/jquery.flot.orderBars.js"></script>
    <script src="../vendors/flot-spline/js/jquery.flot.spline.min.js"></script>
    <script src="../vendors/flot.curvedlines/curvedLines.js"></script>
    <!-- DateJS -->
    <script src="../vendors/DateJS/build/date.js"></script>
    <!-- JQVMap -->
    <script src="../vendors/jqvmap/dist/jquery.vmap.js"></script>
    <script src="../vendors/jqvmap/dist/maps/jquery.vmap.world.js"></script>
    <script src="../vendors/jqvmap/examples/js/jquery.vmap.sampledata.js"></script>
    <!-- bootstrap-daterangepicker -->
    <script src="../vendors/moment/min/moment.min.js"></script>
    <script src="../vendors/bootstrap-daterangepicker/daterangepicker.js"></script>
    <!-- jquery.inputmask -->
    <script src="../vendors/jquery.inputmask/dist/min/jquery.inputmask.bundle.min.js"></script>    
    <!-- Custom Theme Scripts -->
    <script src="../build/js/custom.min.js"></script>
  
  </body>
</html>
