#!/usr/bin/env node
const prog = require('caporal');
const runCLI = require('../src/cli');
const { BundleMode } = require('../src/config/constants');
const { version } = require('../package');

const { BOOL, STRING } = prog;

const ENTRY_PATTERN = /.+=.+/;

prog.version(version).description('haste-preset-playable');

prog
  .command('test', 'Run unit tests if exists (mocha)')
  .option('--mocha', 'Run unit tests with Mocha', BOOL)
  .option('--karma', 'Run tests with Karma', STRING)
  .option('-w, --watch', 'Run tests on watch mode', BOOL)
  .action(() => runCLI('test'));

prog
  .command('start', 'Run the app in development mode')
  .argument('[entry]', 'The entry point to serve your app.', ENTRY_PATTERN)
  .action(() => runCLI('start'));

prog
  .command('clean', 'Clean build dist directory')
  .action(() => runCLI('clean'));

prog
  .command('build', 'Build the app for production')
  .option('--copy-assets', 'Copy html assets from src dir.', BOOL)
  .action((args, options) => runCLI('build', options));

prog
  .command('bundle', 'Bundle the app for production')
  .argument('[entry...]', 'The entry point to build your app.', entries => {
    if (!entries || !entries.length) {
      throw new Error('At least one entry should be defined');
    }
  })
  .option('--webpack', 'Bundle app with webpack.', BOOL)
  .option('--rollup', 'Bundle app with rollup.', BOOL)
  .option('--mode <mode>', 'Bundle mode.', [
    BundleMode.DEVELOPMENT,
    BundleMode.PRODUCTION,
  ])
  .option('--copy-assets', 'Copy html assets from src dir.', BOOL)
  .action(() => runCLI('bundle'));

prog.parse(process.argv);

// TODO: use parsed args in commands

process.on('unhandledRejection', error => {
  throw error;
});
