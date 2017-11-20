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

let userData = null;
var socket = new io();

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
          provider.addScope('user');
          return firebase.auth().signInWithPopup(provider);
        })
        .then(function(result) {
          if (result && result.user) {
            document.cookie = `githubAccessToken=${result.credential.accessToken}`;
            userData = {
              displayName: result.user.displayName,
              photoURL: result.user.photoURL
            }
            self.user = result.user;
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
      firebase.auth().signInWithCredential(credential)
        .then(function(result) {
          if (result) {
            userData = {
              displayName: result.displayName,
              photoURL: result.photoURL
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

// NOTIFICATION
var VUE_notification = new Vue({
  el: '#notification',
  data: {
    visible: false,
    datas: []
  },
  methods: {
    dismiss: function(index) {
      VUE_notification.datas.splice(index, 1);
    }
  }
});

socket.on('read-message', function(bulkMessage) {
  addBulkMessage(bulkMessage);
});

socket.on('user-connected', function(userData) {
  VUE_notification.visible = false;
  setTimeout(function() {
    VUE_notification.visible = true;
    VUE_notification.datas.push({
      displayName: userData.displayName,
      show: true
    });
  }, 100);
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
  console.log(bulkMessage);
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
