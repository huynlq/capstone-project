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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('guest_page/index');
});

/* GET event list page. */
router.get('/events_list', function(req, res, next) {
  res.render('guest_page/list_events');
});

/* GET sponsor list page. */
router.get('/sponsors_list', function(req, res, next) {
  res.render('guest_page/list_sponsors');
});

/* GET news list page. */
router.get('/news_list', function(req, res, next) {
  res.render('guest_page/list_posts');
});

/* GET news list page. */
router.get('/community_board', function(req, res, next) {
  res.render('guest_page/board');
});

/* GET sponsor list page. */
router.get('/promote', function(req, res, next) {
  res.render('guest_page/promote');
});

/* GET sponsor list page. */
router.get('/about', function(req, res, next) {
  res.render('guest_page/about_us');
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/* POST register info. */
router.post('/register', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	var db = req.db;
	var collection = db.get('Users');
	var flagUsernameExists = false;
	var flagEmailExists = false;

	collection.findOne({$or:[{"username": username},{"email": email}]}, function(err, doc) {
	  if (doc == null) {	  	
	  	collection.insert(req.body, function(err, result){
	  		download('http://www.infinitemd.com/wp-content/uploads/2017/02/default.jpg', 'public/images/user/' + result._id + '.jpg', function(){
		        console.log('done');
		    });
		    collection.update({ '_id' : result._id }, { $set:{'image':'/images/user/' + result._id + '.jpg'} }, function(err) {
		        res.send(
					(err === null) ? {msg: '', id: result._id} : {msg: err}
				);
		    });			
		});
	  } else {
	  	res.send(
            { msg: "Username and/or email exists." }
        );
	  }
	});
});

/* POST login info. */
router.post('/login', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var db = req.db;
	var collection = db.get('Users');
	var flagUsernameExists = false;
	var flagEmailExists = false;

	collection.findOne({"username": username,"password": password}, function(err, doc) {
	  if (doc != null) {
		res.send(
			{ 
				msg: "",
				role: doc.role,
				id: doc._id
			}
		);
	  } else if (doc.markBanned == 1) {
	  	res.send(
            { msg: "Account banned. Reason: " + doc.bannedReason }
        );
	  } else {
	  	res.send(
            { msg: "Invalid username and/or password" }
        );
	  }
	});
});

/* GET user page. */
router.get('/my', function(req, res, next) {
	var user = req.cookies.user;
	if(user != null) {
		var db = req.db;
		var collection = db.get('Users');
		collection.findOne({"_id": user}, function(err, doc) {
			if(doc)
				res.render('guest_page/my_user_page', { title: 'Charity Project | User Page'});
			else
				res.render('login', { title: 'Login' });
		});  		
	} else {
		res.render('login', { title: 'Login' });
	}	
});

/* GET promote page. */
router.get('/promote', function(req, res, next) {
	res.render('users/promote', { title: 'Charity Project | Promotion Request'});
});

module.exports = router;
