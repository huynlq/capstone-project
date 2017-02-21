var express = require('express');
var router = express.Router();

/* GET posts listing. */
router.get('/', function(req, res, next) {
  res.render('post_list', { title: 'Post Manager' });
});

/* GET posts listing. */
router.get('/creator/', function(req, res, next) {
  res.render('post_creator', { title: 'Post Creator' });
});

module.exports = router;