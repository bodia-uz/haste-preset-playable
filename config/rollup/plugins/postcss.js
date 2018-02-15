const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');

const plugin =
  ({debug, separateCss, file}) =>
    postcss({
      modules: {
        generateScopedName: debug ? '[name]__[local]___[hash:base64:5]' : '__[hash:base64:5]'
      },
      plugins: [
        autoprefixer(),
      ],
      extract: separateCss && file,
      sourceMap: separateCss,
      minimize: !debug
    });

module.exports = plugin;
