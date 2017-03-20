import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
  debug: true,
  devtool: 'cheap-module-eval-source-map',
  noInfo: false,
  entry: [
    'webpack-hot-middleware/client?reload=true',
    './client/index.js'
  ],
  target: 'web',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  devServer: {
    contentBase: './client'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('style.css')
  ],
  module: {
    loaders: [
      // Transpile ES6 to ES5
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: path.join(__dirname, 'client')
      },
      // SASS/SCSS to CSS
      {
        test: /\.scss$/,
        include: path.join(__dirname, 'client'),
        loader: ExtractTextPlugin.extract('css!sass')
      }
    ]
  }
};
