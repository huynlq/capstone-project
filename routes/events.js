var express = require('express');
var router = express.Router();

/* GET event listing. */
router.get('/', function(req, res, next) {
  res.render('event_list', { title: 'Event Manager' });
});

/* GET event creator page. */
router.get('/creator/event', function(req, res, next) {
  res.render('event_creator', { title: 'Event Creator' });
});

/* GET activity creator page. */
router.get('/creator/activity', function(req, res, next) {
  res.render('activity_creator', { title: 'Activity Creator' });
});

/* GET event preview page. */
router.get('/creator/preview', function(req, res, next) {
  res.render('event_preview', { title: 'Event Preview' });
});

module.exports = router;