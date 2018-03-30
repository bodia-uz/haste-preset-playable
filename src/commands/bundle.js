const path = require('path');
const parseArgs = require('minimist');
const { createRunner } = require('haste-core');

const LoggerPlugin = require('../plugins/haste-plugin-logger');

const { isEntryString } = require('../config/bundle/parseEntry');
const { SRC_DIR, BUNDLE_DIR, BundleMode } = require('../config/constants');
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
      bundleWebpack(configParams, cliArgs.mode),
      bundleRollup(configParams, cliArgs.mode),
    ]);
  }

  if (cliArgs.webpack) {
    await bundleWebpack(configParams, cliArgs.mode);
  }

  if (cliArgs.rollup) {
    await bundleRollup(configParams, cliArgs.mode);
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

  function bundleRollup(configParams, mode) {
    const configPath = require.resolve('../config/rollup.config');
    const results = [];

    if (!mode || mode === BundleMode.PRODUCTION) {
      results.push(
        rollup(
          { configPath, configParams: { ...configParams, debug: false } },
          { title: 'rollup-production' },
        ),
      );
    }

    if (!mode || mode === BundleMode.DEVELOPMENT) {
      results.push(
        rollup(
          { configPath, configParams: { ...configParams, debug: true } },
          { title: 'rollup-development' },
        ),
      );
    }

    return Promise.all(results);
  }

  function bundleWebpack(configParams, mode) {
    const configPath = require.resolve('../config/webpack.config');
    const results = [];

    if (!mode || mode === BundleMode.PRODUCTION) {
      results.push(
        webpack(
          { configPath, configParams: { ...configParams, debug: false } },
          { title: 'webpack-production' },
        ),
      );
    }

    if (!mode || mode === BundleMode.DEVELOPMENT) {
      results.push(
        webpack(
          { configPath, configParams: { ...configParams, debug: true } },
          { title: 'webpack-development' },
        ),
      );
    }

    return Promise.all(results);
  }
});
