const helpers = require('./happyPackHelpers');

module.exports = () => {
  const loaders = [
    {
      loader: 'babel-loader'
    }
  ].filter(it => it);

  return helpers.createHappyPlugin('js', loaders);
};
