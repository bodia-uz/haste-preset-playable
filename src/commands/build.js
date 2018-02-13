const path = require('path');
const {createRunner} = require('haste-core');
const LoggerPlugin = require('../plugins/haste-plugin-yoshi-logger');
const parseArgs = require('minimist');
const globs = require('../globs');
const {
  runIndividualTranspiler,
  petriSpecsConfig,
  clientProjectName,
  clientFilesPath,
} = require('../../config/project');
const {
  watchMode,
  isTypescriptProject,
  isBabelProject,
  shouldRunWebpack,
  shouldRunSass,
} = require('../utils');

const runner = createRunner({
  logger: new LoggerPlugin()
});

const shouldWatch = watchMode();
const cliArgs = parseArgs(process.argv.slice(2));

module.exports = runner.command(async tasks => {
  if (shouldWatch) {
    return;
  }

  const {
    clean,
    copy,
    babel,
    sass,
    webpack,
    typescript,
    wixPetriSpecs,
    wixDepCheck,
    wixUpdateNodeVersion,
    wixMavenStatics,
  } = tasks;

  const transpileDot = tasks[require.resolve('../tasks/transpileDot.js')];

  await Promise.all([
    clean({pattern: `{dist,target}/*`}),
    wixUpdateNodeVersion(),
    wixDepCheck()
  ]);

  await Promise.all([
    transpileJavascript(),
    ...transpileCss(),
    transpileDot({
      pattern: `${globs.base()}/**/*.dot`,
      target: 'dist'
    }),
    copy({pattern: [
      `${globs.base()}/assets/**/*`,
      `${globs.base()}/**/*.{ejs,html,vm}`,
      `${globs.base()}/**/*.{css,json,d.ts}`,
    ], target: 'dist'}, {title: 'copy-server-assets'}),
    copy({pattern: [
      `${globs.assetsLegacyBase()}/assets/**/*`,
      `${globs.assetsLegacyBase()}/**/*.{ejs,html,vm}`,
    ], target: 'dist/statics'}, {title: 'copy-static-assets-legacy'}),
    copy({
      pattern: [
        `assets/**/*`,
        `**/*.{ejs,html,vm}`,
      ],
      source: globs.assetsBase(),
      target: 'dist/statics'
    }, {title: 'copy-static-assets'}),
    bundle(),
    wixPetriSpecs({config: petriSpecsConfig()}),
    wixMavenStatics({
      clientProjectName: clientProjectName(),
      staticsDir: clientFilesPath()
    })
  ]);

  function bundle() {
    const configPath = require.resolve('../../config/webpack.config.client');
    const productionCallbackPath = require.resolve('../webpack-production-callback');
    const developmentCallbackPath = require.resolve('../webpack-development-callback');
    const webpackConfig = require(configPath)();

    const defaultOptions = {
      configPath
    };

    if (shouldRunWebpack(webpackConfig)) {
      return Promise.all([
        webpack({...defaultOptions, callbackPath: productionCallbackPath, configParams: {debug: false, analyze: cliArgs.analyze}}, {title: 'webpack-production'}),
        webpack({...defaultOptions, callbackPath: developmentCallbackPath, configParams: {debug: true}}, {title: 'webpack-development'})
      ]);
    }

    return Promise.resolve();
  }

  function transpileCss() {
    return [
      !shouldRunSass() ? null :
        sass({
          pattern: globs.sass(),
          target: 'dist',
          options: {includePaths: ['node_modules', 'node_modules/compass-mixins/lib']}
        }),
    ].filter(a => a);
  }

  function transpileJavascript() {
    if (isTypescriptProject() && runIndividualTranspiler()) {
      return typescript({project: 'tsconfig.json', rootDir: '.', outDir: './dist/'});
    }

    if (isBabelProject() && runIndividualTranspiler()) {
      return babel({pattern: [path.join(globs.base(), '**', '*.js{,x}'), 'index.js'], target: 'dist'});
    }

    return Promise.resolve();
  }
}, {persistent: !!cliArgs.analyze});
