const chalk = require('chalk');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const CONSTANTS = require('./config/constants.config');
const settingConfig = require('./config/settings.config');
const serverPathConfig = require('./config/server.config');
const webpackConfig = process.env.NODE_ENV === CONSTANTS.production ? require('./webpack.prod.extension') : require('./webpack.dev.extension');

const compiler = webpack(webpackConfig);
const app = express();
// const socketIO = require('socket.io')(http);

const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  historyApiFallback: true,
  hot: true,
  inline: true,
  noInfo: false,
  quiet: false,
});

const webpackHotMiddleware = require('webpack-hot-middleware')(compiler, {});

app.use(webpackDevMiddleware);
app.use(webpackHotMiddleware);

// serve static files
app.use(serverPathConfig.dev.assetsPublicPath, express.static(path.join(__dirname, '/app')));
app.use(serverPathConfig.dev.assetsNodeModules, express.static(path.join(__dirname, '/node_modules')));
app.use(serverPathConfig.dev.assetsFavicon, express.static(path.join(__dirname, '/favicons')));

// default port where dev server listens for incoming traffic
console.log(chalk.bgGreen(chalk.black('###   Starting server...   ###'))); // eslint-disable-line

webpackDevMiddleware.waitUntilValid(() => {
  const uri = `http://localhost: ${settingConfig.serverPort}`;
  if (process.env.NODE_ENV === CONSTANTS.development) {
    // console.clear(); // eslint-disable-line
  }
  console.log(chalk.red(`> Listening ${chalk.white(process.env.NODE_ENV)} server at: ${chalk.bgRed(chalk.white(uri))}`)); // eslint-disable-line

  /**
   * IMPLEMENT INIT SOCKET
   */
});

// const http = require('http').createServer(app);

app.listen(settingConfig.serverPort);
