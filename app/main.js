'use strict';

(function() {

  var socket = new io();

  // CHAT
  var VUE_chat = new Vue({
    el: '#chat',
    data: {
      messages: [],
      form: '',
      input: ''
    },
    methods: {
      onSubmit: function(event) {
        event.preventDefault();
      },
      submit: function(message) {
        if (message) {
          socket.emit('chat-message', message);
          this.input = '';
        }
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

  socket.on('chat-message', function(data) {
    VUE_chat.messages.push({ text: data.msg, userId: data.userId, time: data.time });
  });

  socket.on('user-connected', function(userId) {
    VUE_notification.visible = false;
    setTimeout(function() {
      VUE_notification.visible = true;
      VUE_notification.datas.push({ userId: userId, show: true });
    }, 500);
    setTimeout(function() {
      VUE_notification.datas = [];
    }, 2000);
  });

})();

