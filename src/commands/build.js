const parseArgs = require('minimist');
const { createRunner } = require('haste-core');
const LoggerPlugin = require('../plugins/haste-plugin-logger');

const { SRC_DIR, DIST_DIR } = require('../config/constants');

const runner = createRunner({
  logger: new LoggerPlugin(),
});

module.exports = runner.command(async tasks => {
  const { copy, sass, typescript } = tasks;
  const cliArgs = parseArgs(process.argv.slice(3));
  const transpileDot = tasks[require.resolve('../tasks/haste-task-dotjs')];

  await Promise.all([
    transpileJavascript(),
    transpileCSS(),
    transpileTemplates(),
  ]);

  if (cliArgs['copy-assets']) {
    await copyAssets();
  }

  function transpileJavascript() {
    return typescript({
      project: 'tsconfig.json',
      rootDir: '.',
      outDir: `./${DIST_DIR}/`,
    });
  }

  function transpileCSS() {
    return sass({ pattern: `${SRC_DIR}/**/*.scss`, target: DIST_DIR });
  }

  function transpileTemplates() {
    return transpileDot(
      { pattern: `${SRC_DIR}/**/*.dot`, target: DIST_DIR },
      { title: 'haste-task-dotjs' },
    );
  }

  function copyAssets() {
    return Promise.all([
      copy(
        { pattern: `${SRC_DIR}/**/*.html`, target: DIST_DIR },
        { title: 'copy-assets' },
      ),
    ]);
  }
});
