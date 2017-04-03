var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;

/*  POST To update rating */
router.post('/updaterating', function(req, res) { 
    var db = req.db;
    var collection = db.get('Ratings');
    collection.update({
        'userId': req.body.userId,
        'subjectId': req.body.subjectId
    },req.body,{upsert: true}, function(err, result){
        res.send(
            (err === null) ? { msg: ''} : { msg: err }
        );
    });
});

/* GET rating by subjectId. */
router.get('/id/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Ratings');    
    collection.find({ 'subjectId' : req.params.id },{},function(e,docs){
        var rating = 0;        
        for(var i = 0; i < docs.length; i++) {
            rating += parseInt(docs[i].ratingPoint);
        }
        res.json(rating);
    });
});

/* GET general rating by subjectId. */
router.get('/general/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Ratings');    
    console.log("START");
    collection.find({ 'subjectId' : req.params.id },{},function(e,docs){
        console.log("1");
        var rating = 0;        
        console.log(docs);
        if(docs.length > 0) {
            for(var i = 0; i < docs.length; i++) {
                rating += parseInt(docs[i].ratingPoint);
                console.log(docs[i].ratingPoint);
            }
            rating = {
                'ratingPoint': parseFloat(rating / parseInt(docs.length)),
                'count': docs.length
            };
            res.json(rating);
        } else {
            rating = {
                'ratingPoint': 0,
                'count': 0
            };
            res.json(rating);
        }                
    });
});

/* GET rating for subjectId by userId. */
router.get('/id/:subjectId/:userId', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Ratings');    
    collection.findOne({ 
        'subjectId' : req.params.subjectId,
        'userId' : req.params.userId        
    },{},function(e,docs){
        res.json(docs);
    });
});

module.exports = router;