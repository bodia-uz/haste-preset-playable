#!/usr/bin/env node
const prog = require('caporal');
const runCLI = require('../src/cli');
const {version} = require('../package');
const {BOOL} = prog;

prog
  .version(version)
  .description('haste-preset-yoshi');

prog.command('lint', 'Run the linter')
  .option('--fix', 'Automatically fix lint problems')
  .action(() => runCLI('lint'));

prog.command('test', 'Run unit tests and e2e tests if exists')
  .option('--mocha', 'Run unit tests with Mocha', BOOL)
  .option('--jasmine', 'Run unit tests with Jasmine', BOOL)
  .option('--karma', 'Run unit tests with Karma', BOOL)
  .option('--jest', 'Run tests with Jest', BOOL)
  .option('--protractor', 'Run e2e tests with Protractor', BOOL)
  .action(() => runCLI('test'));

prog.command('build', 'Build the app for production')
  .option('--output', 'The output directory for static assets', /\w+/, 'statics')
  .option('--analyze', 'Run webpack-bundle-analyzer plugin', BOOL)
  .action(() => runCLI('build'));

prog.command('start', 'Run the app in development mode (also spawns npm test)')
  .option('-e, --entry-point', 'Entry point for the app', /\w+/, './dist/index.js')
  .option('--manual-restart', 'Get SIGHUP on change and manage application reboot manually', BOOL, 'false')
  .option('--no-test', 'Do not spawn npm test after start', BOOL, 'false')
  .option('--no-server', 'Do not spawn the app server', BOOL, 'false')
  .action(() => runCLI('start'));

prog.command('release', 'publish the package, should be used by CI')
  .action(() => runCLI('release'));

prog.parse(process.argv);

process.on('unhandledRejection', error => {
  throw error;
});
