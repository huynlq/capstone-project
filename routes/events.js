var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var request = require('request');
var ObjectId = require('mongodb').ObjectID;
var xl = require('excel4node');
var Excel = require('exceljs');
var async = require('async');

var download = function(uri, filename, callback){
    console.log("Download");
    request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

var uploading = multer({
    dest: __dirname.split('routes')[0] + 'public\\images\\event\\',
    limits: {fileSize: 10000000, files:1},
});

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public\\images\\event\\');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});
var photoGalleryUpload = multer({
    storage : storage
}).array('photoGallery',20);

/* GET to save report with Excel */
router.get('/export/:id', function(req, res){

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

    ], function(err, results){
        var requireData = results[0];
        var donationData = results[1];
        var sponsorData = results[2];        
        var costData = results[3];
        var eventData = results[4];
        var participantData = results[5];
        var participantAbsentData = results[6];

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

        console.log(approvedDonations);

        // Create Workbook
        var workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet('Quyên góp');
        var worksheet2 = workbook.addWorksheet('Tham gia');
        var worksheet3 = workbook.addWorksheet('Tài trợ');

        // Set styles
        var headerFont = { bold: true };
        var titleFont = { size:30, bold: true };
        var title2Font = { size:20, bold: true };

        // Add event infomation
        worksheet.getCell('B2').font = titleFont;
        worksheet.getCell('B2').value = eventData.eventName;
        worksheet.getCell('B3').value = eventData.eventDate;
        worksheet.getCell('B4').value = eventData.meetingAddress;

        // Write Require Donations Header
        worksheet.getCell('C6').font = title2Font;
        worksheet.getCell('C6').value = "Mức độ quyên góp";
        worksheet.getCell('C8').font = headerFont;
        worksheet.getCell('D8').font = headerFont;
        worksheet.getCell('E8').font = headerFont;
        worksheet.getCell('F8').font = headerFont;
        worksheet.getCell('G8').font = headerFont;
        worksheet.getCell('C8').value = "STT";
        worksheet.getCell('D8').value = "Đồ quyên góp";
        worksheet.getCell('E8').value = "Hiện tại";
        worksheet.getCell('F8').value = "Đang cần";
        worksheet.getCell('G8').value = "Mức độ";

        // Count Current Donations
        var currentDonations = [];
        var currentPendingDonations = [];
        var activityCosts = [];
        var currentDonation;
        var currentPendingDonation;
        var activityCost;
        var current;

        for(var i = 0; i < requireData.length; i++) {
            current = 0;
            for(var j = 0; j < approvedDonations.length; j++) {
                if(approvedDonations[j].donationItem == requireData[i].item)
                    current += parseInt(approvedDonations[j].donationNumber);
            }

            worksheet.getCell('C' + (8 + i + 1)).value = i + 1;
            worksheet.getCell('D' + (8 + i + 1)).value = requireData[i].item;
            worksheet.getCell('E' + (8 + i + 1)).value = current;
            worksheet.getCell('F' + (8 + i + 1)).value = parseInt(requireData[i].quantity);
            worksheet.getCell('G' + (8 + i + 1)).value = parseFloat(parseInt(current)/parseInt(requireData[i].quantity));

            worksheet.getCell('E' + (8 + i + 1)).numFmt = '#,##0'
            worksheet.getCell('F' + (8 + i + 1)).numFmt = '#,##0';
            worksheet.getCell('G' + (8 + i + 1)).numFmt = '0.00%';            

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

        // Write Approved Donations Header
        var donationRow =  8 + requireData.length + 2;
        worksheet.getCell('C' + donationRow).font = title2Font;
        worksheet.getCell('C' + donationRow).value = "Danh sách quyên góp đã duyệt";
        worksheet.getCell('C' + (donationRow + 2)).font = headerFont;
        worksheet.getCell('D' + (donationRow + 2)).font = headerFont;
        worksheet.getCell('E' + (donationRow + 2)).font = headerFont;
        worksheet.getCell('F' + (donationRow + 2)).font = headerFont;
        worksheet.getCell('G' + (donationRow + 2)).font = headerFont;
        worksheet.getCell('C' + (donationRow + 2)).value = "STT";
        worksheet.getCell('D' + (donationRow + 2)).value = "Người góp";
        worksheet.getCell('E' + (donationRow + 2)).value = "Email";
        worksheet.getCell('F' + (donationRow + 2)).value = "Điện thoại";
        worksheet.getCell('G' + (donationRow + 2)).value = "Đồ góp";

        // Populate Donations        
        var donationString = "";
        for(var i = 0; i < approvedDonations.length; i++) {
            donationString = approvedDonations[i].donationItem + ": " + parseInt(approvedDonations[i].donationNumber).toLocaleString() + " (" + approvedDonations[i].donationUnit + ")";
            worksheet.getCell('C' + (donationRow + 3 + i)).value = i + 1;
            worksheet.getCell('D' + (donationRow + 3 + i)).value = approvedDonations[i].donatorName;
            worksheet.getCell('E' + (donationRow + 3 + i)).value = approvedDonations[i].donatorEmail;
            worksheet.getCell('F' + (donationRow + 3 + i)).value = approvedDonations[i].donatorPhoneNumber;
            worksheet.getCell('G' + (donationRow + 3 + i)).value = donationString;
        }

        // Populate Total Donations Pane
        worksheet.getCell('F' + (donationRow + 3 + approvedDonations.length)).value = "Tổng cộng";
        worksheet.getCell('F' + (donationRow + 3 + approvedDonations.length)).font = headerFont;
        for(var i = 0; i < currentDonations.length; i++) {
            donationString = currentDonations[i].item + ": " + parseInt(currentDonations[i].quantity).toLocaleString() + " (" + currentDonations[i].unit + ")";
            worksheet.getCell('G' + (donationRow + 3 + approvedDonations.length + i)).value = donationString;
        }

        // Write Pending Donations Header
        var donationRow =  donationRow + 3 + approvedDonations.length + currentDonations.length + 1;
        worksheet.getCell('C' + donationRow).font = title2Font;
        worksheet.getCell('C' + donationRow).value = "Danh sách quyên góp chưa duyệt";
        worksheet.getCell('C' + (donationRow + 2)).font = headerFont;
        worksheet.getCell('D' + (donationRow + 2)).font = headerFont;
        worksheet.getCell('E' + (donationRow + 2)).font = headerFont;
        worksheet.getCell('F' + (donationRow + 2)).font = headerFont;
        worksheet.getCell('G' + (donationRow + 2)).font = headerFont;
        worksheet.getCell('C' + (donationRow + 2)).value = "STT";
        worksheet.getCell('D' + (donationRow + 2)).value = "Người góp";
        worksheet.getCell('E' + (donationRow + 2)).value = "Email";
        worksheet.getCell('F' + (donationRow + 2)).value = "Điện thoại";
        worksheet.getCell('G' + (donationRow + 2)).value = "Đồ góp";

        // Populate Pending Donations        
        for(var i = 0; i < pendingDonations.length; i++) {
            donationString = pendingDonations[i].donationItem + ": " + parseInt(pendingDonations[i].donationNumber).toLocaleString() + " (" + pendingDonations[i].donationUnit + ")";
            worksheet.getCell('C' + (donationRow + 3 + i)).value = i + 1;
            worksheet.getCell('D' + (donationRow + 3 + i)).value = pendingDonations[i].donatorName;
            worksheet.getCell('E' + (donationRow + 3 + i)).value = pendingDonations[i].donatorEmail;
            worksheet.getCell('F' + (donationRow + 3 + i)).value = pendingDonations[i].donatorPhoneNumber;
            worksheet.getCell('G' + (donationRow + 3 + i)).value = donationString;
            for(var j = 0; j < currentPendingDonations.length; j++) {
                if(currentPendingDonations[j].item == pendingDonations[i].donationItem)
                    currentPendingDonations[j].quantity += parseInt(pendingDonations[i].donationNumber);
            }
        }

        // Populate Total Pending Donations Pane
        worksheet.getCell('F' + (donationRow + 3 + pendingDonations.length)).value = "Tổng cộng";
        worksheet.getCell('F' + (donationRow + 3 + pendingDonations.length)).font = headerFont;
        for(var i = 0; i < currentPendingDonations.length; i++) {
            donationString = currentPendingDonations[i].item + ": " + parseInt(currentPendingDonations[i].quantity).toLocaleString() + " (" + currentPendingDonations[i].unit + ")";
            worksheet.getCell('G' + (donationRow + 3 + pendingDonations.length + i)).value = donationString;
        }

        // Write Cost Header
        var donationRow =  donationRow + 3 + pendingDonations.length +  currentPendingDonations.length + 1;
        worksheet.getCell('C' + donationRow).font = title2Font;
        worksheet.getCell('C' + donationRow).value = "Danh sách chi phí";
        worksheet.getCell('C' + (donationRow + 2)).font = headerFont;
        worksheet.getCell('D' + (donationRow + 2)).font = headerFont;
        worksheet.getCell('E' + (donationRow + 2)).font = headerFont;
        worksheet.getCell('F' + (donationRow + 2)).font = headerFont;
        worksheet.getCell('G' + (donationRow + 2)).font = headerFont;
        worksheet.getCell('C' + (donationRow + 2)).value = "STT";
        worksheet.getCell('D' + (donationRow + 2)).value = "Ngày";
        worksheet.getCell('E' + (donationRow + 2)).value = "Hoạt động";
        worksheet.getCell('F' + (donationRow + 2)).value = "Địa điểm";
        worksheet.getCell('G' + (donationRow + 2)).value = "Chi phí";

        // Populate Cost
        var costString = "";
        var dateStart;
        for(var i = 0; i < costData.length; i++) {
            costString = "";
            for(var j = 0; j < costData[i].actualCost.length; j++) {
                if(j > 0)
                    costString += ', ';
                costString += costData[i].actualCost[j].item + ": " + parseInt(costData[i].actualCost[j].cost).toLocaleString() + ' (' + costData[i].actualCost[j].unit + ')';
            }
            dateStart = new Date(eventData.eventDate.split(' - ')[0]);
            worksheet.getCell('C' + (donationRow + 3 + i)).value = i + 1;
            worksheet.getCell('D' + (donationRow + 3 + i)).value = new Date(dateStart.setDate(dateStart.getDate() + (costData[i].day - 1))).toLocaleDateString();
            worksheet.getCell('E' + (donationRow + 3 + i)).value = costData[i].activity;
            worksheet.getCell('F' + (donationRow + 3 + i)).value = costData[i].place;
            worksheet.getCell('G' + (donationRow + 3 + i)).value = costString;
            for(var j = 0; j < activityCosts.length; j++) {
                for(var k = 0; k < costData[i].actualCost.length; k++) {
                    console.log(costData[i].actualCost[k]);
                    console.log(activityCosts[i].item)
                    if(activityCosts[j].item == costData[i].actualCost[k].item)
                        activityCosts[j].quantity = costData[i].actualCost[k].cost;
                }
            }
        }

        // Populate Total Cost
        worksheet.getCell('F' + (donationRow + 3 + costData.length)).value = "Tổng cộng";
        worksheet.getCell('F' + (donationRow + 3 + costData.length)).font = headerFont;
        for(var i = 0; i < activityCosts.length; i++) {
            donationString = activityCosts[i].item + ": " + parseInt(activityCosts[i].quantity).toLocaleString() + " (" + activityCosts[i].unit + ")";
            worksheet.getCell('G' + (donationRow + 3 + costData.length + i)).value = donationString;
        }

        // Write Remaining Header
        var donationRow =  donationRow + 3 + costData.length +  activityCosts.length + 1;
        worksheet.getCell('C' + donationRow).font = title2Font;
        worksheet.getCell('C' + donationRow).value = "Đồ quyên góp còn lại";
        worksheet.getCell('C' + (donationRow + 2)).font = headerFont;
        worksheet.getCell('D' + (donationRow + 2)).font = headerFont;
        worksheet.getCell('E' + (donationRow + 2)).font = headerFont;
        worksheet.getCell('C' + (donationRow + 2)).value = "STT";
        worksheet.getCell('D' + (donationRow + 2)).value = "Đồ góp";
        worksheet.getCell('E' + (donationRow + 2)).value = "Số lượng";

        // Populate Remaining
        var costString = "";
        var dateStart;
        for(var i = 0; i < currentDonations.length; i++) {
            costString = "";
            for(var j = 0; j < activityCosts.length; j++) {    
                if(currentDonations[i].item == activityCosts[j].item) {
                    costString += (parseInt(currentDonations[i].quantity) - parseInt(activityCosts[j].quantity)).toLocaleString() + ' (' + currentDonations[i].unit + ')'; 
                    worksheet.getCell('C' + (donationRow + 3 + i)).value = i + 1;
                    worksheet.getCell('D' + (donationRow + 3 + i)).value = currentDonations[i].item;
                    worksheet.getCell('E' + (donationRow + 3 + i)).value = costString;
                }
            }
        }


        // ===================================================================================

        // Add event infomation for sheet 2
        worksheet2.getCell('B2').font = titleFont;
        worksheet2.getCell('B2').value = eventData.eventName;
        worksheet2.getCell('B3').value = eventData.eventDate;
        worksheet2.getCell('B4').value = eventData.meetingAddress;

        // Write Require Donations Header
        worksheet2.getCell('C6').font = title2Font;
        worksheet2.getCell('C6').value = "Danh sách tình nguyện viên";
        worksheet2.getCell('C8').font = headerFont;
        worksheet2.getCell('D8').font = headerFont;
        worksheet2.getCell('E8').font = headerFont;
        worksheet2.getCell('F8').font = headerFont;
        worksheet2.getCell('G8').font = headerFont;
        worksheet2.getCell('H8').font = headerFont;
        worksheet2.getCell('C8').value = "STT";
        worksheet2.getCell('D8').value = "Username";
        worksheet2.getCell('E8').value = "Tên";
        worksheet2.getCell('F8').value = "Email";
        worksheet2.getCell('G8').value = "Điện thoại";
        worksheet2.getCell('H8').value = "Tình trạng";

        // Populate Participants
        var participateRow = 9;
        for(var i = 0; i < participantData.length; i++) {
            worksheet2.getCell('C' + (participateRow + i)).value = i + 1;
            worksheet2.getCell('D' + (participateRow + i)).value = participantData[i].username;
            worksheet2.getCell('E' + (participateRow + i)).value = participantData[i].fullName;
            worksheet2.getCell('F' + (participateRow + i)).value = participantData[i].email;
            worksheet2.getCell('G' + (participateRow + i)).value = participantData[i].phoneNumber;
            worksheet2.getCell('H' + (participateRow + i)).value = 'Có mặt';
        }

        var participateRow = participateRow + participantData.length;
        for(var i = 0; i < participantAbsentData.length; i++) {
            worksheet2.getCell('C' + (participateRow + i)).value = i + 1;
            worksheet2.getCell('D' + (participateRow + i)).value = participantAbsentData[i].username;
            worksheet2.getCell('E' + (participateRow + i)).value = participantAbsentData[i].fullName;
            worksheet2.getCell('F' + (participateRow + i)).value = participantAbsentData[i].email;
            worksheet2.getCell('G' + (participateRow + i)).value = participantAbsentData[i].phoneNumber;
            worksheet2.getCell('H' + (participateRow + i)).value = 'Vắng mặt';
        }

        // Populate Total Participants
        var participateRow = participateRow + participantAbsentData.length;
        worksheet2.getCell('F' + (participateRow)).value = "Tổng cộng";
        worksheet2.getCell('F' + (participateRow)).font = headerFont;
        worksheet2.getCell('G' + (participateRow)).value = "Có mặt";
        worksheet2.getCell('G' + (participateRow + 1)).value = "Vắng mặt";
        worksheet2.getCell('H' + (participateRow)).value = participantData.length;
        worksheet2.getCell('H' + (participateRow + 1)).value = participantAbsentData.length;

        // ===================================================================================

        // Add event infomation for sheet 3
        worksheet3.getCell('B2').font = titleFont;
        worksheet3.getCell('B2').value = eventData.eventName;
        worksheet3.getCell('B3').value = eventData.eventDate;
        worksheet3.getCell('B4').value = eventData.meetingAddress;

        // Write Require Donations Header
        worksheet3.getCell('C6').font = title2Font;
        worksheet3.getCell('C6').value = "Danh sách tài trợ";
        worksheet3.getCell('C8').font = headerFont;
        worksheet3.getCell('D8').font = headerFont;
        worksheet3.getCell('E8').font = headerFont;
        worksheet3.getCell('F8').font = headerFont;
        worksheet3.getCell('G8').font = headerFont;
        worksheet3.getCell('C8').value = "STT";
        worksheet3.getCell('D8').value = "Tổ chức";
        worksheet3.getCell('E8').value = "Email";
        worksheet3.getCell('F8').value = "Điện thoại";
        worksheet3.getCell('G8').value = "Đóng góp";

        // Populate Cost
        var sponsorRow = 9;
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

            console.log(donationCollection);
            donationString = "";
            for(var j = 0; j < donationCollection.length; j++) {
                if(j > 0)
                    donationString += ', ';
                donationString += donationCollection[j].item + ': ' + parseInt(donationCollection[j].quantity).toLocaleString() + ' (' + donationCollection[j].unit + ')';
            }

            worksheet3.getCell('C' + (sponsorRow + i)).value = i + 1;
            worksheet3.getCell('D' + (sponsorRow + i)).value = sponsorData[i].companyName;
            worksheet3.getCell('E' + (sponsorRow + i)).value = sponsorData[i].companyEmail;
            worksheet3.getCell('F' + (sponsorRow + i)).value = sponsorData[i].companyPhoneNumber;
            worksheet3.getCell('G' + (sponsorRow + i)).value = donationString;
        }

        // Write to a file
        workbook.xlsx.writeFile("public/files/CCMA-Report-" + eventData.eventName + ".xlsx").then(function() {
            res.send({msg: '', link: "/files/CCMA-Report-" + eventData.eventName + ".xlsx"});
        });
    });
});


