const path = require('path');

const sourceDirectory = path.join(__dirname, '/client/src/');
const publicDirectory = path.join(__dirname, '/public/');

/* eslint-disable */

module.exports = {
  entry: sourceDirectory,
  module: {
    rules: [
      {
        test: [/\.jsx$/],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env']
          }
        }
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: publicDirectory
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};