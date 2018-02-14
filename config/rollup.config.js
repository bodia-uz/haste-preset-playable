const path = require('path');
const projectConfig = require('./project');
const postcss = require('./rollup/plugins/postcss');
const commonjs = require('./rollup/plugins/commonjs');

const typescript = require('rollup-plugin-typescript2');
const nodeResolve = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify');
const dot = require('rollup-plugin-dot');
const dotOptions = require('../src/loaders/dot.js').DEFAULT_OPTIONS;

function getEntry() {
  const entry = projectConfig.entry() || projectConfig.defaultEntry();

  if (typeof entry === 'string') {
    return {app: entry};
  }

  return entry;
}

const srcDir = path.resolve('./src');
const distDir = path.resolve('./dist/statics');

module.exports = ({debug, separateCss = projectConfig.separateCss()} = {}) => {
  const entry = getEntry();

  if (Array.isArray(entry)) {
    throw new Error('Array `entry` is not supported');
  }

  return Object.keys(entry).map(entryName => ({
    input: path.join(srcDir, entry[entryName]),
    plugins: [
      nodeResolve({
        jsnext: true,
        preferBuiltins: false
      }),
      commonjs(),
      postcss({
        debug,
        separateCss,
        file: path.join(distDir, `${entryName}.rollup.bundle${debug ? '' : '.min'}.css`),
      }),
      dot({
        templateSettings: dotOptions
      }),
      typescript({
        verbosity: 1
      }),
      ...debug ? [] : [uglify()]
    ],
    output: {
      name: projectConfig.exports(),
      format: 'umd',
      file: path.join(distDir, `${entryName}.rollup.bundle${debug ? '' : '.min'}.js`),

      // https://rollupjs.org/guide/en#exports
      exports: 'named',
      sourcemap: true,
    },
  }));
};
