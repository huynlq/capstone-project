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
        $('#table-day-1').DataTable();
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

        function initiateSchedule() {
            content1 = '<div class="row clearfix">'
                          + '<div class="col-md-12 column">'
                            + '<table id="table-day-1" class="table table-bordered table-hover dt-responsive" id="tab_logic">'
                              + '<thead>'
                                + '<tr >'
                                  + '<th class="text-center">Time</th>'
                                  + '<th class="text-center">Place</th>'
                                  + '<th class="text-center">Activity</th>'
                                  + '<th class="text-center">Estimated Budget</th>'
                                  + '<th class="text-center" style="width: 110px; text-align: center">Action</th>'
                                + '</tr>'
                              + '</thead>'
                              + '<tbody id="body-day1">'
                                + '<tr id="addr1-1">'
                                  + '<td><input type="text" id="txtDay1-Time1"  placeholder="Time" class="form-control"/></td>'
                                  + '<td><input type="text" id="txtDay1-Place1" placeholder="Place" class="form-control"/></td>'
                                  + '<td><input type="text" id="txtDay1-Activity1" placeholder="Activity" class="form-control"/></td>'
                                  + '<td><input type="text" id="txtDay1-EstBudget1" placeholder="Estimated Budget" class="form-control"/></td>'
                                  + '<td id="day1_addActivity"><a id="add_row1" class="btn btn-default glyphicon glyphicon-plus" onclick="addActivity(1, 2)"></a></td>'
                                + '</tr>'
                                + '<tr id="addr1-2"></tr>'
                              + '</tbody>'
                            + '</table>'
                          + '</div>'
                        + '</div>'
                        // + '<div id="day' + i + '_addActivity"><a id="add_row' + i + '" class="btn btn-default pull-left" onclick="addActivity(' + i + '), 2">Add Row</a></div>'
                        + '</p></div>';
          document.getElementById("activityDates").innerHTML = content1;
        } 
    </script>
