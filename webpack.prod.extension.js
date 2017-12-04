const glob = require('glob');
const path = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const WebpackPlugin = require('webpack');
const mainConfig = require('./webpack.config');

module.exports = merge(mainConfig, {
  devtool: 'none',
  entry: {
    main: ['./index.js'],
  },
  plugins: [
    new WebpackPlugin.NoEmitOnErrorsPlugin(),
    new WebpackPlugin.optimize.OccurrenceOrderPlugin(),
    new CleanWebpackPlugin(['dist']),
    new UglifyJSPlugin({
      exclude: /(node_modules|bower_components)/,
      cache: true,
      parallel: true,
    }),
    new ExtractTextPlugin({ filename: '[name].bundle.css', allChunks: true, disable: false }),
    new PurifyCSSPlugin({
      styleExtensions: ['.css', '.scss'],
      moduleExtensions: ['.html'],
      purifyOptions: {
        info: false,
        rejected: false,
        minify: true,
      },
      paths: glob.sync(path.resolve(__dirname, 'app/index.html')),
    }),
  ],
});
