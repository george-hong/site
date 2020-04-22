const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
require('babel-polyfill');


const resolvePath = dir => path.join(__dirname, '..', dir);

const config = {
  entry: {
    main: ['babel-polyfill', path.join(__dirname, '../main.js')]
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'main.js'
  },
  resolve: {
    alias: {
      '@libs': resolvePath('src/libs'),
      '@request': resolvePath('config/request/request.js'),
      '@utilMethods': resolvePath('libs/utilMethods.js'),
      '@nameSpace': resolvePath('config/nameSpace'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
        loader: 'file-loader'
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }, {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: ['vue-style-loader', 'css-loader', 'sass-loader']
          },
          extractCSS: true,
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template : path.join(__dirname, "../src/pages/index.html"),
      filename : 'index.html'
    }),
    new ExtractTextPlugin("main.css")
  ]
};

module.exports = config;