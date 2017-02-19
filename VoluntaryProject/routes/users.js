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

module.exports = router;
