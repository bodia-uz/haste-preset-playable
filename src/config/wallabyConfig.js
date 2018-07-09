const path = require('path');

module.exports = function (wallaby) {
  process.env.NODE_PATH += `:${path.join(wallaby.localProjectDir, 'node_modules')}`;

  return {
    files: [
      {pattern: 'src/**', instrument: true},
      {pattern: 'src/**/*.+(spec|it).ts*', ignore: true},
      {pattern: 'package.json', instrument: false}
    ],
    tests: [
      {pattern: 'src/**/*.+(spec|it).ts*'}
    ],
    testFramework: 'mocha',
    setup(wallaby) {
      const mocha = wallaby.testFramework;
      mocha.timeout(30000);
      process.env.IN_WALLABY = true;
      require('haste-preset-playable/src/config/testSetup');
    },
    env: {
      type: 'node',
      params: {
        env: `LOCAL_PATH=${process.cwd()}`
      }
    },
    workers: {
      initial: 1,
      regular: 1
    }
  };
};
