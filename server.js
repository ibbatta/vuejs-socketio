const chalk = require('chalk');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const firebase = require('firebase');
const CONSTANTS = require('./config/constants.config');
const firebaseConfig = require('./config/firebase.config');
const settingsConfig = require('./config/settings.config');
const serverPathConfig = require('./config/server.config');
const webpackConfig = process.env.NODE_ENV === CONSTANTS.production ? require('./webpack.prod.extension') : require('./webpack.dev.extension');

const compiler = webpack(webpackConfig);
const app = express();
const http = require('http').Server(app);
const socketIO = require('socket.io')(http);

firebase.initializeApp(firebaseConfig);
const messagesDbRef = firebase.database().ref(settingsConfig.dbChatRef);

console.log(chalk.bgGreen(chalk.black('###   Starting server...   ###'))); // eslint-disable-line

const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  historyApiFallback: true,
  hot: true,
  inline: true,
  noInfo: false,
  quiet: false,
});

let snapshotValue;
let bulkMessage = [];
let [user, name, pict, msg, time] = [];
const uri = `http://localhost:${settingsConfig.serverPort}`;
const webpackHotMiddleware = require('webpack-hot-middleware')(compiler, {});

app.use(webpackDevMiddleware);
app.use(webpackHotMiddleware);

// serve static files
app.use(serverPathConfig.dev.assetsPublicPath, express.static(path.join(__dirname, '/app')));
app.use(serverPathConfig.dev.assetsNodeModules, express.static(path.join(__dirname, '/node_modules')));
app.use(serverPathConfig.dev.assetsFavicon, express.static(path.join(__dirname, '/favicons')));

const initLoadMessageFromDb = (limit) => {
  messagesDbRef.orderByChild('time').limitToLast(limit).once('value', (snapshot) => {
    snapshotValue = snapshot.val();
    if (snapshotValue) {
      bulkMessage = [];
      Object.keys(snapshotValue).forEach((key) => {
        bulkMessage.push({
          user: snapshotValue[key].user,
          name: snapshotValue[key].name,
          pict: snapshotValue[key].pict,
          message: snapshotValue[key].msg,
          time: snapshotValue[key].time,
        });
      });
      socketIO.emit('read-message', bulkMessage);
    }
  });
};

const saveMessageToDb = (formData) => {
  [user, name, pict, msg, time] = [
    formData.user.userName,
    formData.user.displayName,
    formData.user.userPict,
    formData.msg,
    new Date().getTime(),
  ];
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
  socketIO.emit('message-saved');
};

webpackDevMiddleware.waitUntilValid(() => {
  console.log(chalk.italic.bold.yellow(`> Listening ${chalk.underline.white(process.env.NODE_ENV)} server at: ${chalk.underline.white(uri)}`)); // eslint-disable-line

  socketIO.on('connection', (socket) => {
    initLoadMessageFromDb(settingsConfig.numberMessageLoaded);
    // TODO: implement user connection
    /* socket.on('user-connected', (userData) => {
      console.log(`USER CONNECTED: ${chalk.underline.bold.yellow(userData.userName)} - ${userData.displayName}`); // eslint-disable-line
    }); */
    socket.on('send-message', (formData) => {
      saveMessageToDb(formData);
    });
  });

  messagesDbRef.orderByChild('time').on('value', (snapshot) => {
    snapshotValue = snapshot.val();
    if (snapshotValue) {
      bulkMessage = [];
      Object.keys(snapshotValue).forEach((key) => {
        bulkMessage.push({
          user: snapshotValue[key].user,
          name: snapshotValue[key].name,
          pict: snapshotValue[key].pict,
          message: snapshotValue[key].msg,
          time: snapshotValue[key].time,
        });
      });
      socketIO.emit('new-message', bulkMessage);
    }
  });
});

http.listen(settingsConfig.serverPort);
