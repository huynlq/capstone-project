<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Charity Project | User List</title>

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

      function editAdmin(that){
        var table = $('#tableAdmins').DataTable();
        var data = table.row( $(that).parents('tr') ).data();
        $('#txtAdminUser').val(data[2]);
        $('#txtAdminEmail').val(data[3]);
        $('#txtAdminRole').val(data[4]);
      }
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
              <h1>Users</h1>
            </div>
          </div>
          <br><br>

          
          <div class="container">
            <div class="row tile_count">
              <ul class="nav nav-tabs">
                <li class="active col-md-2 col-sm-4 col-xs-12 "><a data-toggle="tab" class="count-tab" href="#pendingUsers">
                  <div class="tileA">
                    <div class="tile_stats_count" style="padding-top: 10px;">
                      <span class="count_top"><i class="fa fa-thumbs-o-down"></i> Promotion Pending Users</span>
                      <div class="count">135</div>
                      <span class="count_bottom"><i class="green"><i class="fa fa-sort-desc"></i>12% </i> From last Week</span>
                    </div>
                  </div>
                </a></li>
                <li class="col-md-2 col-sm-4 col-xs-12 "><a data-toggle="tab" class="count-tab" href="#admins">
                  <div class="tileA">
                    <div class="tile_stats_count" style="padding-top: 10px;">
                      <span class="count_top"><i class="fa fa-child"></i> Total Admins</span>
                      <div class="count">5</div>
                      <span class="count_bottom"><i class="green"><i class="fa fa-sort-desc"></i>12% </i> From last Week</span>
                    </div>
                  </div>
                </a></li>
                <li class="col-md-2 col-sm-4 col-xs-12 "><a data-toggle="tab" class="count-tab" href="#users">
                  <div class="tileA">
                    <div class="tile_stats_count" style="padding-top: 10px;">
                      <span class="count_top"><i class="fa fa-bar-chart"></i> Total Users</span>
                      <div class="count">10000</div>
                      <span class="count_bottom"><i class="green">4% </i> From last Week</span>
                    </div>
                  </div>
                </a></li>
                <li class="col-md-2 col-sm-4 col-xs-12 "><a data-toggle="tab" class="count-tab" href="#producers">
                  <div class="tileA">
                    <div class="tile_stats_count" style="padding-top: 10px;">
                      <span class="count_top"><i class="fa fa-spinner fa-pulse"></i> Total Producers</span>
                      <div class="count">100</div>
                      <span class="count_bottom"><i class="green"><i class="fa fa-sort-asc"></i>34% </i> From last Week</span>
                    </div>
                  </div>
                </a></li>
                <li class="col-md-2 col-sm-4 col-xs-12 "><a data-toggle="tab" class="count-tab" href="#sponsors">
                  <div class="tileA">
                    <div class="tile_stats_count" style="padding-top: 10px;">
                      <span class="count_top"><i class="fa fa-thumbs-o-up"></i> Total Sponsors</span>
                      <div class="count">45</div>
                      <span class="count_bottom"><i class="green"><i class="fa fa-sort-asc"></i>34% </i> From last Week</span>
                    </div>
                  </div> 
                </a></li>
                <li class="col-md-2 col-sm-4 col-xs-12 "><a data-toggle="tab" class="count-tab" href="#banned">
                  <div class="tileA">
                    <div class="tile_stats_count" style="padding-top: 10px;">
                      <span class="count_top"><i class="fa fa-close"></i> Banned Users</span>
                      <div class="count red">1</div>
                      <span class="count_bottom"><i class="red"><i class="fa fa-sort-asc"></i>34% </i> From last Week</span>
                    </div>
                  </div>  
                </a></li>
              </ul>         
            </div>

            <div class="tab-content">
              <div id="pendingUsers" class="tab-pane fade in active">
                <div class="row">
                  <div class="col-md-12 col-sm-12 col-xs-12">
                      <div class="col-md-6">
                          <h3>Pending Users <small>(sub-title)</small></h3>
                      </div>
                          
                      <div class="clearfix"></div>
                  </div>
                  <div class="x_content">
          
                    <table id="tablePendingUsers" class="table table-striped table-bordered dt-responsive nowrap datatable-responsive" cellspacing="0" width="100%">
                      <thead>
                        <tr>
                          <th class="action-col">#</th>
                          <th class="action-col">Action</th>
                          <th>User</th>
                          <th>Full Name</th>
                          <th>Position Promotion</th>
                          <th>Company Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Address</th>
                          <th>Date Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style="margin:10px">1</td>
                          <td><center>
                            <a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>
                            <a data-toggle="tooltip" title="Approve" class="btn btn-success btn-xs" href="#"><span class="glyphicon glyphicon-ok"></span></a>
                            <a data-toggle="tooltip" title="Disapprove" class="btn btn-danger btn-xs" href="#"><span class="glyphicon glyphicon-remove"></span></a>                            
                          </center></td>                          
                          <td>JohnDoe</td>
                          <td>John Doe</td>
                          <td>Producer</td>
                          <td>The Doe Corps.</td>
                          <td>huynlqse61661@fpt.edu.vn</td>
                          <td>09195924629</td>                          
                          <td>Bitexco Tower, HCMC</td>
                          <td>2/2/2017</td>
                        </tr>
                        <tr>
                          <td style="margin:10px">2</td>
                          <td><center>
                            <a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>
                            <a data-toggle="tooltip" title="Approve" class="btn btn-success btn-xs" href="#"><span class="glyphicon glyphicon-ok"></span></a>
                            <a data-toggle="tooltip" title="Disapprove" class="btn btn-danger btn-xs" href="#"><span class="glyphicon glyphicon-remove"></span></a>                            
                          </center></td>                          
                          <td>KathyRain</td>
                          <td>Kathy Rain</td>
                          <td>Sponsor</td>
                          <td>KathyKathy Corps.</td>
                          <td>kathyrain@kathykathy.com</td>
                          <td>0914728491</td>                          
                          <td>Ben Thanh, HCMC</td>
                          <td>15/2/2017</td>
                        </tr>  
                        <tr>
                          <td style="margin:10px">3</td>
                          <td><center>
                            <a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>
                            <a data-toggle="tooltip" title="Approve" class="btn btn-success btn-xs" href="#"><span class="glyphicon glyphicon-ok"></span></a>
                            <a data-toggle="tooltip" title="Disapprove" class="btn btn-danger btn-xs" href="#"><span class="glyphicon glyphicon-remove"></span></a>                            
                          </center></td>                          
                          <td>SomeDude</td>
                          <td>Dude Troublesome</td>
                          <td>Admin</td>
                          <td></td>
                          <td>somedude@dude.com</td>
                          <td>0913492401</td>                          
                          <td>Nha Be, HCMC</td>
                          <td>19/2/2017</td>
                        </tr>                       
                      </tbody>
                    </table>
          
          
                  </div>
                </div>
              </div>
              <div id="admins" class="tab-pane fade">
                <div class="row">
                  <div class="col-md-8 col-sm-8 col-xs-12">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                      <div class="col-md-6">
                          <h3>Admins <small>(sub-title)</small></h3>
                      </div>
                          
                      <div class="clearfix"></div>
                    </div>
                    <div class="x_content">
            
                      <table id="tableAdmins" class="table table-striped table-bordered dt-responsive nowrap datatable-responsive" cellspacing="0" width="100%">
                        <thead>
                          <tr>
                            <th class="action-col">#</th>
                            <th class="action-col">Action</th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style="margin:10px">1</td>
                            <td><center>
                              <a data-toggle="tooltip" title="Edit" class="btn btn-info btn-xs" onclick="editAdmin(this)"><span class="glyphicon glyphicon-edit"></span></a>
                              <a data-toggle="tooltip" title="Remove" class="btn btn-danger btn-xs"><span class="glyphicon glyphicon-remove"></span></a> 
                            </center></td>                          
                            <td>admin</td>
                            <td>admin@charity.com</td>
                            <td>Administrator</td>
                          </tr>
                          <tr>
                            <td style="margin:10px">2</td>
                            <td><center>
                              <a data-toggle="tooltip" title="Edit" class="btn btn-info btn-xs" onclick="editAdmin(this)"><span class="glyphicon glyphicon-edit"></span></a>      
                              <a data-toggle="tooltip" title="Remove" class="btn btn-danger btn-xs"><span class="glyphicon glyphicon-remove"></span></a>                      
                            </center></td>                          
                            <td>JaneDoe</td>
                            <td>janedoe@charity.com</td>
                            <td>Editor</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="col-md-4 col-sm-4 col-xs-12" style="padding-left: 20px">
                    <form class="form-horizontal form-label-left">
                      <h3 style="margin-left: 50px">User Editor/Creator</h3>
                      <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">Username <span class="required">*</span></label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <input type="text" id="txtAdminUser" required="required" class="form-control col-md-7 col-xs-12">
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">Email <span class="required">*</span></label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <input type="text" id="txtAdminEmail" required="required" class="form-control col-md-7 col-xs-12">
                        </div>
                      </div>              
                      <div class="form-group">
                        <label class="control-label col-md-3 col-sm-3 col-xs-12">Role <span class="required">*</span></label>
                        <div class="col-md-9 col-sm-9 col-xs-12">
                          <select id="txtAdminRole" class="form-control">
                            <option>== Choose ==</option>
                            <option>Administrator</option>
                            <option>Editor</option>
                            <option>User Agent</option>
                          </select>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-5 col-sm-5"></div>
                        <div class="col-md-4 col-sm-4 col-xs-12">
                          <a class="btn btn-info col-xs-12">Create/Edit >></a>
                        </div>
                      </div>              
                    </form>
                  </div> 
                </div>
              </div>
              <div id="users" class="tab-pane fade">
                <div class="row">
                  <div class="col-md-12 col-sm-12 col-xs-12">
                      <div class="col-md-6">
                          <h3>Users <small>(sub-title)</small></h3>
                      </div>
                          
                      <div class="clearfix"></div>
                  </div>
                  <div class="x_content">
          
                    <table id="tableUsers" class="table table-striped table-bordered dt-responsive nowrap datatable-responsive" cellspacing="0" width="100%">
                      <thead>
                        <tr>
                          <th class="action-col">#</th>
                          <th class="action-col">Action</th>
                          <th>User</th>
                          <th>Full Name</th>                          
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Address</th>
                          <th>Date Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style="margin:10px">1</td>
                          <td><center>
                            <a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>
                            <a data-toggle="tooltip" title="Ban" class="btn btn-danger btn-xs" href="#"><span class="glyphicon glyphicon-remove"></span></a>                            
                          </center></td>                          
                          <td>GreatGrand</td>
                          <td>Grand Great</td>
                          <td>ggrand@gmail.com</td>
                          <td>0911234326</td>                          
                          <td>123 Tran Hung Dao, HCMC</td>
                          <td>1/2/2017</td>
                        </tr>                  
                      </tbody>
                    </table>
          
          
                  </div>
                </div>
              </div>
              <div id="producers" class="tab-pane fade">
                <div class="row">
                  <div class="col-md-12 col-sm-12 col-xs-12">
                      <div class="col-md-6">
                          <h3>Producers <small>(sub-title)</small></h3>
                      </div>
                          
                      <div class="clearfix"></div>
                  </div>
                  <div class="x_content">
          
                    <table id="tableProducers" class="table table-striped table-bordered dt-responsive nowrap datatable-responsive" cellspacing="0" width="100%">
                      <thead>
                        <tr>
                          <th class="action-col">#</th>
                          <th class="action-col">Action</th>
                          <th>User</th>
                          <th>Full Name</th>                     
                          <th>Company Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Address</th>
                          <th>Past Events</th>
                          <th>Upcoming Events</th>
                          <th>Date Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style="margin:10px">1</td>
                          <td><center>
                            <a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>
                            <a data-toggle="tooltip" title="Ban" class="btn btn-danger btn-xs" href="#"><span class="glyphicon glyphicon-remove"></span></a>                            
                          </center></td>                          
                          <td>BarbieLoli </td>
                          <td>Dolly Heath</td>
                          <td>Doll Corps.</td>
                          <td>dllhth@gmail.com</td>
                          <td>0909090909</td>                          
                          <td>65 Le Thai Tong, HCMC</td>
                          <td>1</td>
                          <td>2</td>
                          <td>14/1/2017</td>
                        </tr>                  
                      </tbody>
                    </table>
          
          
                  </div>
                </div>
              </div>
              <div id="sponsors" class="tab-pane fade">
                <div class="row">
                  <div class="col-md-12 col-sm-12 col-xs-12">
                      <div class="col-md-6">
                          <h3>Sponsors <small>(sub-title)</small></h3>
                      </div>
                          
                      <div class="clearfix"></div>
                  </div>
                  <div class="x_content">
          
                    <table id="tableSponsors" class="table table-striped table-bordered dt-responsive nowrap datatable-responsive" cellspacing="0" width="100%">
                      <thead>
                        <tr>
                          <th class="action-col">#</th>
                          <th class="action-col">Action</th>
                          <th>User</th>
                          <th>Full Name</th>                     
                          <th>Company Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Address</th>
                          <th>Events Donated</th>
                          <th>Donations</th>
                          <th>Date Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style="margin:10px">1</td>
                          <td><center>
                            <a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>
                            <a data-toggle="tooltip" title="Ban" class="btn btn-danger btn-xs" href="#"><span class="glyphicon glyphicon-remove"></span></a>                            
                          </center></td>                          
                          <td>HGates</td>
                          <td>Heather Gates</td>
                          <td>Silent Inc.</td>
                          <td>hgates@gmail.com</td>
                          <td>0916666666</td>                          
                          <td>12 No Trang Long, HCMC</td>
                          <td>3</td>
                          <td>15.000.000</td>
                          <td>14/1/2017</td>
                        </tr>                  
                      </tbody>
                    </table>
          
          
                  </div>
                </div>
              </div>
              <div id="banned" class="tab-pane fade">
                <div class="row">
                  <div class="col-md-12 col-sm-12 col-xs-12">
                      <div class="col-md-6">
                          <h3>Banned Users <small>(sub-title)</small></h3>
                      </div>
                          
                      <div class="clearfix"></div>
                  </div>
                  <div class="x_content">
          
                    <table id="tableBannedUsers" class="table table-striped table-bordered dt-responsive nowrap datatable-responsive" cellspacing="0" width="100%">
                      <thead>
                        <tr>
                          <th class="action-col">#</th>
                          <th class="action-col">Action</th>
                          <th>User</th>
                          <th>Full Name</th>                     
                          <th>Company Name</th>
                          <th>Position</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Address</th>
                          <th>Ban Reason</th>
                          <th>Date Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style="margin:10px">1</td>
                          <td><center>
                            <a data-toggle="tooltip" title="Details" class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>
                            <a data-toggle="tooltip" title="Unban" class="btn btn-success btn-xs" href="#"><span class="glyphicon glyphicon-ok"></span></a>                            
                          </center></td>                          
                          <td>Banned</td>
                          <td>Banned Guy</td>
                          <td>Banned Co.</td>
                          <td>Producer</td>
                          <td>bannedmail@gmail.com</td>
                          <td>091123412</td>                          
                          <td>12 Street, HCMC</td>
                          <td>Spamming</td>
                          <td>1/1/2017</td>
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
