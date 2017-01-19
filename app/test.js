'use strict';

(function() {

  var socket = new io();

  var vm = new Vue({
    el: '#chat',
    data: {
      messages: [{ text: 'primo messaggio' }],
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

  socket.on('chat-message', function(msg) {
    vm.messages.push({ text: msg });
  });

})();

