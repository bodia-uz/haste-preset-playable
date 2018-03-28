const path = require('path');

const packageJSON = require(path.resolve('package.json'));

module.exports = (packageJSON.haste && packageJSON.haste.presetConfig) || {};