/* GET event listing. */
router.get('/', function(req, res, next) {
    var userId = req.cookies.user; 
    if(userId != '' && userId != null) {
        var db = req.db;
        var collection = db.get('Users');
        collection.findOne({'_id': userId},function(e,docs){
            collection = db.get('Events');
            if(docs.role == "Producer" || docs.role == "Admin") {
                res.render('admin_page/event_list', { title: 'Event Manager' });
            } else {
                res.render('page_404', { title: 'Error 404: Page Not Found' });
            }            
        });
    } else {
        res.render('page_404', { title: 'Error 404: Page Not Found' });
    }     
});

/* GET event listing. */
router.get('/list', function(req, res, next) {
  res.render('events/event_list_user', { title: 'Events' });
});

/* GET event creator page. */
router.get('/creator_event', function(req, res, next) {
    var userId = req.cookies.user; 
    if(userId != '' && userId != null) {
        var db = req.db;
        var collection = db.get('Users');
        collection.findOne({'_id': userId},function(e,docs){
            collection = db.get('Events');
            if(docs.role == "Producer") {
                var docs = {
                    '_id' : '',
                    'eventName' : '',
                    'eventDescription' : '',
                    'eventDate' : '',
                    'eventDeadline' : '',
                    'volunteersNeeded' : '',
                    'meetingTime' : '',
                    'meetingAddress' : '',
                    'meetingAddressLat' : '',
                    'meetingAddressLng' : '',
                    'eventImage' : ''
                }
                res.render('producer_page/event_creator', { title: 'Event Creator', 'docs': docs });
            } else {
                res.render('page_404', { title: 'Error 404: Page Not Found' });
            }            
        });
    } else {
        res.render('page_404', { title: 'Error 404: Page Not Found' });
    }
});

