module.exports = options => ({
  test: /\.dot$/,
  exclude: /node_modules/,
  loader: 'dotjs-loader',
  options: options,
});
