const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const parseEntry = require('./bundle/parseEntry');
const { DOTJS_OPTIONS } = require('./constants');

module.exports = ({
  entry,
  exports,
  devServer,
  debug = devServer,
  srcDir,
  distDir,
} = {}) => {
  entry = parseEntry(entry);

  return {
    context: srcDir,
    entry: entry,
    mode: debug ? 'development' : 'production',
    resolve: {
      modules: ['node_modules'],

      extensions: ['.js', '.ts'],
      symlinks: false,
    },
    resolveLoader: {
      modules: [
        path.join(__dirname, '..', '..', 'node_modules'),
        'node_modules',
      ],
    },
    optimization: {
      minimize: !debug,
    },
    module: {
      rules: [
        require('../loaders/typescript')(),
        require('../loaders/dot')(DOTJS_OPTIONS),
        require('../loaders/assets')(),
        require('../loaders/svg')(),
        ...require('../loaders/sass')({ debug }),
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': debug ? '"development"' : '"production"',
      }),
      ...(devServer ? [new HtmlWebpackPlugin({ template: 'index.html' })] : []),
    ],
    devtool: 'source-map',
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      __dirname: true
    },
    output: {
      umdNamedDefine: true,
      path: distDir,
      filename: debug ? '[name].bundle.js' : '[name].bundle.min.js',
      pathinfo: debug,
      library: exports,
      libraryTarget: 'umd',
    },
    target: 'web'
  };
};