/* GET activity creator page. */
router.get('/creator_activity', function(req, res, next) {
    var userId = req.cookies.user; 
    if(userId != '' && userId != null) {
        var db = req.db;
        var collection = db.get('Users');
        collection.findOne({'_id': userId},function(e,docs){
            collection = db.get('Events');
            if(docs.role == "Producer") {
                var docs = {
                    '_id' : ''
                }
                res.render('producer_page/activity_creator', { title: 'Activity Creator' , 'docs': docs});
            } else {
                res.render('page_404', { title: 'Error 404: Page Not Found' });
            }            
        });
    } else {
        res.render('page_404', { title: 'Error 404: Page Not Found' });
    }    
});

/* GET event preview page. */
router.get('/creator_preview', function(req, res, next) {
    var userId = req.cookies.user; 
    if(userId != '' && userId != null) {
        var db = req.db;
        var collection = db.get('Users');
        collection.findOne({'_id': userId},function(e,docs){
            collection = db.get('Events');
            if(docs.role == "Producer") {
                res.render('producer_page/event_preview', { title: 'Event Preview' });
            } else {
                res.render('page_404', { title: 'Error 404: Page Not Found' });
            }            
        });
    } else {
        res.render('page_404', { title: 'Error 404: Page Not Found' });
    }   
});

