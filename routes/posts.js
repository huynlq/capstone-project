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
    dest: __dirname.split('routes')[0] + 'public\\images\\post\\',
    limits: {fileSize: 10000000, files:1},
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin_page/post_list', { title: 'Posts' });
});

/* GET users listing. */
router.get('/creator/', function(req, res, next) {
    var docs = {
        '_id':'',
        'postContent':'',
        'postDescription':'',
        'postImage':'',
        'postName':'',
    };
    res.render('admin_page/post_creator', { title: 'Post Creator', docs: docs });
});

/* GET all posts. */
router.get('/all', function(req, res, next) {
    var db = req.db;
    var collection  = db.get('Posts');
        collection.find({},{sort: {dateCreated: -1}},function(e,docs){
            res.json(docs);
        });
});

/* GET all news id. */
router.get('/news', function(req, res, next) {
    var db = req.db;
    var collection =  db.get('Posts');
    collection.find({'postType': 'News'},{sort: {dateCreated: -1}},function(e,docs){
        res.json(docs);
    })
});

/* GET all board id. */
router.get('/board', function(req, res, next) {
    var db = req.db;
    var collection =  db.get('Posts');
    collection.find({'postType': 'Community Board'},{sort: {dateCreated: -1}},function(e,docs){
        res.json(docs);
    })
});

/*  POST To Add Post */
router.post('/addpost', uploading.single('displayPostImage'), function(req, res) { 
    console.log(req.body);
    console.log(req.file);
    var user = req.body.userId;
    if(user != null) {
        var db = req.db;
        var collection = db.get('Users');
        collection.findOne({'_id': new ObjectId(user)},{},function(e,docs){
            if(e === null) {
                req.body.dateModified = new Date().toString();
                // If there's postId exists => Update the post                    
                if(req.body._id != '') {
                    collection = db.get('Posts');
                    collection.findOne({'_id': new ObjectId(user)},{},function(e,docs){
                        if(req.file != null) {
                            var extension = req.file.mimetype.split("/")[1];
                            var path = "/images/post/" + req.file.filename + "." + extension;
                            var savePath = "public" + path;                

                            req.body.postImage = path;

                            fs.readFile(req.file.path, function (err, data) {
                                fs.writeFile(savePath, data);
                            });

                            try {
                                fs.unlink("public" + docs.postImage);   
                            }
                            catch(err) {
                                console.log(err);
                            }

                        } else {
                            delete req.body.postImage;
                        }

                        collection = db.get('Posts');
                        collection.update({ '_id' : req.body._id }, { $set: req.body}, function(err, result){
                            if(err === null) {
                                res.writeHead(302, {'Location': '/posts/' + req.body._id});
                                res.end();
                            } else {
                                alert(err);
                            }
                        });
                    });
                } else {
                    // If postId NOT exists => Insert the post
                    if(req.file != null) {
                        var extension = req.file.mimetype.split("/")[1];
                        var path = "/images/post/" + req.file.filename + "." + extension;
                        var savePath = "public" + path;                

                        delete req.body._id;

                        req.body.postImage = path;

                        fs.readFile(req.file.path, function (err, data) {
                            fs.writeFile(savePath, data);
                        });

                        req.body.dateCreated = new Date().toString();
                        collection = db.get('Posts');
                        collection.insert(req.body, function(err, result){
                            if(err === null) {
                                res.writeHead(302, {'Location': '/posts/' + result._id});
                                res.end();
                            } else {
                                alert(err);
                            }
                        });
                    }  
                }                
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
            res.render('admin_page/post_creator', { title: 'Charity Event | Post Creator', 'docs': docs });
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
            res.writeHead(302, {'Location': '/posts'});
            res.end();
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
            res.render('guest_page/post_details', { title: 'Charity Event | ' + docs.postName, 'docs': docs });
        } else {
            res.render('page_404');
        }
    });
});

/* DELETE to delete post. */
router.delete('/deletepost/:id', function(req, res) {
    var db = req.db;
    var postId = req.params.id;
    var collection = db.get('Posts');
    collection.remove({ '_id' : postId }, function(err) {
        if(err === null) {
            collection = db.get('Comments');
            collection.find({ 'postId': postId }, function(err, docs){
                var comment = docs;
                if(err === null) {
                    collection.remove({ 'postId' : postId }, function(err){
                        if(err === null) {
                            var commentId = [];
                            for(var i = 0; i < comment.length; i++) {
                                commentId[i] = comment[i]._id.toString();
                            }                            
                            collection = db.get('Ratings');                            
                            collection.remove({'subjectId': {$in: commentId}}, function(err){
                                if(err === null) {
                                    collection.remove({'subjectId': postId}, function(err){
                                        if(err === null) {
                                            res.send({ msg:''});
                                        } else {
                                            res.send({ msg:'error: ' + err });                
                                        }
                                    });
                                } else {
                                    res.send({ msg:'error: ' + err });                
                                }
                            });
                        } else {
                            res.send({ msg:'error: ' + err });                
                        }
                        
                    });
                } else {
                    res.send({ msg:'error: ' + err });        
                }
            });
        } else {
            res.send({ msg:'error: ' + err });
        }        
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

/* GET comment number by postid. */
router.get('/commentnumber/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('Comments');    
    collection.count({ 'postId' : req.params.id },{},function(e,count){
        res.json(count);
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