</head>
<body>
        <form class="form-horizontal form-label-left">
              <h3 style="margin-left: 50px">Event Activities</h3>
              <hr>
              <input id="txtNumberOfDates" type="hidden" value="0">
              <div class="col-md-3 col-sm-3 col-xs-12"></div>
              <div class="col-md-6 col-sm-6 col-xs-12">
                <ul id="activityDates" class="nav nav-tabs">
                  
                </ul>

                <div id="activityContents" class="tab-content">
                  
                </div>
              </div>
              <div class="col-md-3 col-sm-3 col-xs-12"></div>
              <hr>
              <div class="row">
                <div class="col-md-7 col-sm-7"></div>
                <div class="col-md-2 col-sm-2 col-xs-12">
                  <a class="btn btn-info col-xs-12" onclick="goNext()">Continue >></a>
                </div>
              </div>
            </form>
    <table id="example" class="display" cellspacing="0" width="100%">
        <thead>
            <tr>
                <th rowspan="2">Name</th>
                <th colspan="2">HR Information</th>
                <th colspan="3">Contact</th>
            </tr>
            <tr>
                <th>Position</th>
                <th>Salary</th>
                <th>Office</th>
                <th>Extn.</th>
                <th>E-mail</th>
            </tr>
        </thead>
        <tfoot>
            <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Salary</th>
                <th>Office</th>
                <th>Extn.</th>
                <th>E-mail</th>
            </tr>
        </tfoot>
        <tbody>
            <tr>
                <td>Tiger Nixon</td>
                <td>System Architect</td>
                <td>$320,800</td>
                <td>Edinburgh</td>
                <td>5421</td>
                <td>t.nixon@datatables.net</td>
            </tr>
            <tr>
                <td>Garrett Winters</td>
                <td>Accountant</td>
                <td>$170,750</td>
                <td>Tokyo</td>
                <td>8422</td>
                <td>g.winters@datatables.net</td>
            </tr>
            <tr>
                <td>Ashton Cox</td>
                <td>Junior Technical Author</td>
                <td>$86,000</td>
                <td>San Francisco</td>
                <td>1562</td>
                <td>a.cox@datatables.net</td>
            </tr>
            <tr>
                <td>Cedric Kelly</td>
                <td>Senior Javascript Developer</td>
                <td>$433,060</td>
                <td>Edinburgh</td>
                <td>6224</td>
                <td>c.kelly@datatables.net</td>
            </tr>
            <tr>
                <td>Airi Satou</td>
                <td>Accountant</td>
                <td>$162,700</td>
                <td>Tokyo</td>
                <td>5407</td>
                <td>a.satou@datatables.net</td>
            </tr>
            <tr>
                <td>Brielle Williamson</td>
                <td>Integration Specialist</td>
                <td>$372,000</td>
                <td>New York</td>
                <td>4804</td>
                <td>b.williamson@datatables.net</td>
            </tr>
            <tr>
                <td>Herrod Chandler</td>
                <td>Sales Assistant</td>
                <td>$137,500</td>
                <td>San Francisco</td>
                <td>9608</td>
                <td>h.chandler@datatables.net</td>
            </tr>
            <tr>
                <td>Rhona Davidson</td>
                <td>Integration Specialist</td>
                <td>$327,900</td>
                <td>Tokyo</td>
                <td>6200</td>
                <td>r.davidson@datatables.net</td>
            </tr>
            <tr>
                <td>Colleen Hurst</td>
                <td>Javascript Developer</td>
                <td>$205,500</td>
                <td>San Francisco</td>
                <td>2360</td>
                <td>c.hurst@datatables.net</td>
            </tr>
            <tr>
                <td>Sonya Frost</td>
                <td>Software Engineer</td>
                <td>$103,600</td>
                <td>Edinburgh</td>
                <td>1667</td>
                <td>s.frost@datatables.net</td>
            </tr>
            <tr>
                <td>Jena Gaines</td>
                <td>Office Manager</td>
                <td>$90,560</td>
                <td>London</td>
                <td>3814</td>
                <td>j.gaines@datatables.net</td>
            </tr>
            <tr>
                <td>Quinn Flynn</td>
                <td>Support Lead</td>
                <td>$342,000</td>
                <td>Edinburgh</td>
                <td>9497</td>
                <td>q.flynn@datatables.net</td>
            </tr>
            <tr>
                <td>Charde Marshall</td>
                <td>Regional Director</td>
                <td>$470,600</td>
                <td>San Francisco</td>
                <td>6741</td>
                <td>c.marshall@datatables.net</td>
            </tr>
            <tr>
                <td>Haley Kennedy</td>
                <td>Senior Marketing Designer</td>
                <td>$313,500</td>
                <td>London</td>
                <td>3597</td>
                <td>h.kennedy@datatables.net</td>
            </tr>
            <tr>
                <td>Tatyana Fitzpatrick</td>
                <td>Regional Director</td>
                <td>$385,750</td>
                <td>London</td>
                <td>1965</td>
                <td>t.fitzpatrick@datatables.net</td>
            </tr>
            <tr>
                <td>Michael Silva</td>
                <td>Marketing Designer</td>
                <td>$198,500</td>
                <td>London</td>
                <td>1581</td>
                <td>m.silva@datatables.net</td>
            </tr>
            <tr>
                <td>Paul Byrd</td>
                <td>Chief Financial Officer (CFO)</td>
                <td>$725,000</td>
                <td>New York</td>
                <td>3059</td>
                <td>p.byrd@datatables.net</td>
            </tr>
            <tr>
                <td>Gloria Little</td>
                <td>Systems Administrator</td>
                <td>$237,500</td>
                <td>New York</td>
                <td>1721</td>
                <td>g.little@datatables.net</td>
            </tr>
            <tr>
                <td>Bradley Greer</td>
                <td>Software Engineer</td>
                <td>$132,000</td>
                <td>London</td>
                <td>2558</td>
                <td>b.greer@datatables.net</td>
            </tr>
            <tr>
                <td>Dai Rios</td>
                <td>Personnel Lead</td>
                <td>$217,500</td>
                <td>Edinburgh</td>
                <td>2290</td>
                <td>d.rios@datatables.net</td>
            </tr>
            <tr>
                <td>Jenette Caldwell</td>
                <td>Development Lead</td>
                <td>$345,000</td>
                <td>New York</td>
                <td>1937</td>
                <td>j.caldwell@datatables.net</td>
            </tr>
            <tr>
                <td>Yuri Berry</td>
                <td>Chief Marketing Officer (CMO)</td>
                <td>$675,000</td>
                <td>New York</td>
                <td>6154</td>
                <td>y.berry@datatables.net</td>
            </tr>
            <tr>
                <td>Caesar Vance</td>
                <td>Pre-Sales Support</td>
                <td>$106,450</td>
                <td>New York</td>
                <td>8330</td>
                <td>c.vance@datatables.net</td>
            </tr>
            <tr>
                <td>Doris Wilder</td>
                <td>Sales Assistant</td>
                <td>$85,600</td>
                <td>Sidney</td>
                <td>3023</td>
                <td>d.wilder@datatables.net</td>
            </tr>
            <tr>
                <td>Angelica Ramos</td>
                <td>Chief Executive Officer (CEO)</td>
                <td>$1,200,000</td>
                <td>London</td>
                <td>5797</td>
                <td>a.ramos@datatables.net</td>
            </tr>
            <tr>
                <td>Gavin Joyce</td>
                <td>Developer</td>
                <td>$92,575</td>
                <td>Edinburgh</td>
                <td>8822</td>
                <td>g.joyce@datatables.net</td>
            </tr>
            <tr>
                <td>Jennifer Chang</td>
                <td>Regional Director</td>
                <td>$357,650</td>
                <td>Singapore</td>
                <td>9239</td>
                <td>j.chang@datatables.net</td>
            </tr>
            <tr>
                <td>Brenden Wagner</td>
                <td>Software Engineer</td>
                <td>$206,850</td>
                <td>San Francisco</td>
                <td>1314</td>
                <td>b.wagner@datatables.net</td>
            </tr>
            <tr>
                <td>Fiona Green</td>
                <td>Chief Operating Officer (COO)</td>
                <td>$850,000</td>
                <td>San Francisco</td>
                <td>2947</td>
                <td>f.green@datatables.net</td>
            </tr>
            <tr>
                <td>Shou Itou</td>
                <td>Regional Marketing</td>
                <td>$163,000</td>
                <td>Tokyo</td>
                <td>8899</td>
                <td>s.itou@datatables.net</td>
            </tr>
            <tr>
                <td>Michelle House</td>
                <td>Integration Specialist</td>
                <td>$95,400</td>
                <td>Sidney</td>
                <td>2769</td>
                <td>m.house@datatables.net</td>
            </tr>
            <tr>
                <td>Suki Burks</td>
                <td>Developer</td>
                <td>$114,500</td>
                <td>London</td>
                <td>6832</td>
                <td>s.burks@datatables.net</td>
            </tr>
            <tr>
                <td>Prescott Bartlett</td>
                <td>Technical Author</td>
                <td>$145,000</td>
                <td>London</td>
                <td>3606</td>
                <td>p.bartlett@datatables.net</td>
            </tr>
            <tr>
                <td>Gavin Cortez</td>
                <td>Team Leader</td>
                <td>$235,500</td>
                <td>San Francisco</td>
                <td>2860</td>
                <td>g.cortez@datatables.net</td>
            </tr>
            <tr>
                <td>Martena Mccray</td>
                <td>Post-Sales support</td>
                <td>$324,050</td>
                <td>Edinburgh</td>
                <td>8240</td>
                <td>m.mccray@datatables.net</td>
            </tr>
            <tr>
                <td>Unity Butler</td>
                <td>Marketing Designer</td>
                <td>$85,675</td>
                <td>San Francisco</td>
                <td>5384</td>
                <td>u.butler@datatables.net</td>
            </tr>
            <tr>
                <td>Howard Hatfield</td>
                <td>Office Manager</td>
                <td>$164,500</td>
                <td>San Francisco</td>
                <td>7031</td>
                <td>h.hatfield@datatables.net</td>
            </tr>
            <tr>
                <td>Hope Fuentes</td>
                <td>Secretary</td>
                <td>$109,850</td>
                <td>San Francisco</td>
                <td>6318</td>
                <td>h.fuentes@datatables.net</td>
            </tr>
            <tr>
                <td>Vivian Harrell</td>
                <td>Financial Controller</td>
                <td>$452,500</td>
                <td>San Francisco</td>
                <td>9422</td>
                <td>v.harrell@datatables.net</td>
            </tr>
            <tr>
                <td>Timothy Mooney</td>
                <td>Office Manager</td>
                <td>$136,200</td>
                <td>London</td>
                <td>7580</td>
                <td>t.mooney@datatables.net</td>
            </tr>
            <tr>
                <td>Jackson Bradshaw</td>
                <td>Director</td>
                <td>$645,750</td>
                <td>New York</td>
                <td>1042</td>
                <td>j.bradshaw@datatables.net</td>
            </tr>
            <tr>
                <td>Olivia Liang</td>
                <td>Support Engineer</td>
                <td>$234,500</td>
                <td>Singapore</td>
                <td>2120</td>
                <td>o.liang@datatables.net</td>
            </tr>
            <tr>
                <td>Bruno Nash</td>
                <td>Software Engineer</td>
                <td>$163,500</td>
                <td>London</td>
                <td>6222</td>
                <td>b.nash@datatables.net</td>
            </tr>
            <tr>
                <td>Sakura Yamamoto</td>
                <td>Support Engineer</td>
                <td>$139,575</td>
                <td>Tokyo</td>
                <td>9383</td>
                <td>s.yamamoto@datatables.net</td>
            </tr>
            <tr>
                <td>Thor Walton</td>
                <td>Developer</td>
                <td>$98,540</td>
                <td>New York</td>
                <td>8327</td>
                <td>t.walton@datatables.net</td>
            </tr>
            <tr>
                <td>Finn Camacho</td>
                <td>Support Engineer</td>
                <td>$87,500</td>
                <td>San Francisco</td>
                <td>2927</td>
                <td>f.camacho@datatables.net</td>
            </tr>
            <tr>
                <td>Serge Baldwin</td>
                <td>Data Coordinator</td>
                <td>$138,575</td>
                <td>Singapore</td>
                <td>8352</td>
                <td>s.baldwin@datatables.net</td>
            </tr>
            <tr>
                <td>Zenaida Frank</td>
                <td>Software Engineer</td>
                <td>$125,250</td>
                <td>New York</td>
                <td>7439</td>
                <td>z.frank@datatables.net</td>
            </tr>
            <tr>
                <td>Zorita Serrano</td>
                <td>Software Engineer</td>
                <td>$115,000</td>
                <td>San Francisco</td>
                <td>4389</td>
                <td>z.serrano@datatables.net</td>
            </tr>
            <tr>
                <td>Jennifer Acosta</td>
                <td>Junior Javascript Developer</td>
                <td>$75,650</td>
                <td>Edinburgh</td>
                <td>3431</td>
                <td>j.acosta@datatables.net</td>
            </tr>
            <tr>
                <td>Cara Stevens</td>
                <td>Sales Assistant</td>
                <td>$145,600</td>
                <td>New York</td>
                <td>3990</td>
                <td>c.stevens@datatables.net</td>
            </tr>
            <tr>
                <td>Hermione Butler</td>
                <td>Regional Director</td>
                <td>$356,250</td>
                <td>London</td>
                <td>1016</td>
                <td>h.butler@datatables.net</td>
            </tr>
            <tr>
                <td>Lael Greer</td>
                <td>Systems Administrator</td>
                <td>$103,500</td>
                <td>London</td>
                <td>6733</td>
                <td>l.greer@datatables.net</td>
            </tr>
            <tr>
                <td>Jonas Alexander</td>
                <td>Developer</td>
                <td>$86,500</td>
                <td>San Francisco</td>
                <td>8196</td>
                <td>j.alexander@datatables.net</td>
            </tr>
            <tr>
                <td>Shad Decker</td>
                <td>Regional Director</td>
                <td>$183,000</td>
                <td>Edinburgh</td>
                <td>6373</td>
                <td>s.decker@datatables.net</td>
            </tr>
            <tr>
                <td>Michael Bruce</td>
                <td>Javascript Developer</td>
                <td>$183,000</td>
                <td>Singapore</td>
                <td>5384</td>
                <td>m.bruce@datatables.net</td>
            </tr>
            <tr>
                <td>Donna Snider</td>
                <td>Customer Support</td>
                <td>$112,000</td>
                <td>New York</td>
                <td>4226</td>
                <td>d.snider@datatables.net</td>
            </tr>
        </tbody>
    </table>
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
    <script src="../vendors/datatables.net/js/jquery.dataTables.js"></script>
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