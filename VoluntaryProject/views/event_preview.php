<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Charity Project | Event Creator Review</title>

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
          var eventObj = JSON.parse(localStorage.getItem('eventItem'));
          var activityObj = JSON.parse(localStorage.getItem('activityItem'));
          $('#event-title')[0].innerHTML = eventObj.eventName;
          $('#event-type')[0].innerHTML = eventObj.eventType;
          $('#event-date')[0].innerHTML = eventObj.eventDate;
          $('#event-time')[0].innerHTML = eventObj.meetingTime;
          $('#event-place')[0].innerHTML = eventObj.meetingAddress;
          $('#event-description')[0].innerHTML = eventObj.eventDescription;
          $('#event-image')[0].src = eventObj.imageSrc;
          $('#event-donation')[0].innerHTML = eventObj.donationNeeded;
          for (var i = 0; i < eventObj.otherDonationItem.length; i++) {
            var content = '<label>' + eventObj.otherDonationItem[i] + ':</label><div class="progress"><span>0/' + eventObj.otherDonationNumber[i] + '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:70%"></div></div>';
            $('#event-donation-progress')[0].innerHTML += content;
          }
        });

          
    </script>    
    <style>
      .progress {
        color: white;
        text-align: center;
        background-color: gray;
        -webkit-box-shadow: none;
        box-shadow: none;
      }
    </style>
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
              <h1>Event Preview</h1>
            </div>
          </div>
          <br><br>
          <br>
          <h3 style="margin-left: 50px" id="event-title">EVENT NAME</h3>
          <hr>
          <div class="row">
            <div class="col-md-2 col-sm-2 col-xs-12"></div>
            <div class="col-md-2 col-sm-2 col-xs-12">
              <ul>
                <li>
                  <h4><b>Type:</b></h4>
                  <p id="event-type">None</p>
                </li>
                <li>
                  <h4><b>Time:</b></h4>
                  <p id="event-date">None</p>
                  <p id="event-time">None</p>
                </li>
                <li>
                  <h4><b>Place:</b></h4>
                  <p id="event-place">None</p>
                </li>                
              </ul>
            </div>
            <div class="col-md-1 col-sm-1 col-xs-12"></div>
            <div class="col-md-5 col-sm-5 col-xs-12">
              <img id="event-image" src="#" style="max-height: 300px; max-width: 500px">
            </div>
          </div>
          <hr>
          <div class="row">            
            <div class="col-md-2 col-sm-2 col-xs-12"></div>
            <div class="col-md-5 col-sm-5 col-xs-12" id="event-description">
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium quos aspernatur cupiditate commodi sunt illo, dolorum iste molestias. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium quos aspernatur cupiditate commodi sunt illo, dolorum iste molestias. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium quos aspernatur cupiditate commodi sunt illo, dolorum iste molestias.</p>

              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium quos aspernatur cupiditate commodi sunt illo, dolorum iste molestias. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium quos aspernatur cupiditate commodi sunt illo, dolorum iste molestias. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium quos aspernatur cupiditate commodi sunt illo, dolorum iste molestias.</p>

              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium quos aspernatur cupiditate commodi sunt illo, dolorum iste molestias. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium quos aspernatur cupiditate commodi sunt illo, dolorum iste molestias. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium quos aspernatur cupiditate commodi sunt illo, dolorum iste molestias.</p>
            </div>
            <div id="event-donation-progress" class="col-md-3 col-sm-3 col-xs-12 well" style="margin: 20px"> 
              <label>Donation:</label>
              <div class="progress">
                0/<span id="event-donation"></span>
                <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:70%"></div>
              </div>
            </div>
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
