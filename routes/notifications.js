var express = require('express');
var router = express.Router();

/* GET notification by userId. */
router.get('/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Notifications');
    collection.find({'userId': req.params.id},{sort: {dateCreated: -1}},function(e,docs){
        res.json(docs);
    });
});

/* POST new notification. */
router.post('/addnotification', function(req, res) {
    var db = req.db;
    var collection = db.get('Notifications');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: ''} : { msg: err }
        );
    });
});

/*  PUT To Update Notifications by userId */
router.put('/markread/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('Notifications');
    collection.update({ 'userId' : req.params.id }, { $set: req.body}, {multi:true}, function(err) {
        res.send((err === null) ? { msg: ''} : { msg:'error: ' + err});
    });
});

module.exports = router;
    