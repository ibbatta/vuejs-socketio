'use strict';

var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 3000));

app.use('/npm', express.static('node_modules'));
app.use(express.static('app'));

app.get('/', function(req, res) {
  res.sendfile('./app/index.html');
});

io.on('connection', function(socket) {
  socket.broadcast.emit('user-connected', socket.id);
  console.log('user connected:', socket.id);
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
  socket.on('chat-message', function(msg) {
    io.emit('chat-message', { msg: msg, userId: socket.id });
  });
});

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

