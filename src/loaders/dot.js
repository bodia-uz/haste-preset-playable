const DEFAULT_OPTIONS = {
  varname: 'props',
  interpolate: /\$\{([\s\S]+?)\}/g,
  selfcontained: true,
};

module.exports = (options = DEFAULT_OPTIONS) => ({
  test: /\.dot$/,
  exclude: /node_modules/,
  loader: 'dotjs-loader',
  options: options
});

module.exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