/* GET number of event by userid. */
router.get('/numberofevent/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Events');    
    collection.find({ 'userId': req.params.id }, {}, function(e,docs){
        res.json(docs.length);
    });
});

/* GET event edit page. */
router.get('/edit/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Events');
    if(req.params.id.length != 24)
        res.render('page_404');
    collection.findOne({ '_id' : req.params.id },{},function(e,docs){
        console.log(docs);
        if(docs) {
            res.render('producer_page/event_creator', { title: 'Edit Event', 'docs': docs });
        } else {
            res.render('page_404');
        }
    });
});

/* GET activities edit page. */
router.get('/edit_activities/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Events');
    if(req.params.id.length != 24)
        res.render('page_404');
    collection.findOne({ '_id' : req.params.id },{},function(e,docs){
        console.log(docs);
        if(docs) {
            res.render('producer_page/activity_creator', { title: 'Edit Event Activities', 'docs': docs });
        } else {
            res.render('page_404');
        }
    });
});

/* GET event update page. */
router.get('/update/:id', function(req, res, next) {
    var db = req.db;
    var userId = req.cookies.user; 
    var collection = db.get('Events');
    if(req.params.id.length != 24)
        res.render('page_404');
    collection.findOne({ '_id' : req.params.id },{},function(e,docs){
        if(docs.userId == userId) {
            res.render('producer_page/update_event', { title: 'Charity Event | Updating ' + docs.eventName, 'docs': docs });
        } else {
            res.render('page_404');
        }
    });
});

