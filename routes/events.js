var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');

var download = function(uri, filename, callback){
    console.log("Download");
    request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

/* GET event listing. */
router.get('/', function(req, res, next) {
  res.render('events/event_list', { title: 'Event Manager' });
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

/* POST new event. */
router.post('/addevent', function(req, res) {
    var db = req.db;
    var collection = db.get('Events');
    download(req.body.imageSrc, req.body.imageName, function(){
        console.log('done');
    });
    delete req.body.imageSrc;
    delete req.body.imageName;
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '', '_id': result._id } : { msg: err }
        );
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
            } else {
                res.render('page_404');
            }
        });
    } else {
        res.render('page_404');
    }
});

/* GET all activities from eventId. */
router.get('/activities/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Activities');
    collection.find({ 'eventId' : req.params.id },{},function(e,docs){
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

module.exports = router;