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
  res.render('users/user_list', { title: 'Users Manager' });
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
            (err === null) ? { msg: ''} : { msg: err, 'message': 'An error occured. Please try again.' }
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
        res.send((err === null) ? { msg: '', 'message' : 'Saved successfully.'  } : { msg:'error: ' + err, 'message': 'An error occured. Please try again.' });
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
router.post('/updateuserimage', uploading.single('displayImage'), function(req, res) { 
    var user = req.cookies.user;
    console.log("REQUEST: " + req);
    if(user != null && req.file != null) {
        if(req.file.path != null) {
            fs.readFile(req.file.path, function (err, data) {
                var db = req.db;
                var collection = db.get('Users');
                collection.findOne({'_id': user},{},function(e,docs){
                    var newPath = "public" + docs.image;
                    fs.writeFile(newPath, data, function (err) {
                        res.render('users/my_user_page', { title: 'Charity Project | User Page' });
                    });
                });
            });    
        } else {
            res.render('users/my_user_page', { 'title': 'Charity Event | My User Page', 'uploadError': 'An error occured with your picture upload. Please try again.' });
        }
    } else {
        res.render('users/my_user_page', { 'title': 'Charity Event | My User Page', 'uploadError': 'An error occured with your picture upload. Please try again.' });
    }
});

/*  POST To Update User */
router.post('/updatecompanyimage', uploading.any(), function(req, res) { 
    var user = req.cookies.user;
    if(user != null && req.file != null) {
        if(req.file.path != null) {
            fs.readFile(req.file.path, function (err, data) {
                var db = req.db;
                var collection = db.get('Users');
                collection.findOne({'_id': user},{},function(e,docs){
                    var newPath = "public" + docs.companyImage;
                    fs.writeFile(newPath, data, function (err) {
                        res.render('users/my_user_page');
                    });
                });
            });    
        } else {
            res.render('users/my_user_page', { 'title': 'Charity Event | My User Page', 'uploadError': 'An error occured with your picture upload. Please try again.' });
        }
    } else {
        res.render('users/my_user_page', { 'title': 'Charity Event | My User Page', 'uploadError': 'An error occured with your picture upload. Please try again.' });
    }
});

/*  POST To Update Company Info */
router.post('/updatecompany', uploading.single('displayCompanyImage'), function(req, res) { 
    var user = req.cookies.user;
    req.body.role = req.body.role + "Pending";
    req.body.dateModified = new Date().toString();
    console.log(req.body);
    console.log(req.file);
    if(user != null) {
        if(req.file != null) {
            var extension = req.file.mimetype.split("/")[1];
            var path = "/images/user/company-" + user + "." + extension;
            var savePath = "public" + req.body.companyImage;

            fs.readFile(req.file.path, function (err, data) {
                fs.writeFile(savePath, data);
            });

            var db = req.db;
            var collection = db.get('Users');
            collection.update({ '_id' : user }, { $set: req.body}, function(err) {
                if(err === null) {
                    res.render('users/my_user_page', { title: "Charity Project | User Page" });
                } else {
                    res.send({ msg:'error: ' + err, 'message': 'An error occured. Please try again.' });
                }
            });
        }
    }
});

/* GET user page by id. */
router.get('/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Users');
    if(req.params.id.length != 24)
        res.render('page_404');
    collection.findOne({ '_id' : req.params.id },{},function(e,docs){
        if(docs) {
            res.render('users/user_details', { title: 'Charity Event | ' + docs.username + '\'s Page', 'docs': docs });
        } else {
            res.render('page_404');
        }
    });
});

module.exports = router;
    