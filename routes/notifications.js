var express = require('express');
var router = express.Router();

/* GET notification by userId. */
router.get('/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Notifications');
    collection.findOne({'role': req.params.id},{},function(e,docs){
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

module.exports = router;
    