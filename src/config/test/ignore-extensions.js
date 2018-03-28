const fs = require('fs');
const dotLoader = require('dotjs-loader').default;
const path = require('path');

const { DOTJS_OPTIONS } = require('../constants');

function conditionedProxy(predicate = () => {}) {
  return new Proxy(
    {},
    {
      get: (target, name) => (predicate(name) ? conditionedProxy() : name),
    },
  );
}

function mockCssModules(module) {
  module.exports = conditionedProxy(name => name === 'default');
}

function loadDotModules(module) {
  const query = fs.readFileSync(module.filename, 'utf-8');
  const scopedLoader = dotLoader.bind({ query: DOTJS_OPTIONS });
  const output = scopedLoader(query).replace(
    'export default ',
    'module.exports.default = ',
  );

  module.exports = {};

  eval(output);
}

function mockMediaModules(module) {
  module.exports = path.basename(module.filename);
}

require.extensions['.css'] = mockCssModules;
require.extensions['.scss'] = mockCssModules;

require.extensions['.dot'] = loadDotModules;

require.extensions['.png'] = mockMediaModules;
require.extensions['.svg'] = mockMediaModules;
require.extensions['.jpg'] = mockMediaModules;
require.extensions['.jpeg'] = mockMediaModules;
require.extensions['.gif'] = mockMediaModules;

require.extensions['.wav'] = mockMediaModules;
require.extensions['.mp3'] = mockMediaModules;
