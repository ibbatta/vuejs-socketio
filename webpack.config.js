const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPlugin = require('webpack');
const CONSTANTS = require('./config/constants.config');
const serverPathConfig = require('./config/server.config');

// process.noDeprecation = true;

module.exports = {
  context: path.resolve(__dirname, 'app'),
  output: {
    path: path.join(__dirname, serverPathConfig.prod.outputPath),
    publicPath: process.env.NODE_ENV === CONSTANTS.production ? serverPathConfig.prod.assetsPublicPath : serverPathConfig.dev.assetsPublicPath,
    filename: '[name].bundle.js',
  },
  module: {
    rules: [{
      test: /\.(html|htm|xhtml|ejs|hbs)$/,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: true,
          removeComments: true,
          collapseWhitespace: true,
        },
      }],
    },
    {
      test: /\.(js|jsx)$/,
      exclude: /(node_modules|bower_components)/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['env'],
          plugins: ['transform-runtime'],
        },
      }],
    },
    {
      test: /\.vue$/,
      exclude: /(node_modules|bower_components)/,
      use: ['vue-loader', 'vue-style-loader'],
    },
    {
      test: /\.css$/,
      exclude: /node_modules/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          'css-loader',
          'postcss-loader',
        ],
      }),
    }, {
      test: /\.(sass|scss)$/,
      exclude: /node_modules/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      }),
    },
    {
      test: /\.json$/,
      loader: 'json-loader',
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      exclude: /node_modules/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        publicPath: './',
      },
    }],
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
    },
    extensions: ['.js', '.jsx'],
  },
  node: {
    fs: 'empty',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'app', 'index.html'),
      inject: true,
      cache: false,
    }),
    new ExtractTextPlugin({
      filename: '[name].bundle.css',
      disable: false,
    }),
    new WebpackPlugin.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        APIKEY: JSON.stringify(process.env.APIKEY),
        AUTHDOMAIN: JSON.stringify(process.env.AUTHDOMAIN),
        DATABASEURL: JSON.stringify(process.env.DATABASEURL),
        PROJECTID: JSON.stringify(process.env.PROJECTID),
        STORAGEBUCKET: JSON.stringify(process.env.STORAGEBUCKET),
        MESSAGINGSENDERID: JSON.stringify(process.env.MESSAGINGSENDERID),
      },
    }),
  ],
};
