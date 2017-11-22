import './index.scss';

const Vue = require('vue');
const Moment = require('moment');
const firebase = require('firebase');
const firebaseConfig = require('./../config/firebase.config');

firebase.initializeApp(firebaseConfig);

const socket = new io();
let userData = null;

const getCookie = (cname) => {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

// CHAT
const VueChat = new Vue({
  el: '#chat',
  data: {
    isLoading: true,
    messages: [],
    form: '',
    input: '',
    user: null,
  },
  methods: {
    keySubmit: (message, $event) => {
      if ($event.keyCode === 13 && !$event.shiftKey) {
        $event.preventDefault();
        if (VueChat.user && message) {
          socket.emit('send-message', {
            user: VueChat.user,
            msg: message,
          });
          VueChat.input = null;
        }
      }
    },
    clickSubmit: (message, $event) => {
      $event.preventDefault();
      if (VueChat.user && message) {
        socket.emit('send-message', {
          user: VueChat.user,
          msg: message,
        });
        VueChat.input = null;
      }
    },
    login: () => {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          const provider = new firebase.auth.GithubAuthProvider();
          provider.addScope('read:user');
          return firebase.auth().signInWithPopup(provider);
        })
        .then((result) => {
          if (result && result.user && result.additionalUserInfo) {
            document.cookie = `githubAccessToken=${result.credential.accessToken}`;
            userData = {
              userName: result.additionalUserInfo.username,
              displayName: result.user.displayName,
              userPict: result.user.photoURL,
            };
            VueChat.user = userData;
            socket.emit('user-connected', VueChat.user);
          }
        })
        .catch((error) => {
          console.error('ERROR', error); // eslint-disable-line
          VueChat.user = null;
        });
    },
  },
  mounted() {
    const token = getCookie('githubAccessToken');
    if (token) {
      const credential = firebase.auth.GithubAuthProvider.credential(token);
      firebase.auth().signInAndRetrieveDataWithCredential(credential)
        .then((result) => {
          if (result && result.user && result.additionalUserInfo) {
            userData = {
              userName: result.additionalUserInfo.username,
              displayName: result.user.displayName,
              userPict: result.user.photoURL,
            };
            VueChat.user = userData;
            socket.emit('user-connected', VueChat.user);
            VueChat.isLoading = false;
          }
        })
        .catch((error) => {
          console.error('ERROR', error); // eslint-disable-line
          VueChat.user = null;
          VueChat.isLoading = false;
        });
    } else {
      this.user = null;
      this.isLoading = false;
    }
  },
});

const addBulkMessage = (bulkMessage) => {
  bulkMessage.forEach((value, key) => {
    Object.assign(bulkMessage[key], {
      time: new Moment(value.time).format('DD/MM/YYYY - HH:mm').toString(),
    });
  });
  VueChat.messages = bulkMessage;
};

socket.on('read-message', bulkMessage => addBulkMessage(bulkMessage));
socket.on('new-message', bulkMessage => addBulkMessage(bulkMessage));
