var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');
var pdf = require('html-pdf');   
var ObjectId = require('mongodb').ObjectID;
var async = require('async');
var source = 'http://localhost:3000';
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

// serialize and deserialize
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// config
passport.use(new FacebookStrategy({
    clientID: '164484687312690',
    clientSecret: 'aefbca717665f99fba67be67134cc786',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name']
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

var download = function(uri, filename, callback){	
    console.log("Download");
    request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('guest_page/index');
});

/* GET home page. */
router.get('/chat', function(req, res, next) {
  res.render('guest_page/chat');
});

/* GET export page. */
router.get('/export/:id', function(req, res, next) {
	// var html = '<!DOCTYPE html><html><head><title>My Webpage</title></head>' +
 //    '<body><h1>My Webpage</h1><p>This is my webpage. I hope you like it' +
 //    '!</body></html>';

 	var db = req.db;
    var id = req.params.id;
    async.parallel([
        function(callback){
            var requireData = db.get('RequiredDonations');
            requireData.find({ eventId: id }, callback);
        },
        function(callback){
            var donationData = db.get('Donations');
            donationData.find({ eventId: id },callback);
        },
        function(callback){
            var sponsorData = db.get('EventSponsored');
            sponsorData.find({ eventId: id, status: {$ne: 'Pending'}}, function(err, docs){
                var dataId = [];
                for(var i = 0; i < docs.length; i++)
                    dataId.push(new ObjectId(docs[i].userId));
                sponsorData = db.get('Users');
                sponsorData.find({ _id: { $in: dataId } }, callback);
            });
        },        
        function(callback){
            var costData = db.get('Activities');
            costData.find({ eventId: id, actualCost: {'$ne': null} },callback);
        },
        function(callback){
            var eventData = db.get('Events');
            eventData.findOne({ _id: id},callback);
        },
        function(callback){
            var participantData = db.get('EventJoined');
            participantData.find({ eventId: id }, function(err, docs){
                var dataId = [];
                for(var i = 0; i < docs.length; i++)
                    if(docs[i].status == 'Present')
                        dataId.push(new ObjectId(docs[i].userId));
                console.log(dataId);
                participantData = db.get('Users');
                participantData.find({ _id: { $in: dataId } }, callback);
            });
        },
        function(callback){
            var participantData = db.get('EventJoined');
            participantData.find({ eventId: id }, function(err, docs){
                var dataId = [];
                for(var i = 0; i < docs.length; i++)
                    if(docs[i].status != 'Present')
                        dataId.push(new ObjectId(docs[i].userId));
                console.log(dataId);
                participantData = db.get('Users');
                participantData.find({ _id: { $in: dataId } }, callback);
            });
        },
        function(callback){
            var eventData = db.get('Events');
            eventData.findOne({ _id: id}, function(err, docs){
                var producerId = docs.userId;
                console.log('ID: ' + docs.userId);
                var producerData = db.get('Users');
                producerData.findOne({ _id: new ObjectId(producerId) }, callback);
            });
        },
    ], function(err, results){
        var requireData = results[0];
        var donationData = results[1];
        var sponsorData = results[2];        
        var costData = results[3];
        var eventData = results[4];
        var participantData = results[5];
        var participantAbsentData = results[6];
        var producerData = results[7];

        console.log(producerData);

        var html = fs.readFileSync('public/template/pdf-template.html', 'utf8').toString();

        var headerContent = '<div style="text-align: center;">' + eventData.eventName + '</div>';

        var footerContent = '<div style="text-align: center;">' +
        						'<span style="color: #444;text-align: center;">Thời gian tạo: ' + new Date().toLocaleTimeString() + ' - ' + new Date().toLocaleDateString() + ' - Trang: {{page}}</span>/<span>{{pages}}</span>' +
        					'</div>';

        var dates = eventData.eventDate.split(' - ');

        var eventContent = '' +
        '<div style="text-align:center;">' +
        	'<h1><b>' + 'BẢN BÁO CÁO' + '</b></h1>' +
        	'<h2>' + eventData.eventName + '</h2>' +
        	'<p>' + 'Được tạo vào lúc ' + new Date().toLocaleTimeString() + ' - ' + new Date().toLocaleDateString() + '</p>' +
        	'<br>' +
        	'<img src="' + source + eventData.eventImage + '" style="max-height: 500px"/><br>' +
        	'<br>' +
        	'<table class="table">' +
				'<tbody>' +
					'<tr>' +
						'<td style="text-align:right"><b>Tên sự kiện: </b></td>' +
						'<td>' + eventData.eventName + '</td>' +
					'</tr>' +
					'<tr>' +
						'<td style="text-align:right"><b>Nhà tổ chức: </b></td>' +
						'<td>' + producerData.companyName + '</td>' +
					'</tr>' +
					'<tr>' +
						'<td style="text-align:right"><b>Ngày diễn ra: </b></td>' +
						'<td>' + new Date(dates[0]).toLocaleDateString() + ' - ' + new Date(dates[1]).toLocaleDateString() + '</td>' +
					'</tr>' +
					'<tr>' +
						'<td style="text-align:right"><b>Địa điểm tập trung: </b></td>' +
						'<td>' + eventData.meetingAddress + '</td>' +
					'</tr>' +
					'<tr>' +
						'<td style="text-align:right"><b>Chi tiết: </b></td>' +
						'<td>' + eventData.eventShortDescription + '</td>' +
					'</tr>' +
				'</tbody>' +
			'</table>' +
        '</div>' +
        '';        

        var producerContent = '' +
        '<div style="text-align:center;">' +
        	'<h1><b>' + 'BAN TỔ CHÚC' + '</b></h1><hr>' +
        	'<img src="' + source + producerData.companyImage + '" style="max-height: 500px"/><br>' +
        	'<br>' +
        	'<table class="table">' +
				'<tbody>' +
					'<tr>' +
						'<td style="text-align:right"><b>Tên tổ chức: </b></td>' +
						'<td>' + producerData.companyName + '</td>' +
					'</tr>' +
					'<tr>' +
						'<td style="text-align:right"><b>Địa chỉ: </b></td>' +
						'<td>' + producerData.companyAddress + '</td>' +
					'</tr>' +
					'<tr>' +
						'<td style="text-align:right"><b>Điện thoại: </b></td>' +
						'<td>' + producerData.companyPhoneNumber + '</td>' +
					'</tr>' +
					'<tr>' +
						'<td style="text-align:right"><b>Email: </b></td>' +
						'<td>' + producerData.companyEmail + '</td>' +
					'</tr>' +
					'<tr>' +
						'<td style="text-align:right"><b>Website: </b></td>' +
						'<td>' + producerData.companyWebsite + '</td>' +
					'</tr>' +
				'</tbody>' +
			'</table>' +
        '</div>' +
        '';

        // Get Donation Data
        var pendingDonations = [];
        var approvedDonations = [];
        for(var i = 0; i < donationData.length; i++) {
            if(donationData[i].status == 'Pending') {
                pendingDonations.push(donationData[i]);
            } else {
                approvedDonations.push(donationData[i]);
            }
        }

        // Count Current Donations
        var currentDonations = [];
        var currentPendingDonations = [];
        var activityCosts = [];
        var currentDonation;
        var currentPendingDonation;
        var activityCost;
        var current;
        var progressContent = '';

        for(var i = 0; i < requireData.length; i++) {
            current = 0;
            for(var j = 0; j < approvedDonations.length; j++) {
                if(approvedDonations[j].donationItem == requireData[i].item)
                    current += parseInt(approvedDonations[j].donationNumber);
            }

            var content = 	'<tr>' +
        						'<td>' + requireData[i].item + '</td>' +
        						'<td>' + parseInt(current).toLocaleString() + ' ' + requireData[i].unit + '</td>' +
        						'<td>' + parseInt(requireData[i].quantity).toLocaleString() + ' ' + requireData[i].unit + '</td>' +
        						'<td>' + parseFloat(parseInt(current)/parseInt(requireData[i].quantity) * 100).toFixed(2).toLocaleString() + '%</td>' +
        					'</tr>';     

        	progressContent += content;     

            currentDonation = {
                item: requireData[i].item,
                unit: requireData[i].unit,
                quantity: current
            };            
            currentDonations.push(currentDonation);

            currentPendingDonation = {
                item: requireData[i].item,
                unit: requireData[i].unit,
                quantity: 0
            };            
            currentPendingDonations.push(currentPendingDonation);

            activityCost = {
                item: requireData[i].item,
                unit: requireData[i].unit,
                quantity: 0
            };            
            activityCosts.push(activityCost);
        }

        var donationProgressContent = '' +
        '<div style="text-align:center;">' +
        	'<h1><b>' + 'THỐNG KÊ QUYÊN GÓP' + '</b></h1><hr>' +
        	'<br>' +
        	'<h2>' + 'Quyên góp cần có' + '</h2><br>' +
        	'<table class="table table-bordered">' +
        		'<thead>' +
        			'<tr>' +
        				'<th>Đồ góp</th>' +
        				'<th>Hiện có</th>' +
        				'<th>Đang cần</th>' +
        				'<th>Tỉ lệ</th>' +
        			'</tr>' +
        		'</thead>' +
				'<tbody>' +
					progressContent +
				'</tbody>' +
			'</table>' +
        '</div>' +
        '';

        // Calculate Donations
        var donationContent = "";
        var donationString = "";
        for(var i = 0; i < approvedDonations.length; i++) {
            donationString = approvedDonations[i].donationItem + ": " + parseInt(approvedDonations[i].donationNumber).toLocaleString() + " (" + approvedDonations[i].donationUnit + ")";
            donationContent += 	'<tr>' +
	        						'<td>' + approvedDonations[i].donatorName + '</td>' +
	        						'<td>' + approvedDonations[i].donatorEmail + '</td>' +
	        						'<td>' + approvedDonations[i].donatorPhoneNumber + '</td>' +
	        						'<td>' + donationString + '</td>' +
	        					'</tr>'; 
        }

        // Populate Total Donations Pane        
        donationString = '';
        for(var i = 0; i < currentDonations.length; i++) {
            donationString += currentDonations[i].item + ": " + parseInt(currentDonations[i].quantity).toLocaleString() + " (" + currentDonations[i].unit + ")<br>";            
        }
        donationContent += 	'<tr>' +
        						'<td colspan="3" style="text-align: right"><b>' + 'Tổng cộng' + '</b></td>' +
        						'<td>' + donationString + '</td>' +
        					'</tr>'; 

        var donationPane = '' +
        '<br><br><div style="text-align:center;">' +
        	'<h2>' + 'Quyên góp được duyệt' + '</h2><br>' +
        	'<table class="table table-bordered">' +
        		'<thead>' +
        			'<tr>' +
        				'<th>Người góp</th>' +
        				'<th>Email</th>' +
        				'<th>Điện thoại</th>' +
        				'<th>Đóng góp</th>' +
        			'</tr>' +
        		'</thead>' +
				'<tbody>' +
					donationContent +
				'</tbody>' +
			'</table>' +
        '</div>' +
        '';

        // Populate Pending Donations      
        var pendingDonationContent = '';
        for(var i = 0; i < pendingDonations.length; i++) {
            donationString = pendingDonations[i].donationItem + ": " + parseInt(pendingDonations[i].donationNumber).toLocaleString() + " (" + pendingDonations[i].donationUnit + ")";
            pendingDonationContent += 	'<tr>' +
	        						'<td>' + pendingDonations[i].donatorName + '</td>' +
	        						'<td>' + pendingDonations[i].donatorEmail + '</td>' +
	        						'<td>' + pendingDonations[i].donatorPhoneNumber + '</td>' +
	        						'<td>' + donationString + '</td>' +
	        					'</tr>'; 
            for(var j = 0; j < currentPendingDonations.length; j++) {
                if(currentPendingDonations[j].item == pendingDonations[i].donationItem)
                    currentPendingDonations[j].quantity += parseInt(pendingDonations[i].donationNumber);
            }
        }

        // Populate Total Pending Donations Pane
        donationString = '';
        for(var i = 0; i < currentPendingDonations.length; i++) {
            donationString += currentPendingDonations[i].item + ": " + parseInt(currentPendingDonations[i].quantity).toLocaleString() + " (" + currentPendingDonations[i].unit + ")<br>";            
        }
        pendingDonationContent += 	'<tr>' +
		        						'<td colspan="3" style="text-align: right"><b>' + 'Tổng cộng' + '</b></td>' +
		        						'<td>' + donationString + '</td>' +
		        					'</tr>'; 

        var pendingDonationPane = '' +
        '<br><br><div style="text-align:center;">' +
        	'<h2>' + 'Quyên góp chưa duyệt' + '</h2><br>' +
        	'<table class="table table-bordered">' +
        		'<thead>' +
        			'<tr>' +
        				'<th>Người góp</th>' +
        				'<th>Email</th>' +
        				'<th>Điện thoại</th>' +
        				'<th>Đóng góp</th>' +
        			'</tr>' +
        		'</thead>' +
				'<tbody>' +
					pendingDonationContent +
				'</tbody>' +
			'</table>' +
        '</div>' +
        '';

        // Populate Cost
        var costString = "";
        var costContent = "";
        var dateStart;
        for(var i = 0; i < costData.length; i++) {
            costString = "";
            for(var j = 0; j < costData[i].actualCost.length; j++) {                
                costString += costData[i].actualCost[j].item + ": " + parseInt(costData[i].actualCost[j].cost).toLocaleString() + ' (' + costData[i].actualCost[j].unit + ')<br>';
            }

            dateStart = new Date(eventData.eventDate.split(' - ')[0]);
            costContent += 	'<tr>' +
        						'<td>' + new Date(dateStart.setDate(dateStart.getDate() + (costData[i].day - 1))).toLocaleDateString() + '</td>' +
        						'<td>' + costData[i].place + '</td>' +
        						'<td>' + costData[i].activity + '</td>' +
        						'<td>' + costString + '</td>' +
        					'</tr>';

            for(var j = 0; j < activityCosts.length; j++) {
                for(var k = 0; k < costData[i].actualCost.length; k++) {
                    console.log(costData[i].actualCost[k]);
                    console.log(activityCosts[i].item)
                    if(activityCosts[j].item == costData[i].actualCost[k].item)
                        activityCosts[j].quantity = costData[i].actualCost[k].cost;
                }
            }
        }

        // Populate Total Donations Pane        
        donationString = '';
        var remainingString = '';
        var remainingDonationContent = '';
        for(var i = 0; i < currentDonations.length; i++) {
            donationString = parseInt(currentDonations[i].quantity).toLocaleString() + " (" + currentDonations[i].unit + ")";
			for(var j = 0; j < activityCosts.length; j++) {
				if(activityCosts[j].item == currentDonations[i].item) {
					costString = parseInt(activityCosts[j].quantity).toLocaleString() + " (" + activityCosts[j].unit + ")";
		            remainingString = (parseInt(currentDonations[i].quantity) - parseInt(activityCosts[j].quantity)).toLocaleString() + ' (' + currentDonations[i].unit + ')'; 
		            remainingDonationContent += '<tr>' +
					        						'<td><b>' + currentDonations[i].item + '</b></td>' +
					        						'<td>' + donationString + '</td>' +
					        						'<td>' + costString + '</td>' +
					        						'<td>' + remainingString + '</td>' +
					        					'</tr>'; 
		               
				}	            
	        }
        }

        console.log(remainingDonationContent);

        // Populate Total Cost
        costString = '';
        for(var i = 0; i < activityCosts.length; i++) {
            costString += activityCosts[i].item + ": " + parseInt(activityCosts[i].quantity).toLocaleString() + " (" + activityCosts[i].unit + ")<br>";            
        }
        costContent += 	'<tr>' +
    						'<td colspan="2"><b>' + 'Tổng cộng' + '</b></td>' +
    						'<td colspan="2">' + costString + '</td>' +
    					'</tr>'; 

    	// // Populate Remaining
     //    var remainingDonationContent = "";
     //    for(var i = 0; i < currentDonations.length; i++) {
     //        costString = "";
     //        for(var j = 0; j < activityCosts.length; j++) {    
     //            if(currentDonations[i].item == activityCosts[j].item) {
     //                costString += (parseInt(currentDonations[i].quantity) - parseInt(activityCosts[j].quantity)).toLocaleString() + ' (' + currentDonations[i].unit + ')'; 
     //                remainingDonationContent += '<tr>' +
					//         						'<td style="text-align:right"><b>' + currentDonations[i].item + '</b></td>' +
					//         						'<td>' + costString + '</td>' +
					//         					'</tr>'; 
     //            }
     //        }
     //    }
        

        var costPane = '' +
        '<div style="text-align:center;">' +
        	'<h1><b>' + 'THỐNG KÊ CHI PHÍ' + '</b></h1><hr>' +
        	'<br>' + 
        	'<h2>' + 'Chi tiêu' + '</h2><br>' +
        	'<table class="table table-bordered">' +
        		'<thead>' +
        			'<tr>' +
        				'<th>Ngày</th>' +
        				'<th>Địa điểm</th>' +
        				'<th>Hoạt động</th>' +
        				'<th>Chi phí</th>' +
        			'</tr>' +
        		'</thead>' +
				'<tbody>' +
					costContent +
				'</tbody>' +
			'</table>' +
			'<br><br>' +
        	'<h2>' + 'Thu - Chi' + '</h2><br>' +
        	'<table class="table table-bordered">' +
        		'<thead>' +
        			'<tr>' +
        				'<th>Đồ góp</th>' +
        				'<th>Thu</th>' +
        				'<th>Chi</th>' +
        				'<th>Còn lại</th>' +
        			'</tr>' +
        		'</thead>' +
				'<tbody>' +
					remainingDonationContent +
				'</tbody>' +
			'</table>' +
        '</div>' +
        '';

        // Populate Participant Content
        var participantContent = '';
        for(var i = 0; i < participantData.length; i++) {
        	participantContent += 	'<tr>' +
        								'<td>' + participantData[i].fullName + '</td>' +
        								'<td>' + participantData[i].email + '</td>' +
        								'<td>' + participantData[i].phoneNumber + '</td>' +
        								'<td>' + 'Có mặt' + '</td>' +
        							'</tr>';
        }
        for(var i = 0; i < participantAbsentData.length; i++) {
            participantContent += 	'<tr>' +
        								'<td>' + participantAbsentData[i].fullName + '</td>' +
        								'<td>' + participantAbsentData[i].email + '</td>' +
        								'<td>' + participantAbsentData[i].phoneNumber + '</td>' +
        								'<td>' + 'Vắng mặt' + '</td>' +
        							'</tr>';
        }

        participantContent += 	'<tr>' +
    								'<td colspan="3" style="text-align: right"><b>' + 'Tổng cộng' + '</b></td>' +
    								'<td>' + 'Có mặt: ' + participantData.length + '<br>' + 'Vắng mặt: ' + participantAbsentData.length + '</td>' +
    							'</tr>';

        var participantPane = '' +
        '<div style="text-align:center;">' +
        	'<h1><b>' + 'DANH SÁCH THAM GIA' + '</b></h1><hr>' +
        	'<br>' +
        	'<table class="table">' +
				'<thead>' +
        			'<tr>' +
        				'<th>Họ tên</th>' +
        				'<th>Email</th>' +
        				'<th>Số điện thoại</th>' +
        				'<th>Tình trạng</th>' +
        			'</tr>' +
        		'</thead>' +
				'<tbody>' +
					participantContent +
				'</tbody>' +
			'</table>' +
        '</div>' +
        '';

        var sponsorContent = '';
        for(var i = 0; i < sponsorData.length; i++) {
            // Count Donations
            var donationCollection = [];
            for(var j = 0; j < donationData.length; j++) {
                if(donationData[j].status != 'Pending' && donationData[j].userId == sponsorData[i]._id) {
                    var flag = false;
                    for(var k = 0; k < donationCollection.length; k++) {
                        if(donationData[j].donationItem == donationCollection[k].item) {
                            donationCollection[k].quantity += parseInt(donationData[j].donationNumber);
                            flag = true;
                        }
                    }

                    if(flag == false) {
                        var donationObject = {
                            item: donationData[j].donationItem,
                            unit: donationData[j].donationUnit,
                            quantity: parseInt(donationData[j].donationNumber)
                        }
                        donationCollection.push(donationObject);
                    }
                }
            }

            donationString = "";
            for(var j = 0; j < donationCollection.length; j++) {                
                donationString += donationCollection[j].item + ': ' + parseInt(donationCollection[j].quantity).toLocaleString() + ' (' + donationCollection[j].unit + ')<br>';
            }
            sponsorContent += 	'<tr>' +
    								'<td>' + sponsorData[i].companyName + '</td>' +
    								'<td>' + sponsorData[i].companyEmail + '</td>' +
    								'<td>' + sponsorData[i].companyPhoneNumber + '</td>' +
    								'<td>' + donationString + '</td>' +
    							'</tr>';
        }

        var sponsorPane = '' +
        '<div style="text-align:center;">' +
        	'<h1><b>' + 'DANH SÁCH TÀI TRỢ' + '</b></h1><hr>' +
        	'<br>' +
        	'<table class="table">' +
				'<thead>' +
        			'<tr>' +
        				'<th>Tổ chức</th>' +
        				'<th>Email</th>' +
        				'<th>Số điện thoại</th>' +
        				'<th>Đóng góp</th>' +
        			'</tr>' +
        		'</thead>' +
				'<tbody>' +
					sponsorContent +
				'</tbody>' +
			'</table>' +
        '</div>' +
        '';

        html = html.replace('#{eventPane}', eventContent);
        html = html.replace('#{producerPane}', producerContent);
        html = html.replace('#{donationProgressPane}', donationProgressContent);
        html = html.replace('#{donationPane}', donationPane);
        html = html.replace('#{pendingDonationPane}', pendingDonationPane);
        html = html.replace('#{totalDonationPane}', costPane);
        html = html.replace('#{participantPane}', participantPane);
        html = html.replace('#{sponsorPane}', sponsorPane);

        var options = { 
		// Papersize Options: http://phantomjs.org/api/webpage/property/paper-size.html 
		  "format": "A4",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid 
		  "orientation": "portrait", // portrait or landscape 
		  "header": {
		    "height": "15mm",
		    "contents": headerContent
		  },
		  "footer": {
		    "height": "15mm",
		    "contents": {
		      default: footerContent
		    }
		  },
		};

		var link = '/files/Report-' + eventData._id + '.pdf';

        pdf.create(html, options).toFile('./public' + link, function(err, response) {
    		// if (err) {
      //           res.json({ msg: err });
      //       } else {            
    		// 	res.writeHead(302, {
      //             'Location': link
      //           });
      //           res.end();
      //       }
            res.writeHead(302, {
                'Location': link
            });
            res.end();
		});
    });	
});

/* GET event list page. */
router.get('/events_list', function(req, res, next) {
  res.render('guest_page/list_events', { title: 'Events' });
});

/* GET sponsor list page. */
router.get('/sponsors_list', function(req, res, next) {
  res.render('guest_page/list_sponsors', { title: 'Sponsors' });
});

/* GET news list page. */
router.get('/news_list', function(req, res, next) {
  res.render('guest_page/list_posts', { title: 'News' });
});

/* GET news list page. */
router.get('/community_board', function(req, res, next) {
  res.render('guest_page/board', { title: 'Forum' });
});

/* GET sponsor list page. */
router.get('/promote', function(req, res, next) {
  res.render('guest_page/promote', { title: 'Promote' });
});

/* GET sponsor list page. */
router.get('/about', function(req, res, next) {
  res.render('guest_page/about_us', { title: 'About Us' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/* POST register info. */
router.post('/register', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	var db = req.db;
	var collection = db.get('Users');
	var flagUsernameExists = false;
	var flagEmailExists = false;

	collection.findOne({$or:[{"username": username},{"email": email}]}, function(err, doc) {
	  if (doc == null) {	  	
	  	collection.insert(req.body, function(err, result){
	  		download('http://www.infinitemd.com/wp-content/uploads/2017/02/default.jpg', 'public/images/user/' + result._id + '.jpg', function(){
		        console.log('done');
		    });
		    collection.update({ '_id' : result._id }, { $set:{'image':'/images/user/' + result._id + '.jpg'} }, function(err) {
		        res.send(
					(err === null) ? {msg: '', id: result._id} : {msg: err}
				);
		    });			
		});
	  } else {
	  	res.send({ msg: 1 });
	  }
	});
});

/* POST login info. */
router.post('/login', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var db = req.db;
	var collection = db.get('Users');
	var flagUsernameExists = false;
	var flagEmailExists = false;

	collection.findOne({"username": username,"password": password}, function(err, doc) {
        //Error Code:
        //1. Invalid username and/or password
        //2. Account banned.
	  if (doc != null) {
	  	if (doc.markBanned == 1) {
	  		res.send(
            	{ msg: 2, reason: doc.bannedReason }
        	)
        } else {
	  		res.send(
				{ 
					msg: "",
					role: doc.role,
					id: doc._id
				}
			);
        }		
	  } else {
	  	res.send(
            { msg: 1 }
        );
	  }
	});
});

/* GET user page. */
router.get('/my', function(req, res, next) {
	var user = req.cookies.user;
	if(user != null) {
		var db = req.db;
		var collection = db.get('Users');
		collection.findOne({"_id": user}, function(err, doc) {
			if(doc)
				res.render('guest_page/my_user_page', { title: 'Charity Project | User Page'});
			else
				res.render('login', { title: 'Login' });
		});  		
	} else {
		res.render('login', { title: 'Login' });
	}	
});

router.get('/hey', require('connect-ensure-login').ensureLoggedIn(), function(req, res){
    var user = req.user;
    console.log(req);  
    console.log(res);   
    res.json(user);
});

/* GET promote page. */
router.get('/promote', function(req, res, next) {
	res.render('users/promote', { title: 'Charity Project | Promotion Request'});
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }), function(req, res){});

router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), function(req, res) {
  console.log(req.user);

  var userFBId = req.user.id;
  var userFBName = req.user.displayName;
  var userFBEmail = '';
  if(req.user.emails.length > 0) {
    userFBEmail = req.user.emails[0].value;
  }  

  var db = req.db;
  var collection = db.get('Users');
  collection.findOne({"fbId": userFBId}, function(err, doc) {  
    if(doc == null) {
      // If user haven't register => Register now
      var userBody = {
        'fbId': userFBId,
        'username': userFBName,
        'email': userFBEmail,
        'role': 'User',
        'dateCreated': new Date()
      }
      collection.insert(userBody, function(err, result){
        download('http://www.infinitemd.com/wp-content/uploads/2017/02/default.jpg', 'public/images/user/' + result._id + '.jpg', function(){
            console.log('done');
        });
        res.cookie('user',result._id.toString(), { maxAge: 90000000000, httpOnly: false });
        collection.update({ '_id' : result._id }, { $set:{'image':'/images/user/' + result._id + '.jpg'} }, function(err) {
          if (err === null) {
            res.redirect('/my');
          }
        });     
      });
    } else {
      // If user has register => Go to homepage
      res.cookie('user',doc._id.toString(), { maxAge: 90000000000, httpOnly: false });
      res.redirect('/');
    }
  });  
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
