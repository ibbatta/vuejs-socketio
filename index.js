/* jshint esversion: 6 */
'use strict';
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var socketIO = require('socket.io')(http);
var firebase = require('firebase');

require('dotenv').config();

var config = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID
};

firebase.initializeApp(config);

var messagesDbRef = firebase.database().ref('chat/messages/');


firebase.auth().signInAnonymously().catch(function(error) {
  console.log(error);
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log('user login');
  } else {
    console.log('user not found');
  }
});


app.set('port', (process.env.PORT || 3000));
app.use('/npm', express.static('node_modules'));
app.use(express.static('app'));

app.get('/', function(req, res) {
  res.sendfile('./app/index.html');
});


socketIO.on('connection', function(socket) {

  console.log('user connected:', socket.id);

  socketIO.emit('clean-chat');
  loadMessageFromDb(2);

  socket.broadcast.emit('user-connected', socket.id);

  socket.on('send-message', function(msg) {
    saveMessageToDb(socket.id, msg);
    socketIO.emit('read-message', { msg: msg, userId: socket.id, time: new Date().getTime() });
  });
});


http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function loadMessageFromDb(limit) {
  messagesDbRef.orderByChild('time').limitToLast(limit).once('value', function(snapshot) {
    var messages = snapshot.val();
    
    Object.keys( messages ).forEach( key => {
      io.emit('read-message', { msg: messages[key].message, userId: messages[key].userId, time: messages[key].time });
    }); 
  });
}

function saveMessageToDb(userId, message) {
  firebase.database().ref('/chat/messages/').push({
    userId,
    message,
    time: new Date().getTime()
  });
}

