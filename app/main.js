'use strict';

let formatTime = (time) => `${time.toLocaleDateString()} - ${time.toLocaleTimeString()}`;

firebase.initializeApp({
  apiKey: 'AIzaSyD23ChWSD1Ua4oDxFnodt-C_BoxvsQ0D9U',
  authDomain: 'vue-db-socket.firebaseapp.com',
  databaseURL: 'https://vue-db-socket.firebaseio.com',
  projectId: 'vue-db-socket',
  storageBucket: 'vue-db-socket.appspot.com',
  messagingSenderId: '52286000408'
});

var socket = new io();
let userData = null;

// CHAT
var VUE_chat = new Vue({
  el: '#chat',
  data: {
    isLoading: true,
    messages: [],
    form: '',
    input: '',
    user: null
  },
  methods: {
    keySubmit: function(message, $event) {
      if ($event.keyCode === 13 && !$event.shiftKey) {
        $event.preventDefault();
        if (this.user && message) {
          socket.emit('send-message', {
            user: this.user,
            message: message
          });
          this.input = null;
        }
      }
    },
    clickSubmit: function(message, $event) {
      $event.preventDefault();
      if (this.user && message) {
        socket.emit('send-message', {
          user: this.user,
          message: message
        });
        this.input = null;
      }
    },
    login: function($event) {
      var self = this;
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function() {
          var provider = new firebase.auth.GithubAuthProvider();
          provider.addScope('read:user');
          return firebase.auth().signInWithPopup(provider);
        })
        .then(function(result) {
          console.log('RES', result);
          if (result && result.user && result.additionalUserInfo) {
            document.cookie = `githubAccessToken=${result.credential.accessToken}`;
            userData = {
              userName: result.additionalUserInfo.username,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL
            }
            self.user = userData;
            socket.emit('user-connected', self.user);
          }
        })
        .catch(function(error) {
          console.error('ERROR', error);
          self.user = null;
        });
    }
  },
  mounted() {
    var self = this;
    var token = getCookie('githubAccessToken');
    if (token) {
      var credential = firebase.auth.GithubAuthProvider.credential(token);
      firebase.auth().signInAndRetrieveDataWithCredential(credential)
        .then(function(result) {
          console.log('RESULT 2', result);
          if (result && result.user && result.additionalUserInfo) {
            userData = {
              userName: result.additionalUserInfo.username,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL
            }
            self.user = userData;
            socket.emit('user-connected', self.user);
            self.isLoading = false;
          }
        })
        .catch(function(error) {
          console.error('ERROR', error);
          self.user = null;
          self.isLoading = false;
        });
    } else {
      this.user = null;
      self.isLoading = false;
    }
  }
});

socket.on('read-message', function(bulkMessage) {
  addBulkMessage(bulkMessage);
});

socket.on('new-message', function(bulkMessage) {
  addBulkMessage(bulkMessage);
});

function addBulkMessage(bulkMessage) {
  bulkMessage.forEach(function(value, key) {
    Object.assign(bulkMessage[key], {
      time: new moment(value.time).format('DD/MM/YYYY - HH:mm').toString()
    });
  });
  VUE_chat.messages = bulkMessage;
}

function getCookie(cname) {
  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}