/* POST new event. */
router.post('/addevent', uploading.single('displayEventImage'), function(req, res) {    
    req.body.dateCreated = new Date().toString();
    req.body.dateModified = new Date().toString();
    var user = req.cookies.user;
    if(user != null) {

        var db = req.db;
        var collection = db.get('Users');

        collection.findOne({'_id': new ObjectId(user)},{},function(e,docs){
            var username = docs.username;        
            if(req.body._id == "") {
                req.body.status = "Draft";
                if(req.file != null) {
                    var extension = req.file.mimetype.split("/")[1];
                    var path = "/images/event/" + req.file.filename + "." + extension;
                    var savePath = "public" + path;                

                    delete req.body._id;

                    req.body.eventImage = path;

                    fs.readFile(req.file.path, function (err, data) {
                        fs.writeFile(savePath, data);
                    });

                    collection = db.get('Events');
                
                    collection.insert(req.body, function(err, result){
                        if(err === null) {                        
                            res.cookie('eventId',result._id.toString(), { maxAge: 90000000000, httpOnly: false });
                            res.writeHead(302, {
                              'Location': '/events/creator_activity',
                              'eventId': result._id
                            });
                            res.end();
                        } else {
                            res.send({msg: err});
                        }
                    });
                }                    
            } else {
                if(req.file != null) {
                    var extension = req.file.mimetype.split("/")[1];
                    var path = "/images/event/" + req.file.filename + "." + extension;
                    var savePath = "public" + path;                

                    req.body.eventImage = path;

                    fs.readFile(req.file.path, function (err, data) {
                        fs.writeFile(savePath, data);
                    });
                } else {
                    delete req.body.eventImage;
                }

                collection = db.get('Events');
                
                collection.update({'_id': req.body._id}, { $set: req.body}, function(err, result){
                    if(err === null) {                             
                        res.writeHead(302, {'Location': '/events/edit_activities/' + req.body._id});
                        res.end();
                    }
                });
            }                
        });
    }                    
});


/* POST photo gallery. */
router.post('/addphoto', function(req, res) {
    photoGalleryUpload(req,res,function(err) {        
        if(err) {
            return res.end("Error uploading file.");
        } else {            
            console.log(req.body);
            console.log(req.files);
            var images;
            var path = "";
            var eventId = req.body.eventId;
            var db = req.db;
            var collection = db.get('Gallery');
            for(var i = 0; i < req.files.length; i++) {
                images = {
                    'eventId' : eventId,
                    'image' : "/images/event/" + req.files[i].filename,
                    'dateCreated' : new Date()
                };
                collection.insert(images, function(error, inserted) {
                    if(error)
                        return res.end("Error with database.");
                });
            }
            res.writeHead(302, {'Location': '/events/update/' + eventId});
            res.end();        
        }        
    });                
});

