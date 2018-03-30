const path = require('path');
const parseArgs = require('minimist');
const { createRunner } = require('haste-core');

const LoggerPlugin = require('../plugins/haste-plugin-logger');

const { isEntryString } = require('../config/bundle/parseEntry');
const { SRC_DIR, BUNDLE_DIR } = require('../config/constants');
const presetConfig = require('../config/presetConfig');

const runner = createRunner({
  logger: new LoggerPlugin(),
});

function parseEntry(cliArgs) {
  const entry = cliArgs._.filter(isEntryString);
  if (entry.length) {
    return entry;
  }
}

module.exports = runner.command(
  async tasks => {
    const webpackDevServer =
      tasks[require.resolve('../tasks/haste-task-webpack-dev-server')];
    const configPath = require.resolve('../config/webpack.config');

    const cliArgs = parseArgs(process.argv.slice(3));
    const devServerConfig = presetConfig.devServer || {};

    const srcDir = path.resolve(SRC_DIR);
    const distDir = path.resolve(BUNDLE_DIR);

    await webpackDevServer(
      {
        configPath,
        configParams: {
          devServer: true,
          entry: parseEntry(cliArgs) || devServerConfig.entry,
          srcDir,
          distDir,
        },
        port: devServerConfig.port,
      },
      { title: 'haste-task-webpack-dev-server' },
    );
  },
  { persistent: true },
);
