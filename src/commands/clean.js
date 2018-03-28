const { createRunner } = require('haste-core');

const LoggerPlugin = require('../plugins/haste-plugin-logger');

const { DIST_DIR } = require('../config/constants');

const runner = createRunner({
  logger: new LoggerPlugin(),
});

module.exports = runner.command(async tasks => {
  await tasks.clean({ pattern: DIST_DIR });
});
