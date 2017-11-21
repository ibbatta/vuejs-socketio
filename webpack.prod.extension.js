const glob = require('glob');
const path = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const WebpackMonitor = require('webpack-monitor');
const WebpackPlugin = require('webpack');

const mainConfig = require('./webpack.config');
const serverConfig = require('../config/server.config');

const minifyOpts = {
  removeConsole: true,
  removeDebugger: true,
};

const pluginOpts = {

};

module.exports = merge(mainConfig, {
  devtool: 'none',
  entry: {
    main: ['./'],
  },
  plugins: [
    new WebpackPlugin.optimize.OccurrenceOrderPlugin(),
    new WebpackPlugin.optimize.DedupePlugin(),
    new MinifyPlugin(minifyOpts, pluginOpts),
    new ExtractTextPlugin({ filename: '[name].bundle.css', allChunks: true, disable: false }),
    new CleanWebpackPlugin(['dist', '.monitor']),
    new UglifyJSPlugin({
      sourceMap: true,
    }),
    new PurifyCSSPlugin({
      styleExtensions: ['.css', '.scss'],
      moduleExtensions: ['.html'],
      purifyOptions: {
        info: true,
        rejected: false,
        minify: true,
      },
      paths: glob.sync(path.join(__dirname, '../app/src/*.html')),
    }),
    new WebpackMonitor({
      capture: true,
      target: serverConfig.monitor.target,
      launch: true,
      port: serverConfig.monitor.port,
      purifyOptions: {
        output: path.join(__dirname, '../dist'),
      },
    }),
  ],
});
