var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('user_list', { title: 'Users Manager' });
});

/* GET all users. */
router.get('/all', function(req, res, next) {
	var db = req.db;
    var collection = db.get('Users');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/* GET user by id. */
router.get('/id/:id', function(req, res, next) {
	var db = req.db;
    var collection = db.get('Users');
    var userId = req.params.id;
    collection.findOne({'_id': userId},{},function(e,docs){
        res.json(docs);
    });
});

/* GET user by role. */
router.get('/role/:role', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Users');
    var userRole = req.params.role;
    collection.findOne({'role': userRole},{},function(e,docs){
        res.json(docs);
    });
});

/* POST new user. */
router.post('/adduser', function(req, res) {
    var db = req.db;
    var collection = db.get('Users');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/* DELETE to deleteuser. */
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('Users');
    var userToDelete = req.params.id;
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/*  PUT To Update User */
router.put('/updateuser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('Users');
    var userToUpdate = req.params.id;    
    collection.update({ '_id' : userToUpdate }, { $set: req.body}, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