/* GET gallery from eventId. */
router.get('/photo/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Gallery');
    collection.find({eventId: req.params.id},{sort: {datefield: 1}},function(e,docs){
        res.json(docs);
    });
});

/* DELETE Photo gallery by ID. */
router.delete('/removephoto/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('Gallery');
    collection.findOne({_id: req.params.id},function(e,docs){
        if(docs) {
            try {
                fs.unlink("public" + docs.image);
            }
            catch(err) {
                console.log(err);
            }
            collection.remove({ '_id' : req.params.id }, function(err) {
                res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
            });
        }
    });    
});


/* POST finish drafted event. */
router.post('/finishevent/:id', function(req, res) {    
    console.log(req.body);
    var db = req.db;
    var collection = db.get('Events');

    collection.update({ '_id' :  new ObjectId(req.params.id)}, { $set: req.body}, function(err) {
        if(err === null) {
            res.send({msg: ''});
        } else {
            res.send({msg: err});
        }
    });
    
});

/* POST new activities. */
router.post('/addactivity', function(req, res) {
    var db = req.db;
    var collection = db.get('Activities');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/* GET all events. */
router.get('/all', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Events');
    collection.find({'status': 'Published'},{sort: {eventDate: -1}},function(e,docs){
        res.json(docs);
    });
});

/* GET all events. */
router.get('/alllist', function(req, res, next) {
    var userId = req.cookies.user; 
    if(userId != '' && userId != null) {
        var db = req.db;
        var collection = db.get('Users');
        collection.findOne({'_id': userId},function(e,docs){
            collection = db.get('Events');
            if(docs.role == "Producer") {
                collection.find({'userId': userId},function(e,docs2){
                    res.json(docs2);
                });    
            } else if(docs.role == "Admin") {
                collection.find({},function(e,docs2){
                    res.json(docs2);
                });    
            } else {
                res.render('page_404');
            }            
        });
    } else {
        res.render('page_404');
    }    
});

/* GET all nearby. */
router.get('/nearby/:lat/:lng', function(req, res, next) {
    var db = req.db;
    var myLat = parseFloat(req.params.lat);
    var myLng = parseFloat(req.params.lng);
    console.log("START");
    var collection = db.get('Events');
    collection.find({'status': 'Published'},function(e,docs){
        console.log("HEY");
        var availableEvents = [];
        var pastEvents = [];
        var distance = 0;
        var now = new Date().getTime();
        for(var i = 0; i < docs.length; i++) {
            lat = parseFloat(docs[i].meetingAddressLat);
            lng = parseFloat(docs[i].meetingAddressLng);
            console.log("LAT: " + lat);
            console.log("LAT: " + myLat);
            distance = Math.sqrt(Math.pow(myLat - lat, 2) + Math.pow(myLng - lng, 2));
            console.log("DISTANCE: " + distance);
            docs[i].distance = distance;
            date = new Date(docs[i].eventDeadline).getTime();
            console.log("TIME: " + date);
            if(now < date)
                availableEvents.push(docs[i]);
            else
                pastEvents.push(docs[i]);
        }

        console.log("SORT");
        availableEvents.sort(function(a, b) {
            return parseFloat(a.distance) - parseFloat(b.distance);
        });
        pastEvents.sort(function(a, b) {
            return parseFloat(a.distance) - parseFloat(b.distance);
        });
        console.log("SORTED");
        var result = [];        
        for(var i = 0; i < availableEvents.length; i++) {
            result.push(availableEvents[i]);
            console.log("PUSH");
        }
        for(var i = 0; i < pastEvents.length; i++) {
            result.push(pastEvents[i]);
            console.log("PUSH");
        }
        res.json(result);
    });
});


/* GET all activities from eventId. */
router.get('/activities/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Activities');
    collection.find({ 'eventId' : req.params.id },{sort: {day: 1}},function(e,docs){
        res.json(docs);
    });
});

/* GET all activities by its id. */
router.get('/activities/id/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Activities');
    collection.findOne({ '_id' : req.params.id },{},function(e,docs){
        res.json(docs);
    });
});

/* GET event detail PAGE base on id. */
router.get('/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Events');
    if(req.params.id.length != 24)
        res.render('page_404');
    collection.findOne({ '_id' : req.params.id },{},function(e,docs){
        if(docs) {
            res.render('guest_page/event_details', { title: 'Charity Event | ' + docs.eventName, 'docs': docs });
        } else {
            res.render('page_404');
        }
    });
});

/*  PUT To Update Activity */
router.put('/updateactivity/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('Activities');
    collection.update({ '_id' : req.params.id }, { $set: req.body}, function(err) {
        res.send((err === null) ? { msg: ''} : { msg:'error: ' + err});
    });
});

