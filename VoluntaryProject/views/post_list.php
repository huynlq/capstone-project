<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Charity Project | Post List</title>

    <!-- Bootstrap -->
    <link href="../vendors/bootstrap/dist/css/bootstrap.css" rel="stylesheet">
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
    <!-- jQuery -->
    <script src="../vendors/jquery/dist/jquery.min.js"></script>
    <!-- Custom Theme Style -->
    <link href="../build/css/custom.min.css" rel="stylesheet">
    <script>
      $(document).ready(function() {
          $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
              $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
          } );

          $('[data-toggle="tooltip"]').tooltip(); 
      } );
    </script>
    <style>
      li :hover {
        cursor: pointer;
      }

      .action-col {
        width:1%;
      }
    </style>
  </head>

  <body class="nav-md footer_fixed">
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
              <h1>Posts</h1>
            </div>
          </div>
          <br><br>

          
          <div class="container">
            <div class="row tile_count">
              <ul class="nav nav-tabs">
                <li class="active col-md-6 col-xs-12 "><a data-toggle="tab" class="count-tab" href="#news">
                  <div class="tileA">
                    <div class="tile_stats_count" style="padding-top: 10px;">
                      <span class="count_top"><i class="fa fa-newspaper-o"></i> Posts On News</span>
                      <div class="count">2</div>
                      <span class="count_bottom"><i class="green"><i class="fa fa-sort-asc"></i>50% </i> From last Week</span>
                    </div>
                  </div>
                </a></li>
                <li class="col-md-6 col-xs-12 "><a data-toggle="tab" class="count-tab" href="#board">
                  <div class="tileA">
                    <div class="tile_stats_count" style="padding-top: 10px;">
                      <span class="count_top"><i class="fa fa-tv"></i> Posts On Board</span>
                      <div class="count">2</div>
                      <span class="count_bottom"><i class="green"><i class="fa fa-sort-asc"></i>50% </i> From last Week</span>
                    </div>
                  </div>
                </a></li>
              </ul>         
            </div>

            <div class="tab-content">
              <div id="news" class="tab-pane fade in active">
                <div class="row">
                  <div class="col-md-12 col-sm-12 col-xs-12">
                      <div class="col-md-6">
                          <h3>News <small>(sub-title)</small></h3>
                      </div>
                          
                      <div class="clearfix"></div>
                  </div>
                  <div class="x_content">
          
                    <table id="tableNews" class="table table-striped table-bordered dt-responsive nowrap datatable-responsive" cellspacing="0" width="100%">
                      <thead>
                        <tr>
                          <th class="action-col">#</th>
                          <th class="action-col">Action</th>
                          <th>Title</th>
                          <th>Type</th>
                          <th>Author</th>
                          <th>Rating</th>
                          <th>Comments</th>
                          <th>Date Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style="margin:10px">1</td>
                          <td><center>
                            <a data-toggle="tooltip" title="Edit" class="btn btn-success btn-xs" href="#"><span class="glyphicon glyphicon-edit"></span></a>
                            <a data-toggle="tooltip" title="Delete" class="btn btn-danger btn-xs" href="#"><span class="glyphicon glyphicon-remove"></span></a>                            
                          </center></td>
                          <td>Report from Free Giveaway Events</td>
                          <td>Report</td>
                          <td>admin1</td>
                          <td>15</td>
                          <td>0</td>                          
                          <td>2/2/2017</td>
                        </tr>
                        <tr>
                          <td style="margin:10px">1</td>
                          <td><center>
                            <a data-toggle="tooltip" title="Edit" class="btn btn-success btn-xs" href="#"><span class="glyphicon glyphicon-edit"></span></a>
                            <a data-toggle="tooltip" title="Delete" class="btn btn-danger btn-xs" href="#"><span class="glyphicon glyphicon-remove"></span></a>                            
                          </center></td>
                          <td>Announcing Something Is Going On</td>
                          <td>Announce</td>
                          <td>admin1</td>
                          <td>120</td>
                          <td>10</td>                          
                          <td>30/1/2017</td>
                        </tr>                     
                      </tbody>
                    </table>
          
          
                  </div>
                </div>
                <div class="col-md-4 col-sm-4 col-xs-12">
                  <a class="btn btn-info btn-sm" href="post_creator.php"><span class="glyphicon glyphicon-edit"></span> New Post</a>
                </div>


              </div>
              <div id="board" class="tab-pane fade">
                <div class="row">
                  <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="col-md-6">
                        <h3>Board Posts <small>(sub-title)</small></h3>
                    </div>
                        
                    <div class="clearfix"></div>
                  </div>
                  <div class="x_content">
          
                    <table id="tableBoard" class="table table-striped table-bordered dt-responsive nowrap datatable-responsive" cellspacing="0" width="100%">
                      <thead>
                        <tr>
                        <th class="action-col">#</th>
                        <th class="action-col">Action</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Ratings</th>
                        <th>Comments</th>
                        <th>Date Created</th>
                      </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style="margin:10px">1</td>
                          <td><center>
                            <a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>
                            <a data-toggle="tooltip" title="Delete" class="btn btn-danger btn-xs" href="#"><span class="glyphicon glyphicon-remove"></span></a>                            
                          </center></td>
                          <td>New Post!</td>
                          <td>im_a_user</td>
                          <td>100</td>
                          <td>23</td>                          
                          <td>3/2/2017</td>
                        </tr>
                        <tr>
                          <td style="margin:10px">1</td>
                          <td><center>
                            <a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>
                            <a data-toggle="tooltip" title="Delete" class="btn btn-danger btn-xs" href="#"><span class="glyphicon glyphicon-remove"></span></a>                            
                          </center></td>
                          <td>Request for charity event</td>
                          <td>Requester</td>
                          <td>134</td>
                          <td>5</td>                          
                          <td>1/2/2017</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>             
          </div>

                                 
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
    </div>

    <!-- jQuery -->
    <script src="../vendors/jquery/dist/jquery.min.js"></script>
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
