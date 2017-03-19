var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var request = require('request');
var ObjectId = require('mongodb').ObjectID;

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


/* GET event listing. */
router.get('/', function(req, res, next) {
  res.render('events/event_list', { title: 'Event Manager' });
});

/* GET event listing. */
router.get('/list', function(req, res, next) {
  res.render('events/event_list_user', { title: 'Events' });
});

/* GET event creator page. */
router.get('/creator_event', function(req, res, next) {
  res.render('events/event_creator', { title: 'Event Creator' });
});

/* GET activity creator page. */
router.get('/creator_activity', function(req, res, next) {
  res.render('events/activity_creator', { title: 'Activity Creator' });
});

/* GET event preview page. */
router.get('/creator_preview', function(req, res, next) {
  res.render('events/event_preview', { title: 'Event Preview' });
});

/* GET event update page. */
router.get('/update/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Events');
    if(req.params.id.length != 24)
        res.render('page_404');
    collection.findOne({ '_id' : req.params.id },{},function(e,docs){
        if(docs) {
            res.render('events/update_event', { title: 'Charity Event | Updating ' + docs.eventName, 'docs': docs });
        } else {
            res.render('page_404');
        }
    });
});

/* POST new event. */
router.post('/addevent', uploading.single('displayEventImage'), function(req, res) {
    console.log(req.file);
    console.log(req.body);

    req.body.status = "Draft";
    req.body.dateCreated = new Date().toString();
    req.body.dateModified = new Date().toString();
    var user = req.cookies.user;
    if(user != null) {

        var db = req.db;
        var collection = db.get('Users');

        collection.findOne({'_id': new ObjectId(user)},{},function(e,docs){
            var username = docs.username;
            if(req.file != null) {
                var extension = req.file.mimetype.split("/")[1];
                var path = "/images/event/" + req.file.filename + "." + extension;
                var savePath = "public" + path;

                req.body.eventImage = path;

                fs.readFile(req.file.path, function (err, data) {
                    fs.writeFile(savePath, data);
                });

                collection = db.get('Events');
                
                collection.insert(req.body, function(err, result){
                    if(err === null) {                        
                        res.cookie('eventId',result._id.toString(), { maxAge: 900000, httpOnly: false });
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
        });
    }                    
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
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/* GET all activities from eventId. */
router.get('/activities/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Activities');
    collection.find({ 'eventId' : req.params.id },{},function(e,docs){
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
            res.render('events/event_details', { title: 'Charity Event | ' + docs.eventName, 'docs': docs });
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
            res.send((err === null) ? { msg: ''} : { msg:'error: ' + err});
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

/* GET all sponsor from eventId */
router.get('/sponsor/:eventId', function(req, res, next) {
    var db = req.db;
    var collection = db.get('EventSponsored');
    collection.find({'eventId' : req.params.eventId},{sort: {dateCreated: -1}},function(e,docs){
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
    },{sort: {dateCreated: -1}},function(e,docs){
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
    collection.remove({ '_id' : req.params.id }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/* GET event detail DATA base on id. */
router.get('/details/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Events');
    if(req.params.id.length != 24)
        res.render('page_404');
    collection.findOne({ '_id' : req.params.id },{},function(e,docs){
        if(docs) {
            res.json(docs);
        } else {
            res.render('page_404');
        }
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

/* GET donations require base on eventid. */
router.get('/donationrequire/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('RequiredDonations');
    if(req.params.id.length != 24)
        res.render('page_404');    
    collection.find({ 'eventId' : req.params.id },{},function(e,docs){
        if(docs) {
            res.json(docs);
        } else {
            res.render('page_404');
        }
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
        if(docs) {
            res.json(docs);
        } else {
            res.render('page_404');
        }
    });
});


/* GET donation base on id. */
router.get('/donations/id/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Donations');
    if(req.params.id.length != 24)
        res.render('page_404');    
    collection.findOne({ '_id' : req.params.id },{},function(e,docs){
        if(docs) {
            res.json(docs);
        } else {
            res.render('page_404');
        }
    });
});

/* GET event donations base on id. */
router.get('/donations/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Donations');
    if(req.params.id.length != 24)
        res.render('page_404');    
    collection.find({ 'eventId' : req.params.id },{sort: {dateCreated: -1}},function(e,docs){
        if(docs) {
            res.json(docs);
        } else {
            res.render('page_404');
        }
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


/* GET events based on userId. */
router.get('/all', function(req, res, next) {
    var user = req.cookies.username;
    var user = req.cookies.username;
    if(user != null) {        
        var db = req.db;
        var collection = db.get('Users');
        collection.findOne({'username': user},{},function(e,docs){
            if(docs.role == "Admin") {
                collection = db.get('Events');
                collection.find({},{},function(e,docs){
                    res.json(docs);
                });
            } else if(docs.role == "Producer") {
                collection = db.get('Events');
                collection.find({ 'user': docs.username },{},function(e,docs){
                    res.json(docs);
                });
            } else {
                res.render('page_404');
            }
        });
    } else {
        res.render('page_404');
    }
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
    collection.count({
        'eventId': req.params.id,
        'status': 'Present'
    },{}, function(e,docs){
        res.json(docs);
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
    collection.count({
        'eventId': req.params.id,
        'status': {'$ne': 'Pending'}
    },{}, function(e,docs){
        res.json(docs);
    });
});

/* GET number of event sponsored based on userId. */
router.get('/sponsoredbyuser/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('EventSponsored');
    collection.count({
        'userId': req.params.id,
        'status': {'$ne': 'Pending'}
    },{}, function(e,docs){
        res.json(docs);
    });
});

/* GET number of event created based on userId. */
router.get('/createdbyuser/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Events');
    collection.count({
        'userId': req.params.id,
        'status': 'Published'
    },{}, function(e,docs){
        res.json(docs);
    });
});

module.exports = router;