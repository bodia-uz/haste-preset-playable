const webpack = require('webpack');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');

module.exports = async ({
  configPath,
  configParams,
  port = 9200,
  hostname = 'localhost',
}) => {
  return new Promise(resolve => {
    const app = express();

    let config = require(configPath);

    if (typeof config === 'function') {
      config = config(configParams);
    }

    const compiler = webpack(config);

    app.use(webpackDevMiddleware(compiler, {
      stats: "minimal"
    }));

    app.listen(port, hostname, () => {
      console.log(`Starting server on http://${hostname}:${port}`);

      resolve();
    });
  });
};
