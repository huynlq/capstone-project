var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');

var uploading = multer({
    dest: __dirname + '/public/user/',
    limits: {fileSize: 10000000, files:1},
});

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

/* GET user role. */
router.get('/getrole/:user', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Users');
    collection.findOne({'username': req.params.user},{},function(e,docs){
        res.send({ 'role' : docs.role });
    });
});

/* GET user role by id. */
router.get('/getrolebyid/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Users');
    collection.findOne({'_id': req.params.id},{},function(e,docs){
        res.send({ 'role' : docs.role });
    });
});

/*  POST To Update User */
router.post('/updateuserimage', uploading.any(), function(req, res) { 
    var user = req.cookies.user;
    if(user != null && req.file != null) {
        if(req.file[0] != null) {
            fs.readFile(req.files[0].path, function (err, data) {
                var db = req.db;
                var collection = db.get('Users');
                collection.findOne({'_id': user},{},function(e,docs){
                    var newPath = "public" + docs.image;
                    fs.writeFile(newPath, data, function (err) {
                        res.render('my_user_page');
                    });
                });
            });    
        } else {
            res.render('my_user_page', { 'title': 'Charity Event | My User Page', 'uploadError': 'An error occured with your picture upload. Please try again.' });
        }
    } else {
        res.render('my_user_page', { 'title': 'Charity Event | My User Page', 'uploadError': 'An error occured with your picture upload. Please try again.' });
    }
});

/*  POST To Update User */
router.post('/updatecompanyimage', uploading.any(), function(req, res) { 
    var user = req.cookies.user;
    if(user != null && req.file != null) {
        if(req.file[0] != null) {
            fs.readFile(req.files[0].path, function (err, data) {
                var db = req.db;
                var collection = db.get('Users');
                collection.findOne({'_id': user},{},function(e,docs){
                    var newPath = "public" + docs.companyImage;
                    fs.writeFile(newPath, data, function (err) {
                        res.render('my_user_page');
                    });
                });
            });    
        } else {
            res.render('my_user_page', { 'title': 'Charity Event | My User Page', 'uploadError': 'An error occured with your picture upload. Please try again.' });
        }
    } else {
        res.render('my_user_page', { 'title': 'Charity Event | My User Page', 'uploadError': 'An error occured with your picture upload. Please try again.' });
    }
});

module.exports = router;
    