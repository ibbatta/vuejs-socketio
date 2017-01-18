'use strict';

var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/npm', express.static('node_modules'));
app.use(express.static('app'));

app.get('/', function(req, res) {
    res.sendfile('./app/index.html');
});

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    socket.on('chat-message', function(msg) {
        io.emit('chat-message', msg);
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
