const path = require('path');
const presetConfig = require('./presetConfig');
const postcss = require('./rollup/plugins/postcss');
const commonjs = require('./rollup/plugins/commonjs');

const typescript = require('rollup-plugin-typescript2');
const nodeResolve = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify');
const dot = require('rollup-plugin-dot');
const parseEntry = require('./bundle/parseEntry');
const { DOTJS_OPTIONS } = require('./constants');

module.exports = ({
  entry = presetConfig.entry,
  exports = presetConfig.exports,
  debug,
  srcDir,
  distDir,
} = {}) => {
  entry = parseEntry(entry);

  return Object.keys(entry).map(entryName => ({
    input: path.join(srcDir, entry[entryName]),
    plugins: [
      nodeResolve({
        jsnext: true,
        preferBuiltins: false,
      }),
      commonjs(),
      postcss({
        debug,
        file: path.join(
          distDir,
          `${entryName}.rollup.bundle${debug ? '' : '.min'}.css`,
        ),
      }),
      dot({
        templateSettings: DOTJS_OPTIONS,
      }),
      typescript({
        verbosity: 1,
        tsconfigOverride: {
          compilerOptions: {
            module: 'ES2015',
          },
        },
      }),
      ...(debug ? [] : [uglify()]),
    ],
    output: {
      name: exports,
      format: 'umd',
      file: path.join(
        distDir,
        `${entryName}.rollup.bundle${debug ? '' : '.min'}.js`,
      ),

      // https://rollupjs.org/guide/en#exports
      exports: 'named',
      sourcemap: true,
    },
  }));
};
