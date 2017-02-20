<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Charity Project | Event Activities Creator</title>

    <!-- Bootstrap -->
    <link href="../vendors/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="../vendors/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <!-- NProgress -->
    <link href="../vendors/nprogress/nprogress.css" rel="stylesheet">
    <!-- iCheck -->
    <link href="../vendors/iCheck/skins/flat/green.css" rel="stylesheet">
    <!-- Datatables -->
    <link href="../vendors/datatables.net-bs/css/dataTables.bootstrap.min.css" rel="stylesheet">
    <link href="../vendors/datatables.net-buttons-bs/css/buttons.bootstrap.min.css" rel="stylesheet">
    <link href="../vendors/datatables.net-fixedheader-bs/css/fixedHeader.bootstrap.min.css" rel="stylesheet">
    <link href="../vendors/datatables.net-responsive-bs/css/responsive.bootstrap.min.css" rel="stylesheet">
    <link href="../vendors/datatables.net-scroller-bs/css/scroller.bootstrap.min.css" rel="stylesheet">
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
          initiateSchedule();
          var diffDays = document.getElementById("txtNumberOfDates").value;
          var table;
          for (var i = 1; i <= diffDays; i++) {
              console.log(i);
              table = $('#table-day-' + i).DataTable({
                "responsive": true,
                "aaSorting": [[0,'asc']],
                "aoColumnDefs": [
                  { 'bSortable': false, 'aTargets': [ 1, 2, 3, 4 ] }
               ]
              });

              console.log("SUCCESS");
              $('#table-day-' + i + ' .edit-button').click(function () {
                  var data = $('#table-day-' + i).DataTable().row( $(this).parents('tr') ).data();
                  console.log("data");
                  alert( data );
              });
              
          }

          var dialog = $( "#edit-activity-form" ).dialog({
              autoOpen: false,
              modal: true,
              resizable: false,
              width: 500,
              height: 300,
              buttons: {
                "OK" : {
                  text: "OK",
                  id: "saveEditActivity",
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

        });             

        function remove(day) {

                 
          
        }

        function editActivity(day, num) {
          $( "#saveEditActivity").unbind( "click" );
          $("#saveEditActivity").click(function() {
            saveEditActivity(day, num);
          });  
          $("#txtEditActivityTime")[0].value = $("#txtDay" + day + "-Time" + num)[0].innerHTML;
          
          $("#txtEditActivityPlace")[0].value = $("#txtDay" + day + "-Place" + num)[0].innerHTML;
          $("#txtEditActivityActivity")[0].value = $("#txtDay" + day + "-Activity" + num)[0].innerHTML;
          $("#txtEditActivityBudget")[0].value = $("#txtDay" + day + "-EstBudget" + num)[0].innerHTML;
          
          //document.getElementById('cancelEditActivity').onclick = closeDialog;               
          $("#edit-activity-form").dialog( "open" );              
        }

        function closeDialog(){
          $( "#edit-activity-form" ).dialog( "close" )
        }

        function saveEditActivity(data, that) {
          $('#table-day-' + day).DataTable().row(that).data(data);

          $("#txtDay" + day + "-Time" + num)[0].innerHTML = $("#txtEditActivityTime")[0].value;
          console.log("Parameter: " + "#txtDay" + day + "-Time" + num);
          console.log("Value: " + $("#txtDay" + day + "-Time" + num)[0].innerHTML);
          $("#txtDay" + day + "-Place" + num)[0].innerHTML = $("#txtEditActivityPlace")[0].value;
          $("#txtDay" + day + "-Activity" + num)[0].innerHTML = $("#txtEditActivityActivity")[0].value;
          $("#txtDay" + day + "-EstBudget" + num)[0].innerHTML = $("#txtEditActivityBudget")[0].value;
          $( "#edit-activity-form" ).dialog("close");
        }

        function initiateSchedule() {
          var retrievedObject = JSON.parse(localStorage.getItem('eventItem'));
          var date = retrievedObject.eventDate;
          var dates = date.split(" - ");
          var date1 = new Date(dates[0]);
          var date2 = new Date(dates[1]);
          var timeDiff = Math.abs(date2.getTime() - date1.getTime());
          var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; 
          document.getElementById("txtNumberOfDates").value = diffDays;
          var content1 = "";
          var content2 = "";
          for (var i = 1; i <= diffDays; i++) {
            content1 += '<li><a data-toggle="tab" href="#day' + i + '">Day ' + i + '</a></li>';
            content2 += '<div id="day' + i + '" class="tab-pane fade"><h3>Day ' + i + '</h3><p>'
                        + '<div class="row clearfix">'
                          + '<div class="col-md-12 column">'
                            + '<table id="table-day-' + i + '" class="table table-bordered table-hover dt-responsive">'
                              + '<thead>'
                                + '<tr >'
                                  + '<th class="text-center">Time</th>'
                                  + '<th class="text-center">Place</th>'
                                  + '<th class="text-center">Activity</th>'
                                  + '<th class="text-center">Estimated Budget</th>'
                                  + '<th class="text-center">Action</th>'
                                + '</tr>'
                              + '</thead>'
                              + '<tbody id="body-day' + i + '">'  
                              + '</tbody>'  
                              + '<tfoot id="body-add-day' + i + '">'    
                              + '<tr id="addr' + i + '">'
                                  + '<td><input type="text" id="txtDay' + i + '-AddTime"  placeholder="Time" class="form-control"/></td>'
                                  + '<td><input type="text" id="txtDay' + i + '-AddPlace" placeholder="Place" class="form-control"/></td>'
                                  + '<td><input type="text" id="txtDay' + i + '-AddActivity" placeholder="Activity" class="form-control"/></td>'
                                  + '<td><input type="text" id="txtDay' + i + '-AddEstBudget" placeholder="Estimated Budget" class="form-control"/></td>'
                                  + '<td id="day' + i + '_addActivity"><a id="add_row' + i + '" class="btn btn-default glyphicon glyphicon-plus" onclick="addActivity(' + i + ')"></a></td>'
                                + '</tr>'                          
                              + '</tfoot>'
                            + '</table>'
                            
                          + '</div>'
                        + '</div>'
                        // + '<div id="day' + i + '_addActivity"><a id="add_row' + i + '" class="btn btn-default pull-left" onclick="addActivity(' + i + '), 2">Add Row</a></div>'
                        + '</p></div>';
          }
          document.getElementById("activityDates").innerHTML = content1;
          document.getElementById("activityContents").innerHTML = content2;
        }

        
        function editActivity2(day, that) {
          var table = $('#table-day-' + day).DataTable();
          var data = $('#table-day-' + day).DataTable().row( $(that).parents('tr') ).data();
          console.log("Before: " + data);
          $("#saveEditActivity").unbind( "click" );
          $("#saveEditActivity").click(function() {
            var dataObj = {
              "0": $("#txtEditActivityTime")[0].value,
              "1": $("#txtEditActivityPlace")[0].value,
              "2": $("#txtEditActivityActivity")[0].value,
              "3": $("#txtEditActivityBudget")[0].value,
              "4": data[4]
            }
            data[0] = $("#txtEditActivityTime")[0].value;
            data[1] = $("#txtEditActivityPlace")[0].value;
            data[2] = $("#txtEditActivityActivity")[0].value;
            data[3] = $("#txtEditActivityBudget")[0].value;
            console.log("Modified Data: " + dataObj);
            $('#table-day-' + day).DataTable().row($(that).parents('tr')).data(dataObj);
            console.log("Closing");
            $("#edit-activity-form").dialog( "close" );            
          });  
          $("#txtEditActivityTime")[0].value = data[0];          
          $("#txtEditActivityPlace  ")[0].value = data[1];
          $("#txtEditActivityActivity")[0].value = data[2];
          $("#txtEditActivityBudget")[0].value = data[3];
          
          //document.getElementById('cancelEditActivity').onclick = closeDialog;               
          $("#edit-activity-form").dialog( "open" );
        }
        

        function addActivity(day) {
          var day1 = '<a id="edit_day' + day + '" class="btn btn-default glyphicon glyphicon-edit edit-button" onclick="editActivity2(' + day + ', this)"></a><a id="remove-day-' + day + '" class="btn btn-default glyphicon glyphicon-remove remove-button" onclick="var row = $(this).closest(\'tr\');var nRow = row[0];$(\'#table-day-' + day + '\').dataTable().fnDeleteRow(nRow);"></a>';
          var addedRow = $('#table-day-' + day).DataTable().row.add( [
            document.getElementById("txtDay" + day + "-AddTime").value,
            document.getElementById("txtDay" + day + "-AddPlace").value,
            document.getElementById("txtDay" + day + "-AddActivity").value,
            document.getElementById("txtDay" + day + "-AddEstBudget").value,
            day1
        ] ).draw( false );

          console.log(addedRow);


          // if(document.getElementsByClassName("dataTables_empty").length != 0){
          //   document.getElementById("body-day" + day).innerHTML = "";
          // }
          
          // var time =      document.getElementById("txtDay" + day + "-Time" + (num - 1)).value;
          // var place =     document.getElementById("txtDay" + day + "-Place" + (num - 1)).value;
          // var activity =  document.getElementById("txtDay" + day + "-Activity" + (num - 1)).value;
          // var budget =    document.getElementById("txtDay" + day + "-EstBudget" + (num - 1)).value;
          // //document.getElementById("addr" + day + "-" + (num -1)).innerHTML = 
          // document.getElementById("body-day" + day).innerHTML +=
          //   '<td id="txtDay' + day + '-Time' + (num - 1) + '">' + time + '</td>' +
          //   '<td id="txtDay' + day + '-Place' + (num - 1) + '">' + place + '</td>' +
          //   '<td id="txtDay' + day + '-Activity' + (num - 1) + '">' + activity + '</td>' +
          //   '<td id="txtDay' + day + '-EstBudget' + (num - 1) + '">' + budget + '</td>' +
          //   '<td><a id="edit_day' + day + '_row' + (num - 1) + '" class="btn btn-default glyphicon glyphicon-edit" onclick="editActivity(' + day + ', ' + (num - 1) + ')"></a><a class="btn btn-default glyphicon glyphicon-remove" onclick="removeActivity(' + day + ', ' + (num - 1) +')"></a></td>';
          // document.getElementById("addr" + day + "-" + num).innerHTML = 
          //   '<td><input type="text" id="txtDay' + day + '-Time' + num + '"  placeholder="Time" class="form-control"/></td>' +
          //   '<td><input type="text" id="txtDay' + day + '-Place' + num + '" placeholder="Place" class="form-control"/></td>' +
          //   '<td><input type="text" id="txtDay' + day + '-Activity' + num + '" placeholder="Activity" class="form-control"/></td>' +
          //   '<td><input type="text" id="txtDay' + day + '-EstBudget' + num + '" placeholder="Estimated Budget" class="form-control"/></td>' +
          //   '<td id="day' + day + '_addActivity"><a id="add_row' + day + '" class="btn btn-default glyphicon glyphicon-plus" onclick="addActivity(' + day + ', ' + (num + 1) + ')"></a></td>';
          
          //document.getElementById("body-day" + day).innerHTML += 
          document.getElementById("body-add-day" + day).innerHTML = 
            '<tr id="addr' + day + '">' + 
            '<td><input type="text" id="txtDay' + day + '-AddTime"  placeholder="Time" class="form-control"/></td>' +
            '<td><input type="text" id="txtDay' + day + '-AddPlace" placeholder="Place" class="form-control"/></td>' +
            '<td><input type="text" id="txtDay' + day + '-AddActivity" placeholder="Activity" class="form-control"/></td>' +
            '<td><input type="text" id="txtDay' + day + '-AddEstBudget" placeholder="Estimated Budget" class="form-control"/></td>' +
            '<td id="day' + day + '_addActivity"><a id="add_row' + day + '" class="btn btn-default glyphicon glyphicon-plus" onclick="addActivity(' + day + ')"></a></td>' +
            '</tr>';
        }

        function removeActivity(day, num) {
          var element = document.getElementById('addr' + day + '-' + num);
          element.outerHTML = '';
        }

        function goNext() {
          var schedule = [];
          var activity = new Object();
          var diffDays = document.getElementById("txtNumberOfDates").value;
          for (var i = 1; i <= diffDays; i++) {
            var oTable = $('#table-day-' + i).dataTable();
            oTable.fnGetData();
            for (var j = 0; j < oTable.fnGetData().length; j++) {
              activity = {
                time:       oTable.fnGetData()[j][0],
                place:      oTable.fnGetData()[j][1],
                activity:   oTable.fnGetData()[j][2],
                estBudget:  oTable.fnGetData()[j][3]
              }
              schedule.push(activity);
            }
            if(i != diffDays)
              schedule.push("---NEXT---");
          }

          localStorage.setItem("activityItem", JSON.stringify(schedule));          

          window.location = "event_preview.php";
        }  
    </script>    
  </head>

  <body class="nav-md">    
    <div class="container body">
      <div class="main_container">
        <div class="col-md-3 left_col menu_fixed ">
          <div class="left_col scroll-view">
            <div class="navbar nav_title" style="border: 0;">
              <a href="index.html" class="site_title"><i class="fa fa-paw"></i> <span>Gentelella Alela!</span></a>
            </div>

            <div class="clearfix"></div>

            <!-- menu profile quick info -->
            <div class="profile clearfix">
              <div class="profile_pic">
                <img src="images/img.jpg" alt="..." class="img-circle profile_img">
              </div>
              <div class="profile_info">
                <span>Welcome,</span>
                <h2>John Doe</h2>
              </div>
            </div>
            <!-- /menu profile quick info -->

            <br />

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
              <h1>Event Activities Creator</h1>
            </div>
          </div>
          <br><br>
          <br>

          <div class="row">            
            <!-- Tabs -->
            <!-- Smart Wizard -->
            <form class="form-horizontal form-label-left">
              <h3 style="margin-left: 50px">Event Activities</h3>
              <hr>
              <input id="txtNumberOfDates" type="hidden" value="0">
              <div class="col-md-2 col-sm-2 col-xs-12"></div>
              <div class="col-md-8 col-sm-8 col-xs-12">
                <ul id="activityDates" class="nav nav-tabs">
                  
                </ul>

                <div id="activityContents" class="tab-content">
                  
                </div>
              </div>
              <div class="col-md-3 col-sm-3 col-xs-12"></div>              
            </form>
            <hr>
              <div class="row">
                <div class="col-md-7 col-sm-7"></div>
                <div class="col-md-2 col-sm-2 col-xs-12">
                  <a class="btn btn-info col-xs-12" onclick="goNext()">Continue >></a>
                </div>
              </div>
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

    <div id="edit-activity-form" title="Edit Activity">
      <p class="validateTips">All form fields are required.</p>
     
      <form>
        <fieldset>
        <div class="form-group">
          <label class="control-label col-md-6 col-sm-6 col-xs-12">Time <span class="required">*</span></label>
          <div class="col-md-6 col-sm-6 col-xs-12">
            <input type="text" id="txtEditActivityTime" required="required" class="text ui-widget-content ui-corner-all form-control col-md-7 col-xs-12">
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-md-6 col-sm-6 col-xs-12">Place <span class="required">*</span></label>
          <div class="col-md-6 col-sm-6 col-xs-12">
            <input type="text" id="txtEditActivityPlace" required="required" class="text ui-widget-content ui-corner-all form-control col-md-7 col-xs-12">
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-md-6 col-sm-6 col-xs-12">Activity <span class="required">*</span></label>
          <div class="col-md-6 col-sm-6 col-xs-12">
            <input type="text" id="txtEditActivityActivity" required="required" class="text ui-widget-content ui-corner-all form-control col-md-7 col-xs-12">
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-md-6 col-sm-6 col-xs-12">Estimated Budget <span class="required">*</span></label>
          <div class="col-md-6 col-sm-6 col-xs-12">
            <input type="text" id="txtEditActivityBudget" required="required" class="text ui-widget-content ui-corner-all form-control col-md-7 col-xs-12">
          </div>
        </div>
        <!-- <br>
        <div class="form-group" style="margin-top: 20px">
          <a id="saveEditActivity" class="btn btn-info glyphicon glyphicon-ok col-md-3 col-sm-3 col-xs-5"></a><a id="cancelEditActivity" class="btn btn-info glyphicon glyphicon-remove col-md-3 col-sm-3 col-xs-5"></a>
        </div> -->
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
    <!-- Datatables -->
    <script src="../vendors/datatables.net/js/jquery.dataTables.min.js"></script>
    <script src="../vendors/datatables.net-bs/js/dataTables.bootstrap.min.js"></script>
    <script src="../vendors/datatables.net-buttons/js/dataTables.buttons.min.js"></script>
    <script src="../vendors/datatables.net-buttons-bs/js/buttons.bootstrap.min.js"></script>
    <script src="../vendors/datatables.net-buttons/js/buttons.flash.min.js"></script>
    <script src="../vendors/datatables.net-buttons/js/buttons.html5.min.js"></script>
    <script src="../vendors/datatables.net-buttons/js/buttons.print.min.js"></script>
    <script src="../vendors/datatables.net-fixedheader/js/dataTables.fixedHeader.min.js"></script>
    <script src="../vendors/datatables.net-keytable/js/dataTables.keyTable.min.js"></script>
    <script src="../vendors/datatables.net-responsive/js/dataTables.responsive.min.js"></script>
    <script src="../vendors/datatables.net-responsive-bs/js/responsive.bootstrap.js"></script>
    <script src="../vendors/datatables.net-scroller/js/dataTables.scroller.min.js"></script>
    <script src="../vendors/jszip/dist/jszip.min.js"></script>
    <script src="../vendors/pdfmake/build/pdfmake.min.js"></script>
    <script src="../vendors/pdfmake/build/vfs_fonts.js"></script>
    <!-- Custom Theme Scripts -->
    <script src="../build/js/custom.min.js"></script>
  
  </body>
</html>
