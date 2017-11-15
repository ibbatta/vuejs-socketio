'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var firebase = require('firebase');
var socketIO = require('socket.io')(http);
var firebaseConfig = require('./config/firebaseConfig');

firebase.initializeApp(firebaseConfig);
var messagesDbRef = firebase.database().ref('/');

app.set('port', (process.env.PORT || 9000));
app.use('/npm', express.static('node_modules'));
app.use(express.static('app'));

app.get('/', function(req, res) {
  res.sendfile('./app/index.html');
});

socketIO.on('connection', function(socket) {

  console.log(`connection ${socket.id}`);

  socketIO.emit('clean-chat');
  loadMessageFromDb(2);

  socket.on('user-connected', function(userData) {
    console.log(JSON.stringify(userData, null, 4));
  });

  socket.on('send-message', function(user, msg) {
    saveMessageToDb(user, msg);
    socketIO.emit('read-message', {
      userId: user.login,
      msg: msg,
      userPict: user.avatar_url || '',
      time: new Date().getTime()
    });
  });
});

function loadMessageFromDb(limit) {
  messagesDbRef.orderByChild('time').limitToLast(limit).once('value', function(snapshot) {
    var messages = snapshot.val();
    if (messages) {
      Object.keys(messages).forEach(key => {
        socketIO.emit('read-message', {
          userId: messages[key].login || 'undefined',
          msg: messages[key].message,
          userPict: messages[key].avatar_url || '',
          time: messages[key].time
        });
      });
    }
  });
}

function saveMessageToDb(userData, message) {
  var login = userData.login;
  var pict = userData.avatar_url;
  firebase.database().ref(`/${login}`).push({
    login,
    message,
    pict,
    time: new Date().getTime()
  });
}

http.listen(app.get('port'), function() {
  console.log(`Node app is running on port: ${app.get('port')}`);
});