/* DELETE activities by its id. */
router.delete('/removeactivitiesbyid/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('Activities');
    collection.remove({ '_id' : req.params.id }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/* DELETE all activities by eventId. */
router.delete('/removeactivities/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('Activities');
    collection.remove({ 'eventId' : req.params.id }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/* POST new sponsor. */
router.post('/addsponsor', function(req, res) {
    var db = req.db;
    var collection = db.get('EventSponsored');
    collection.findOne({ 
        'eventId' : req.body.eventId,
        'userId' : req.body.userId
    },{},function(e,docs){
        if(!docs) {
            collection.insert(req.body, function(err, result){
                res.send(
                    (err === null) ? { msg: '' } : { msg: err }
                );
            });
        } else {
            res.send((e === null) ? { msg: ''} : { msg:'error: ' + e});
        }
    });    
});

/* GET to check if user has donated to the event */
router.get('/checksponsor/:eventId/:userId', function(req, res, next) {
    var db = req.db;
    var collection = db.get('EventSponsored');
    collection.findOne({ 
        'eventId' : req.params.eventId,
        'userId' : req.params.userId
    },{},function(e,docs){
        res.json(docs);
    });
});

/* GET all approved sponsor from eventId */
router.get('/sponsor/:eventId', function(req, res, next) {
    var db = req.db;
    var collection = db.get('EventSponsored');
    collection.find({
        'eventId' : req.params.eventId,
        'status': {'$ne': 'Pending'}
    },{sort: {datefield: 1}},function(e,docs){
        res.json(docs);
    });
});

/* GET all sponsor from eventId */
router.get('/allsponsor/:eventId', function(req, res, next) {
    var db = req.db;
    var collection = db.get('EventSponsored');
    collection.find({
        'eventId' : req.params.eventId
    },{sort: {datefield: 1}},function(e,docs){
        res.json(docs);
    });
});

/* GET all FEATURED sponsor from eventId */
router.get('/featuredsponsor/:eventId', function(req, res, next) {
    var db = req.db;
    var collection = db.get('EventSponsored');
    collection.find({
        'eventId' : req.params.eventId,
        $or: [{'status' : 'Featured'},{'status' : 'Approved'}]
    },{sort: {datefield: 1}},function(e,docs){
        res.json(docs);
    });
});

/* GET sponsor by id */
router.get('/sponsor/id/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('EventSponsored');
    collection.findOne({'_id' : req.params.id},{},function(e,docs){
        res.json(docs);
    });
});

/*  PUT To Update Sponsor Status */
router.put('/updatesponsor/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('EventSponsored');
    collection.update({ '_id' : req.params.id}, { $set: req.body}, function(err) {
        res.send((err === null) ? { msg: ''} : { msg:'error: ' + err});
    });
});

/* DELETE to Delete Donation. */
router.delete('/removesponsor/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('EventSponsored');
    collection.findOne({ '_id' : req.params.id }, function(err, doc) {
        var id = doc.userId;
        collection.remove({ '_id' : req.params.id }, function(err) {
            res.send((err === null) ? { msg: '', id: id } : { msg:'error: ' + err });
        });
    });    
});

/* GET event detail DATA base on id. */
router.get('/details/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Events');
    if(req.params.id.length != 24)
        res.render('page_404');
    collection.findOne({ '_id' : req.params.id },{},function(e,docs){
        res.json(docs);
    });
});

/* POST new donation require. */
router.post('/adddonationrequire', function(req, res) {
    var db = req.db;
    var collection = db.get('RequiredDonations');
    collection.insert(req.body, function(err, result){                
        res.send(
            (err === null) ? { msg: ''} : { msg: err, 'message': 'An error occured. Please try again.' }
        );
    });
});

/* PUT to edit donation require. */
router.put('/editdonationrequire/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('RequiredDonations');
    collection.update({ '_id' : req.params.id }, { $set: req.body}, function(err){                
        res.send(
            (err === null) ? { msg: ''} : { msg: err, 'message': 'An error occured. Please try again.' }
        );
    });
});

/* GET donations require base on eventid. */
router.get('/donationrequire/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('RequiredDonations');
    if(req.params.id.length != 24)
        res.render('page_404');    
    collection.find({ 'eventId' : req.params.id },{},function(e,docs){
        res.json(docs);
    });
});

/* GET donations require base on id. */
router.get('/donationrequire/id/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('RequiredDonations');
    if(req.params.id.length != 24)
        res.render('page_404');    
    collection.findOne({ '_id' : req.params.id },{},function(e,docs){
        res.json(docs);
    });
});

/* GET donations require base on eventid. */
router.get('/donationrequirebyname/:eventId/:name', function(req, res, next) {
    var db = req.db;
    var collection = db.get('RequiredDonations');
    collection.findOne({ 
        'item' : req.params.name,
        'eventId' : req.params.eventId
    },{},function(e,docs){
        res.json(docs);
    });
});

/* DELETE to Delete Requried Donation. */
router.delete('/deleterequireddonation/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('RequiredDonations');
    collection.remove({ '_id' : req.params.id }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});


/* GET donation base on id. */
router.get('/donations/id/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Donations');
    if(req.params.id.length != 24)
        res.render('page_404');    
    collection.findOne({ '_id' : req.params.id },{},function(e,docs){
        res.json(docs);
    });
});

