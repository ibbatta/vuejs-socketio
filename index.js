'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var firebase = require('firebase');
var socketIO = require('socket.io')(http);
var firebaseConfig = require('./config/firebaseConfig');
var settingsConfig = require('./config/settingsConfig');

firebase.initializeApp(firebaseConfig);
var messagesDbRef = firebase.database().ref(settingsConfig.dbChatRef);

app.set('port', settingsConfig.serverPort);
app.use('/npm', express.static('node_modules'));
app.use(express.static('app'));

app.get('/', function(req, res) {
  res.sendfile('./app/index.html');
});

socketIO.on('connection', function(socket) {
  socketIO.emit('clean-chat');
  loadMessageFromDb(settingsConfig.numberMessageLoaded);
  socket.on('user-connected', function(userData) {
    console.log(`USER CONNECTED: ${userData.displayName}`);
  });

  socket.on('send-message', function(formData) {
    saveMessageToDb(formData);
  });
});

function loadMessageFromDb(limit) {
  messagesDbRef.orderByChild('time').limitToLast(limit).once('value', function(snapshot) {
    var messages = snapshot.val();
    if (messages) {
      Object.keys(messages).forEach(key => {
        socketIO.emit('read-message', {
          msg: messages[key].message,
          displayName: messages[key].user,
          photoURL: messages[key].pict,
          time: messages[key].time
        });
      });
    }
  });
}

function saveMessageToDb(formData) {
  var user = formData.user.displayName;
  var pict = formData.user.photoURL;
  var message = formData.message;
  var time = new Date().getTime();
  firebase.database().ref(settingsConfig.dbChatRef).push({
    message,
    user,
    pict,
    time
  });
  firebase.database().ref(`/users/${user}/messages`).push({
    message,
    time
  });
}

http.listen(app.get('port'), function() {
  console.log(`Node app is running on port: ${app.get('port')}`);
});
