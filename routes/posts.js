var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;

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
        var db = req.db;
        var collection = db.get('Users');
        collection.findOne({'_id': user},{},function(e,docs){
            if(docs.role == "Admin") {  	
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

/* GET all news id. */
router.get('/news', function(req, res, next) {
    var db = req.db;
    var collection =  db.get('Posts');
    collection.find({ $or: [ { postType: 'Announcement' }, { postType: 'Report' } ]},{sort: {dateCreated: -1}},function(e,docs){
        res.json(docs);
    })
});

/* GET all board id. */
router.get('/board', function(req, res, next) {
    var db = req.db;
    var collection =  db.get('Posts');
    collection.find({ $not: { $or: [ { postType: 'Announcement' }, { postType: 'Report' } ]}},{sort: {dateCreated: -1}},function(e,docs){
        res.json(docs);
    })
});

/*  POST To Add Post */
router.post('/addpost', function(req, res) { 
    var user = req.cookies.user;
    if(user != null) {
        var db = req.db;
        var collection = db.get('Users');
        collection.findOne({'_id': new ObjectId(user)},{},function(e,docs){
            if(e === null) {
                req.body.user = docs.username;
                req.body.rating = 0;
                req.body.comment = 0;
                req.body.dateCreated = new Date().toString();
                req.body.dateModified = new Date().toString();

                delete req.body._id;

                collection = db.get('Posts');
                collection.insert(req.body, function(err, result){
                    if(err === null) {
                        res.render('posts/post_list', { title: 'Post Manager' });
                    } else {
                        alert(err);
                    }
                });
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

/*  POST To Update Post */
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

/* DELETE to delete post. */
router.delete('/deletepost/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('Posts');
    collection.remove({ '_id' : req.params.id }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/*  POST To Add Comment */
router.post('/addcomment', function(req, res) {
    var db = req.db;
    var collection = db.get('Comments');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: ''} : { msg: err }
        );
    });
});

/* GET comment by post id. */
router.get('/comment/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Comments');
    var collection2 = db.get('Ratings');
    var resdocs = [];
    var id = req.params.id;
    collection.find({ 'postId' : id },{sort: {dateCreated: -1}},function(e,docs){        
        for(var i = 0; i < docs.length; i++) {
            resdocs[i] = docs[i]._id.toString();
        }
        collection2.find({ 'subjectId' : { $in: resdocs }},{},function(e,datadata){
            for(var i = 0; i < docs.length; i++) {
                for(var j = 0; j < datadata.length; j++) {
                    if(docs[i]._id.toString() == datadata[j].subjectId.toString()) {
                        docs[i].rating = parseInt(docs[i].rating) + parseInt(datadata[j].ratingPoint);
                    }
                }
            }
            docs.sort(function(a,b) {
                return b.rating - a.rating;
            });
            res.json(docs);
        });
    });
});

/* GET comment by id. */
router.get('/comment/id/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Comments');
    var id = req.params.id;
    collection.findOne({ '_id' : id },{},function(e,docs){
        res.json(docs);
    });
});

/* GET comment reply by comment id. */
router.get('/reply/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Comments');
    collection.find({ 'commentId' : req.params.id },{},function(e,docs){
        res.json(docs);
    });
});

/*  POST To Update comment */
router.post('/updatecomment', function(req, res) {
    var db = req.db;
    var collection = db.get('Comments');   
    collection.update({ '_id' : req.body._id }, { $set: req.body}, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/* DELETE to delete comment. */
router.delete('/deletecomment/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('Comments');
    collection.remove({ '_id' : req.params.id }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;