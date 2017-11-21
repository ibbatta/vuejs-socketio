const express = require('express');

const app = express();
const http = require('http').Server(app);
const firebase = require('firebase');
const socketIO = require('socket.io')(http);
const firebaseConfig = require('./config/firebase.config');
const settingsConfig = require('./config/settings.config');

firebase.initializeApp(firebaseConfig);
const messagesDbRef = firebase.database().ref(settingsConfig.dbChatRef);

app.set('port', settingsConfig.serverPort);
app.use('/npm', express.static('node_modules'));
app.use('/root', express.static('favicons'));
app.use(express.static('app'));

app.get('/', function(req, res) {
  res.sendfile('./app/index.html');
});

socketIO.on('connection', function(socket) {
  initLoadMessageFromDb(settingsConfig.numberMessageLoaded);
  socket.on('user-connected', function(userData) {
    console.log(`USER CONNECTED: ${userData.userName} - ${userData.displayName}`);
  });
  socket.on('send-message', function(formData) {
    saveMessageToDb(formData);
  });
});

function initLoadMessageFromDb(limit) {
  messagesDbRef.orderByChild('time').limitToLast(limit).once('value', function(snapshot) {
    const messages = snapshot.val();
    if (messages) {
      let bulkMessage = [];
      Object.keys(messages).forEach((key) => {
        bulkMessage.push({
          user: messages[key].user,
          name: messages[key].name,
          pict: messages[key].pict,
          message: messages[key].msg,
          time: messages[key].time,
        });
      });
      socketIO.emit('read-message', bulkMessage);
    }
  });
}

function saveMessageToDb(formData) {
  const user = formData.user.userName;
  const name = formData.user.displayName;
  const pict = formData.user.photoURL;
  const msg = formData.message;
  const time = new Date().getTime();
  firebase.database().ref(settingsConfig.dbChatRef).push({
    user,
    name,
    pict,
    msg,
    time,
  });
  firebase.database().ref(`/users/${user}/messages`).push({
    msg,
    time,
  });
}

messagesDbRef.orderByChild('time').on('value', function(snapshot) {
  const messages = snapshot.val();
  if (messages) {
    let bulkMessage = [];
    Object.keys(messages).forEach(key => {
      bulkMessage.push({
        user: messages[key].user,
        name: messages[key].name,
        pict: messages[key].pict,
        message: messages[key].msg,
        time: messages[key].time,
      });
    });
    socketIO.emit('new-message', bulkMessage);
  }
});

http.listen(app.get('port'), function() {
  console.log(`Node app is running on port: ${app.get('port')}`);
});
