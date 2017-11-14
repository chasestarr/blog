const path = require('path');

const src = path.resolve(__dirname, 'src');
const main = path.resolve(src, 'main.jsx');
const dist = path.join(__dirname, 'dist');

module.exports = {
  context: src,
  entry: main,
  output: {
    filename: 'bundle.js',
    path: dist,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [src, 'node_modules'],
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        exclude: /node_modules/,
        test: /\.jsx?$/,
        include: [src],
      },
    ],
  },
};
