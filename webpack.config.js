const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cssnext = require('postcss-cssnext');
const csshtml = require('postcss-html');
const WebpackPlugin = require('webpack');

const CONSTANTS = require('./config/constants.config');
const serverPathConfig = require('./config/server.config');


const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: [
      cssnext,
      csshtml,
    ],
  },
};

// process.noDeprecation = true;

module.exports = {
  context: path.resolve(__dirname, '/app'),
  output: {
    path: serverPathConfig.prod.assetsPublicPath,
    publicPath: (process.env.NODE_ENV === CONSTANTS.production ? serverPathConfig.prod.assetsPublicPath : serverPathConfig.dev.assetsPublicPath),
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
      test: /\.(js|jsx|vue)$/,
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
      test: /\.(vue)$/,
      exclude: /(node_modules|bower_components)/,
      use: ['vue-loader', 'vue-style-loader'],
    },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', postcssLoader],
      }),
    },
    {
      test: /\.(scss|sass)$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', postcssLoader, 'sass-loader'],
      }),
    },
    {
      test: /\.json$/,
      loader: 'json-loader',
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        'file-loader',
      ],
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        'file-loader',
      ],
    }],
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
    },
    extensions: ['.js', '.jsx', '.json', '.vue', '.css', '.scss', '.html', '.hbs', 'ejs'],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, '/app/index.html'), inject: true, cache: false }),
    new ExtractTextPlugin({ filename: '[name].bundle.css', allChunks: true, disable: false }),
    new WebpackPlugin.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV === CONSTANTS.production ? CONSTANTS.production : CONSTANTS.development),
      },
    }),
  ],
};
