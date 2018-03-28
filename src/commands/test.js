const { createRunner } = require('haste-core');
const parseArgs = require('minimist');

const LoggerPlugin = require('../plugins/haste-plugin-logger');
const watch = require('../utils/watch');
const isTeamCity = require('../utils/isTeamCity');

const { SRC_DIR, SPEC_PATTERN } = require('../config/constants');

const runner = createRunner({
  logger: new LoggerPlugin(),
});

const cliArgs = parseArgs(process.argv.slice(3));
const shouldWatch = cliArgs.watch || cliArgs.w;

module.exports = runner.command(
  async tasks => {
    const { mocha } = tasks;

    const mochaOptions = {
      pattern: SPEC_PATTERN,
      requireFiles: [require.resolve('../config/mocha-setup')],
      timeout: 30000,
      reporter: isTeamCity() ? 'mocha-teamcity-reporter' : 'progress',
    };

    await mocha(mochaOptions);

    if (shouldWatch) {
      watch({ pattern: [SPEC_PATTERN, `${SRC_DIR}/**/*.{js,ts}`] }, () => {
        mocha(mochaOptions);
      });
    }
  },
  { persistent: shouldWatch },
);
