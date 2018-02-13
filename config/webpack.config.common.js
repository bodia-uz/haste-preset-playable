const path = require('path');

const context = path.resolve('./src');
const projectConfig = require('./project');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const stylable = require('../src/loaders/stylable');

const config = {
  context,

  output: getOutput(),

  resolve: {
    modules: [
      'node_modules',
      context
    ],

    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    symlinks: false
  },

  resolveLoader: {
    modules: [path.join(__dirname, '..', 'node_modules'), 'node_modules']
  },

  plugins: [
    new CaseSensitivePathsPlugin(),
    require('../src/webpack-plugins/babelHappyPack')(),
    stylable.plugin()
  ],

  module: {
    rules: [
      ...projectConfig.features().externalizeRelativeLodash ? [require('../src/loaders/externalize-relative-lodash')()] : [],
      require('../src/loaders/babel')(),
      require('../src/loaders/typescript')(),
      require('../src/loaders/graphql')(),
      require('../src/loaders/dot')(),
      require('../src/loaders/assets')(),
      require('../src/loaders/svg')(),
      require('../src/loaders/html')(),
      require('../src/loaders/haml')(),
      require('../src/loaders/raw')(),
      stylable.rule()
    ]
  },

  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    __dirname: true
  },

  devtool: 'source-map',

  externals: projectConfig.externals()
};

function getOutput() {
  const libraryExports = projectConfig.exports();
  const output = {
    path: path.resolve('./dist'),
    pathinfo: true
  };

  if (libraryExports) {
    return Object.assign({}, output, {
      library: libraryExports,
      libraryTarget: 'umd'
    });
  }

  return output;
}

module.exports = config;