/* GET event donations base on eventId. */
router.get('/donations/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Donations');
    if(req.params.id.length != 24)
        res.render('page_404');    
    collection.find({ 'eventId' : req.params.id },function(e,docs){
        res.json(docs);
    });
});

/* POST new donation. */
router.post('/adddonation', function(req, res) {
    var db = req.db;
    var collection = db.get('Donations');
    collection.insert(req.body, function(err, result){                
        res.send(
            (err === null) ? { msg: ''} : { msg: err, 'message': 'An error occured. Please try again.' }
        );
    });
});

/*  PUT To Update Donation */
router.put('/updatedonation/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('Donations');
    collection.update({ '_id' : req.params.id }, { $set: req.body}, function(err) {
        res.send((err === null) ? { msg: '', 'message' : 'Saved successfully.'  } : { msg:'error: ' + err, 'message': 'An error occured. Please try again.' });
    });
});

/* DELETE to Delete Donation. */
router.delete('/deletedonation/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('Donations');
    collection.remove({ '_id' : req.params.id }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/*  PUT To Update Event */
router.put('/updateevent/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('Events');
    collection.update({ '_id' : req.params.id }, { $set: req.body}, function(err) {
        res.send((err === null) ? { msg: '', 'message' : 'Saved successfully.'  } : { msg:'error: ' + err, 'message': 'An error occured. Please try again.' });
    });
});

/* POST new participant. */
router.post('/addparticipant', function(req, res) {
    var db = req.db;
    var collection = db.get('EventJoined');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/* DELETE participant. */
router.delete('/removeparticipant/:eventId/:userId', function(req, res) {
    var db = req.db;
    var collection = db.get('EventJoined');
    collection.remove({ 
        'eventId' : req.params.eventId,
        'userId' : req.params.userId
    }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg: err });
    });
});

/* GET participant based on eventId. */
router.get('/participants/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('EventJoined');
    collection.find({'eventId': req.params.id},{},function(e,docs){        
        res.json(docs);
    });
});

/* GET number of participant based on eventId. */
router.get('/participantsnumber/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('EventJoined');
    collection.find({
        'eventId': req.params.id,
        'status': 'Present'
    },{}, function(e,docs){
        res.json(docs.length);
    });
});

/* GET participant based on userId. */
router.get('/getparticipatedevents/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('EventJoined');
    collection.find({'userId': req.params.id},{},function(e,docs){        
        res.json(docs);
    });
});

/* GET participant based on userId. */
router.get('/getparticipantbyid/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('EventJoined');
    collection.find({'_id': req.params.id},{},function(e,docs){        
        res.json(docs);
    });
});

/* GET participant based on eventId and userId. */
router.get('/participants/:eventId/:userId', function(req, res, next) {
    var db = req.db;
    var collection = db.get('EventJoined');
    collection.findOne({
        'eventId': req.params.eventId,
        'userId': req.params.userId,
    },{},function(e,docs){        
        res.send(
            (docs) ? {msg: 'true'} : {msg: 'false'}
        );
    });
});

/* DELETE to Delete Participant. */
router.delete('/deleteparticipant/:eventId/:userId', function(req, res) {
    var db = req.db;
    var collection = db.get('EventJoined');
    collection.remove({ 
        'eventId' : req.params.eventid,
        'userId' : req.params.userId
    }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/*  PUT To Update Participant */
router.put('/updateparticipant/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('EventJoined');
    collection.update({'_id': req.params.id}, { $set: req.body}, function(err) {
        res.send((err === null) ? { msg: ''  } : { msg:'error: ' + err });
    });
});

/* GET events by user. */
router.get('/producedevents/:userId', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Events');
    collection.find({'userId': req.params.userId},{},function(e,docs){        
        res.json(docs);
    });
});

/* GET sponsored events by user. */
router.get('/sponsoredevents/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('EventSponsored');
    collection.find({
        'userId': req.params.id,
        'status': {'$ne': 'Pending'}
    },{},function(e,docs){        
        console.log(docs);
        collection = db.get('Events');
        var data = [];
        var dataId = [];
        for(var i = 0; i < docs.length; i++) {
            dataId[i] = new ObjectId(docs[i].eventId);
        }   
        console.log(dataId);
        collection.find({ '_id': {$in: dataId}},{},function(e,eventDocs){
            res.json(eventDocs);
        });
    });
});

/* GET number of sponsor based on eventId. */
router.get('/sponsornumber/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('EventSponsored');
    collection.find({
        'eventId': req.params.id,
        'status': {'$ne': 'Pending'}
    },{}, function(e,docs){
        res.json(docs.length);
    });
});

/* GET number of event sponsored based on userId. */
router.get('/sponsoredbyuser/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('EventSponsored');
    collection.find({
        'userId': req.params.id,
        'status': {'$ne': 'Pending'}
    },{}, function(e,docs){
        res.json(docs.length);
    });
});

/* GET number of event created based on userId. */
router.get('/createdbyuser/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Events');
    collection.find({
        'userId': req.params.id,
        'status': 'Published'
    },{}, function(e,docs){
        res.json(docs.length);
    });
}); 

module.exports = router;