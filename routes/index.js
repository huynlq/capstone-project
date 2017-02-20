var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET login page. */
router.get('/login/', function(req, res, next) {
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
			res.send(
				(err === null) ? {msg: ''} : {msg: err}
			);
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
				role: doc.role 
			}
		);
	  } else {
	  	res.send(
            { msg: "Invalid username and/or password" }
        );
	  }
	});
});

module.exports = router;
