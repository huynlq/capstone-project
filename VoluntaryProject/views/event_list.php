<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Charity Project | Event List</title>

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
    <!-- Custom Theme Style -->
    <link href="../build/css/custom.min.css" rel="stylesheet">
    <script>
      $(document).ready(function() {
          $('[data-toggle="tooltip"]').tooltip(); 
      } );
    </script>

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
              <h1>Events</h1>
            </div>
          </div>
          <br><br>
          <div class="container">
            <div class="row tile_count">
              <ul class="nav nav-tabs">
                <li class="active col-md-2 col-sm-4 col-xs-12 "><a data-toggle="tab" class="count-tab" href="#pendingEvents">
                  <div class="tileA">          
                    <div class="tile_stats_count">
                      <span class="count_top"><i class="fa fa-spinner fa-pulse"></i> Pending Events</span>
                      <div class="count">4</div>
                      <span class="count_bottom"><i class="green"><i class="fa fa-sort-asc"></i>3% </i> From last Week</span>
                    </div>
                  </div>
                </a></li>
                <li class="col-md-2 col-sm-4 col-xs-12 "><a data-toggle="tab" class="count-tab" href="#events">
                  <div class="tileA">
                    <div class="tile_stats_count">
                      <span class="count_top"><i class="fa fa-bar-chart"></i> Total Events</span>
                      <div class="count">7</div>
                      <span class="count_bottom"><i class="green">4% </i> From last Week</span>                    
                    </div>
                  </div>
                </a></li>
                <li class="col-md-2 col-sm-4 col-xs-12 "><a data-toggle="tab" class="count-tab" href="#approvedEvents">
                  <div class="tileA">
                    <div class="tile_stats_count">
                      <span class="count_top"><i class="fa fa-thumbs-o-up"></i> Approved Events</span>
                      <div class="count green">1</div>
                      <span class="count_bottom"><i class="green"><i class="fa fa-sort-asc"></i>34% </i> From last Week</span>
                    </div>
                  </div>
                </a></li>
                <li class="col-md-2 col-sm-4 col-xs-12 "><a data-toggle="tab" class="count-tab" href="#disapprovedEvents">
                  <div class="tileA">
                    <div class="tile_stats_count">
                      <span class="count_top"><i class="fa fa-thumbs-o-down"></i> Disapproved Events</span>
                      <div class="count red">1</div>
                      <span class="count_bottom"><i class="red"><i class="fa fa-sort-desc"></i>12% </i> From last Week</span>
                    </div>
                  </div>
                </a></li>
                <li class="col-md-2 col-sm-4 col-xs-12 "><a data-toggle="tab" class="count-tab" href="#cancelledEvents">
                  <div class="tileA">
                    <div class="tile_stats_count">
                      <span class="count_top"><i class="fa fa-close"></i> Cancelled Events</span>
                      <div class="count">1</div>
                      <span class="count_bottom"><i class="green"><i class="fa fa-sort-asc"></i>34% </i> From last Week</span>
                    </div>
                  </div>
                </a></li>
                <li class="col-md-2 col-sm-4 col-xs-12 "><a data-toggle="tab" class="count-tab" href="#producers">
                  <div class="tileA">
                    <div class="tile_stats_count">
                      <span class="count_top"><i class="fa fa-child"></i> Number of Producers</span>
                      <div class="count">100</div>
                      <span class="count_bottom"><i class="green"><i class="fa fa-sort-asc"></i>34% </i> From last Week</span>
                    </div>
                  </div>
                </a></li>
              </ul>
            </div>
          </div>

          <div class="tab-content">
            <div id="pendingEvents" class="tab-pane fade in active">
              <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="col-md-6">
                        <h3>Pending events <small>(sub-title)</small></h3>
                    </div>
                        
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
        
                  <table id="tablePendingEvents" class="table table-striped table-bordered dt-responsive nowrap datatable-responsive" cellspacing="0" width="100%">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Action</th>                        
                        <th>Event</th>
                        <th>Type</th>
                        <th>User</th>
                        <th>Full Name</th>
                        <th>Company Name</th>
                        <th>Email</th>
                        <th>Phone</th>                          
                        <th>Start Date</th>
                        <th>Location</th>
                        <th>Budget</th>
                        <th>Create Date</th>
                        <th>Pending For</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style="margin:10px">1</td>
                        <td><center>
                          <a data-toggle="tooltip" title="Details"  class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>
                          <a data-toggle="tooltip" title="Approve" class="btn btn-success btn-xs" href="#"><span class="glyphicon glyphicon-ok"></span></a>
                          <a data-toggle="tooltip" title="Disapprove" class="btn btn-danger btn-xs" href="#"><span class="glyphicon glyphicon-remove"></span></a>                            
                        </center></td>                          
                        <td>Charity Hospital</td>
                        <td>Voluntary</td>
                        <td>HuyNLQ</td>
                        <td>NLQH</td>
                        <td>numbuh1 Co.</td>
                        <td>huynlqse61661@fpt.edu.vn</td>
                        <td>09195924629</td>                          
                        <td>12/3/2017</td>
                        <td>Nhi Đông Hospital, HCMC</td>
                        <td>30.000.000</td>
                        <td>2/2/2017</td>
                        <td>Publish</td>
                      </tr>
                      <tr>
                        <td style="margin:10px">2</td>
                        <td><center>
                          <a data-toggle="tooltip" title="Details"  class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>
                          <a data-toggle="tooltip" title="Approve" class="btn btn-success btn-xs" href="#"><span class="glyphicon glyphicon-ok"></span></a>
                          <a data-toggle="tooltip" title="Disapprove" class="btn btn-danger btn-xs" href="#"><span class="glyphicon glyphicon-remove"></span></a>                            
                        </center></td>                          
                        <td>Free Library</td>
                        <td>Voluntary</td>
                        <td>PhatLN</td>
                        <td>LNH Phát</td>
                        <td>EndFast Co.</td>
                        <td>phatln@gmail.com</td>
                        <td>0912345678</td>                          
                        <td>14/1/2017</td>
                        <td>City Library</td>
                        <td>10.000.000</td>
                        <td>3/2/2017</td>
                        <td>Report</td>
                      </tr> 
                      <tr>
                        <td style="margin:10px">3</td>
                        <td><center>
                          <a data-toggle="tooltip" title="Details"  class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>
                          <a data-toggle="tooltip" title="Approve" class="btn btn-success btn-xs" href="#"><span class="glyphicon glyphicon-ok"></span></a>
                          <a data-toggle="tooltip" title="Disapprove" class="btn btn-danger btn-xs" href="#"><span class="glyphicon glyphicon-remove"></span></a>                            
                        </center></td>                          
                        <td>Free Giveaway</td>
                        <td>Giveaway</td>
                        <td>Tobias123</td>
                        <td>Toby Lee</td>
                        <td>TL Co.</td>
                        <td>tby@gmail.com</td>
                        <td>01213425829</td>                          
                        <td>12/3/2017</td>
                        <td>Con Dao Island</td>
                        <td>0</td>
                        <td>4/2/2017</td>
                        <td>Edit</td>
                      </tr> 
                      <tr>
                        <td style="margin:10px">4</td>
                        <td><center>
                          <a data-toggle="tooltip" title="Details"  class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>
                          <a data-toggle="tooltip" title="Approve" class="btn btn-success btn-xs" href="#"><span class="glyphicon glyphicon-ok"></span></a>
                          <a data-toggle="tooltip" title="Disapprove" class="btn btn-danger btn-xs" href="#"><span class="glyphicon glyphicon-remove"></span></a>                            
                        </center></td>                          
                        <td>Charity Something</td>
                        <td>Charity</td>
                        <td>SomeDude</td>
                        <td>Dude Guy</td>
                        <td>DudeDude Co.</td>
                        <td>sdude@gmail.com</td>
                        <td>0121234215</td>                          
                        <td>12/3/2017</td>
                        <td>Ben Thanh</td>
                        <td>20.000.000</td>
                        <td>4/2/2017</td>
                        <td>Cancel</td>
                      </tr>                             
                    </tbody>
                  </table>
        
        
                </div>
              </div>
            </div>

            <div id="events" class="tab-pane fade">
              <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="col-md-6">
                        <h3>All events <small>(sub-title)</small></h3>
                    </div>
                        
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
        
                  <table id="tableEvents" class="table table-striped table-bordered dt-responsive nowrap datatable-responsive" cellspacing="0" width="100%">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Action</th>                        
                        <th>Event</th>
                        <th>Status</th>
                        <th>Type</th>
                        <th>User</th>
                        <th>Full Name</th>
                        <th>Company Name</th>
                        <th>Email</th>
                        <th>Phone</th>                          
                        <th>Start Date</th>
                        <th>Location</th>
                        <th>Budget</th>
                        <th>Create Date</th>                        
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style="margin:10px">1</td>
                        <td><center>
                          <a data-toggle="tooltip" title="Details"  class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>                            
                        </center></td>                          
                        <td>An Approved Event</td>
                        <td>Approved</td>
                        <td>Charity</td>
                        <td>approve123</td>
                        <td>Guy Approve</td>
                        <td>Approval Co.</td>
                        <td>aaaaa@gmail.com</td>
                        <td>0124325621</td>
                        <td>12/4/2017</td>
                        <td>Place</td>
                        <td>2.000.000</td>
                        <td>1/2/2017</td> 
                      </tr>
                      <tr>
                        <td style="margin:10px">2</td>
                        <td><center>
                          <a data-toggle="tooltip" title="Details"  class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>
                        </center></td>                          
                        <td>Charity Hospital</td>
                        <td>Pending for publish</td>
                        <td>Voluntary</td>
                        <td>HuyNLQ</td>
                        <td>NLQH</td>
                        <td>numbuh1 Co.</td>
                        <td>huynlqse61661@fpt.edu.vn</td>
                        <td>09195924629</td>                          
                        <td>12/3/2017</td>
                        <td>Nhi Đông Hospital, HCMC</td>
                        <td>30.000.000</td>
                        <td>2/2/2017</td>                        
                      </tr>
                      <tr>
                        <td style="margin:10px">3</td>
                        <td><center>
                          <a data-toggle="tooltip" title="Details"  class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>                            
                        </center></td>                          
                        <td>Free Library</td>
                        <td>Rending for report</td>
                        <td>Voluntary</td>
                        <td>PhatLN</td>
                        <td>LNH Phát</td>
                        <td>EndFast Co.</td>
                        <td>phatln@gmail.com</td>
                        <td>0912345678</td>                          
                        <td>14/1/2017</td>
                        <td>City Library</td>
                        <td>10.000.000</td>
                        <td>3/2/2017</td>                        
                      </tr> 
                      <tr>
                        <td style="margin:10px">4</td>
                        <td><center>
                          <a data-toggle="tooltip" title="Details"  class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>                            
                        </center></td>                          
                        <td>Free Giveaway</td>
                        <td>Pending for edit</td>                        
                        <td>Giveaway</td>
                        <td>Tobias123</td>
                        <td>Toby Lee</td>
                        <td>TL Co.</td>
                        <td>tby@gmail.com</td>
                        <td>01213425829</td>                          
                        <td>12/3/2017</td>
                        <td>Con Dao Island</td>
                        <td>0</td>
                        <td>4/2/2017</td>
                      </tr> 
                      <tr>
                        <td style="margin:10px">5</td>
                        <td><center>
                          <a data-toggle="tooltip" title="Details"  class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>                            
                        </center></td>                          
                        <td>Charity Something</td>
                        <td>Pending for cancel</td>
                        <td>Charity</td>
                        <td>SomeDude</td>
                        <td>Dude Guy</td>
                        <td>DudeDude Co.</td>
                        <td>sdude@gmail.com</td>
                        <td>0121234215</td>                          
                        <td>12/3/2017</td>
                        <td>Ben Thanh</td>
                        <td>20.000.000</td>
                        <td>4/2/2017</td>
                      </tr>   
                      <tr>
                        <td style="margin:10px">6</td>
                        <td><center>
                          <a data-toggle="tooltip" title="Details"  class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>                            
                        </center></td>                          
                        <td>An Disapproved Event</td>
                        <td>Disapproved</td>
                        <td>Charity</td>
                        <td>disapprove123</td>
                        <td>Guy Disapprove</td>
                        <td>Disapproval Co.</td>
                        <td>bbbbb@gmail.com</td>
                        <td>0124325621</td>
                        <td>12/5/2017</td>
                        <td>Disapproved Place</td>
                        <td>5.000.000</td>
                        <td>1/2/2017</td>                         
                      </tr>   
                      <tr>
                        <td style="margin:10px">7</td>
                        <td><center>
                          <a data-toggle="tooltip" title="Details"  class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>                            
                        </center></td>                          
                        <td>An Cancelled Event</td>
                        <td>Cancelled</td>
                        <td>Charity</td>
                        <td>cancelled123</td>
                        <td>Guy Cancelled</td>
                        <td>Cancelled Co.</td>
                        <td>ccccc@gmail.com</td>
                        <td>0124325621</td>
                        <td>12/5/2017</td>
                        <td>Cancelled Place</td>
                        <td>5.000.000</td>
                        <td>1/2/2017</td>                         
                      </tr>                             
                    </tbody>
                  </table>        
                </div>
              </div>
            </div>

            <div id="approvedEvents" class="tab-pane fade">
              <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="col-md-6">
                        <h3>Appproved events <small>(sub-title)</small></h3>
                    </div>
                        
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
        
                  <table id="tableApprovedEvents" class="table table-striped table-bordered dt-responsive nowrap datatable-responsive" cellspacing="0" width="100%">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Action</th>                        
                        <th>Event</th>
                        <th>Type</th>
                        <th>User</th>
                        <th>Full Name</th>
                        <th>Company Name</th>
                        <th>Email</th>
                        <th>Phone</th>                          
                        <th>Start Date</th>
                        <th>Location</th>
                        <th>Budget</th>
                        <th>Create Date</th>
                      </tr>
                    </thead>
                    <tbody>                      
                      <tr>
                        <td style="margin:10px">1</td>
                        <td><center>
                          <a data-toggle="tooltip" title="Details"  class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>                            
                        </center></td>                          
                        <td>An Approved Event</td>
                        <td>Charity</td>
                        <td>approve123</td>
                        <td>Guy Approve</td>
                        <td>Approval Co.</td>
                        <td>aaaaa@gmail.com</td>
                        <td>0124325621</td>
                        <td>12/4/2017</td>
                        <td>Place</td>
                        <td>2.000.000</td>
                        <td>1/2/2017</td> 
                      </tr>                             
                    </tbody>
                  </table>        
                </div>
              </div>
            </div>

            <div id="disapprovedEvents" class="tab-pane fade">
              <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="col-md-6">
                        <h3>Disapproved events <small>(sub-title)</small></h3>
                    </div>
                        
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
        
                  <table id="tableDisapprovedEvents" class="table table-striped table-bordered dt-responsive nowrap datatable-responsive" cellspacing="0" width="100%">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Action</th>                        
                        <th>Event</th>
                        <th>Type</th>
                        <th>User</th>
                        <th>Full Name</th>
                        <th>Company Name</th>
                        <th>Email</th>
                        <th>Phone</th>                          
                        <th>Start Date</th>
                        <th>Location</th>
                        <th>Budget</th>
                        <th>Create Date</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>                      
                      <tr>
                        <td style="margin:10px">1</td>
                        <td><center>
                          <a data-toggle="tooltip" title="Details"  class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>                            
                        </center></td>                          
                        <td>An Disapproved Event</td>
                        <td>Charity</td>
                        <td>disapprove123</td>
                        <td>Guy Disapprove</td>
                        <td>Disapproval Co.</td>
                        <td>bbbbb@gmail.com</td>
                        <td>0124325621</td>
                        <td>12/5/2017</td>
                        <td>Disapproved Place</td>
                        <td>5.000.000</td>
                        <td>1/2/2017</td> 
                        <td>Typos, Unreliable Informations</td>
                      </tr>                             
                    </tbody>
                  </table>        
                </div>
              </div>
            </div>

            <div id="cancelledEvents" class="tab-pane fade">
              <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="col-md-6">
                        <h3>Cancelled events <small>(sub-title)</small></h3>
                    </div>
                        
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
        
                  <table id="tableCancelledEvents" class="table table-striped table-bordered dt-responsive nowrap datatable-responsive" cellspacing="0" width="100%">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Action</th>                        
                        <th>Event</th>
                        <th>Type</th>
                        <th>User</th>
                        <th>Full Name</th>
                        <th>Company Name</th>
                        <th>Email</th>
                        <th>Phone</th>                          
                        <th>Start Date</th>
                        <th>Location</th>
                        <th>Budget</th>
                        <th>Create Date</th>
                      </tr>
                    </thead>
                    <tbody>                      
                      <tr>
                        <td style="margin:10px">1</td>
                        <td><center>
                          <a data-toggle="tooltip" title="Details"  class="btn btn-info btn-xs" href="#"><span class="glyphicon glyphicon-search"></span></a>                            
                        </center></td>                          
                        <td>An Cancelled Event</td>
                        <td>Charity</td>
                        <td>cancelled123</td>
                        <td>Guy Cancelled</td>
                        <td>Cancelled Co.</td>
                        <td>ccccc@gmail.com</td>
                        <td>0124325621</td>
                        <td>12/5/2017</td>
                        <td>Cancelled Place</td>
                        <td>5.000.000</td>
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
