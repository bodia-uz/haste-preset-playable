const commonjs = require('rollup-plugin-commonjs');

// TODO: it should be configurable
const plugin = () =>
  commonjs({
    include: 'node_modules/**',
    // Default: [ '.js' ]
    extensions: ['.js', '.ts'],
    sourceMap: false,
    namedExports: {
      'node_modules/eventemitter3/index.js': ['EventEmitter'],
    },
  });

module.exports = plugin;
