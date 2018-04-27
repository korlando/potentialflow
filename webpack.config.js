const argv = require('minimist')(process.argv.slice(2));
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const production = Boolean(argv.p);
const htmlConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body',
  minify: {
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
  },
});

module.exports = {
  mode: production ? 'production' : 'development',
  entry: {
    app: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, './www'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, './src'),
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { url: false } },
        ],
        include: [path.resolve(__dirname, './src/styles')],
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, './src/styles'),
      },
    ],
  },
  plugins: [htmlConfig],
};
