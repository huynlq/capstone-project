var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var request = require('request');
var port = 3000;

// New Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/VoluntaryProject');

var routes = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');
var events = require('./routes/events');
var notifications = require('./routes/notifications');
var ratings = require('./routes/ratings');

var app = express();

io = require('socket.io').listen(app.listen(port));
console.log("LISTENING: " + port);

io.sockets.on('connection', function(socket){
  io.emit('chat message', "Someone has connect");

  socket.on('disconnect', function(){
    console.log('user disconnected');
    io.emit('chat message', "Someone has disconnect");
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('notification', function(notiObj){
    console.log('new noti');
    io.emit('notification', notiObj);
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({ limit: '500mb',extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/posts', posts);
app.use('/events', events);
app.use('/notifications', notifications);
app.use('/ratings', ratings);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
