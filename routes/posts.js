var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('posts/post_list', { title: 'Post Manager' });
});

/* GET users listing. */
router.get('/creator/', function(req, res, next) {
  res.render('posts/post_creator', { title: 'Post Creator', docs: '' });
});

/* GET all posts. */
router.get('/all', function(req, res, next) {
    var user = req.cookies.user;
    if(user != null) {
        console.log(1);
        var db = req.db;
        var collection = db.get('Users');
        console.log(2);
        collection.findOne({'_id': user},{},function(e,docs){
            if(docs.role == "Admin") {
                console.log(3);            	
                collection = db.get('Posts');
                collection.find({},{sort: {dateCreated: -1}},function(e,docs){
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

/*  POST To Add Post */
router.post('/addpost', function(req, res) { 
    var user = req.cookies.user;
    if(user != null) {
    	req.body.userId = user;
    	req.body.rating = 0;
    	req.body.comment = 0;
    	req.body.dateCreated = new Date().toString();
    	req.body.dateModified = new Date().toString();

        var db = req.db;
        var collection = db.get('Posts');
        collection.insert(req.body, function(err, result){
        	if(err === null) {
        		res.render('posts/post_list', { title: 'Post Manager' });
        	} else {
        		alert(err);
        	}
	    });
    } else {
        res.render('page_404');
    }
});

/* GET post edit page by id. */
router.get('/updatepost/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Posts');
    if(req.params.id.length != 24)
        res.render('page_404');
    collection.findOne({ '_id' : req.params.id },{},function(e,docs){
        if(docs) {
            res.render('posts/post_creator', { title: 'Charity Event | Post Creator', 'docs': docs });
        } else {
            res.render('page_404');
        }
    });
});

/*  POST To Update User */
router.post('/updatepost', function(req, res) {
    var db = req.db;
    var collection = db.get('Posts');   
    collection.update({ '_id' : req.body._id }, { $set: req.body}, function(err) {
        if(err === null) {
            res.render('posts/post_list', { title: 'Post Manager' });
        } else {
            alert(err);
        }
    });
});

/* GET post page by id. */
router.get('/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Posts');
    if(req.params.id.length != 24)
        res.render('page_404');
    collection.findOne({ '_id' : req.params.id },{},function(e,docs){
        if(docs) {
            res.render('posts/post_details', { title: 'Charity Event | ' + docs.postName, 'docs': docs });
        } else {
            res.render('page_404');
        }
    });
});

/* DELETE to deleteuser. */
router.delete('/deletepost/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('Posts');
    collection.remove({ '_id' : req.params.id }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;