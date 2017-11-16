'use strict';

let formatTime = (time) => `${time.toLocaleDateString()} - ${time.toLocaleTimeString()}`;

(function() {

  firebase.initializeApp({
    apiKey: 'AIzaSyD23ChWSD1Ua4oDxFnodt-C_BoxvsQ0D9U',
    authDomain: 'vue-db-socket.firebaseapp.com',
    databaseURL: 'https://vue-db-socket.firebaseio.com',
    projectId: 'vue-db-socket',
    storageBucket: 'vue-db-socket.appspot.com',
    messagingSenderId: '52286000408'
  });

  var socket = new io();
  var provider = new firebase.auth.GithubAuthProvider();

  provider.addScope('user');

  // CHAT
  var VUE_chat = new Vue({
    el: '#chat',
    data: {
      messages: [],
      form: '',
      input: '',
      user: null
    },
    methods: {
      onSubmit: function($event) {
        $event.preventDefault();
        this.input = null;
      },
      submit: function(message, $event) {
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
      login: function($event) {
        var self = this;
        firebase.auth().signInWithPopup(provider)
          .then(function(result) {
            if (result && result.additionalUserInfo && result.additionalUserInfo.profile) {
              self.user = result.additionalUserInfo.profile;
              socket.emit('user-connected', self.user);
            }
          }).catch(function(error) {
            console.error('ERROR', error);
            self.user = null;
          });
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

  socket.on('clean-chat', function() {
    VUE_chat.messages = [];
  });

  socket.on('read-message', function(data) {
    var timeConverted = formatTime(new Date(data.time));
    VUE_chat.messages.push({
      text: data.msg,
      userId: data.userId,
      userPict: data.userPict,
      time: timeConverted
    });
  });

  socket.on('user-connected', function(userData) {
    VUE_notification.visible = false;
    setTimeout(function() {
      VUE_notification.visible = true;
      VUE_notification.datas.push({
        userId: userData.id,
        show: true
      });
    }, 2000);
    setTimeout(function() {
      VUE_notification.datas = [];
    }, 2000);
  });

})();
