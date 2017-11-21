const CONSTANTS = require('./config/constants.config');
const chalk = require('chalk');
const path = require('path');
const serverPathConfig = require('./config/server.config');
const express = require('express');
const webpack = require('webpack');
const webpackConfig = process.env.NODE_ENV === CONSTANTS.production ? require('./webpack.prod.extension') : require('./webpack.dev.extension');

const compiler = webpack(webpackConfig);
const app = express();

const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  historyApiFallback: true,
  hot: true,
  inline: true,
  noInfo: true,
  quiet: true,
});

const webpackHotMiddleware = require('webpack-hot-middleware')(compiler, {});

app.use(webpackDevMiddleware);
app.use(webpackHotMiddleware);

// serve static files
app.use(serverPathConfig.dev.assetsPublicPath, express.static(path.resolve(__dirname, '/app')));
app.use(path.join(serverPathConfig.dev.assetsPublicPath, serverPathConfig.dev.assetsSubDirectory), express.static(path.resolve(__dirname, '/app/assets')));
app.use(path.join(serverPathConfig.dev.assetsPublicPath, serverPathConfig.dev.assetsNodeModules), express.static('node_modules'));
app.use(serverPathConfig.dev.assetsPublicPath, express.static('favicons'));
app.use(express.static('app'));
app.get('/', function(req, res) {
  res.sendfile('./app/index.html');
});

// default port where dev server listens for incoming traffic
const serverPort = serverPathConfig.dev.port;
console.log(chalk.bgGreen(chalk.black('###   Starting server...   ###'))); // eslint-disable-line


webpackDevMiddleware.waitUntilValid(() => {
  const uri = `http://localhost: ${serverPort}`;
  if (process.env.NODE_ENV === CONSTANTS.development) {
    console.clear(); // eslint-disable-line
  }
  console.log(chalk.red(`> Listening ${chalk.white(process.env.NODE_ENV)} server at: ${chalk.bgRed(chalk.white(uri))}`)); // eslint-disable-line
});

app.listen(serverPort);
