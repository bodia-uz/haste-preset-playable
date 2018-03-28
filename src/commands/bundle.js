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

module.exports = runner.command(async tasks => {
  const { copy, rollup, webpack } = tasks;
  const cliArgs = parseArgs(process.argv.slice(3));

  const srcDir = path.resolve(SRC_DIR);
  const distDir = path.resolve(BUNDLE_DIR);

  const configParams = {
    entry: parseEntry(cliArgs) || presetConfig.entry,
    exports: presetConfig.exports,
    srcDir,
    distDir,
  };

  if (cliArgs['copy-assets']) {
    await copyAssets();
  }

  if (!cliArgs.webpack && !cliArgs.rollup) {
    return Promise.all([
      bundleWebpack(configParams),
      bundleRollup(configParams),
    ]);
  }

  if (cliArgs.webpack) {
    await bundleWebpack(configParams);
  }

  if (cliArgs.rollup) {
    await bundleRollup(configParams);
  }

  function copyAssets() {
    return Promise.all([
      copy(
        {
          source: SRC_DIR,
          pattern: '**/*.html',
          target: BUNDLE_DIR,
        },
        { title: 'copy-bundle-assets' },
      ),
    ]);
  }

  function bundleRollup(configParams) {
    const configPath = require.resolve('../config/rollup.config');

    return Promise.all([
      rollup(
        { configPath, configParams: { ...configParams, debug: false } },
        { title: 'rollup-production' },
      ),
      rollup(
        { configPath, configParams: { ...configParams, debug: true } },
        { title: 'rollup-development' },
      ),
    ]);
  }

  function bundleWebpack(configParams) {
    const configPath = require.resolve('../config/webpack.config');

    return Promise.all([
      webpack(
        { configPath, configParams: { ...configParams, debug: false } },
        { title: 'webpack-production' },
      ),
      webpack(
        { configPath, configParams: { ...configParams, debug: true } },
        { title: 'webpack-development' },
      ),
    ]);
  }
});
