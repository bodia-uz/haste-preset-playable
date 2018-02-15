const path = require('path');
const dotLoader = require('dotjs-loader').default;
const dotOptions = require('../loaders/dot').DEFAULT_OPTIONS;

const dotLoaderWithOptions = dotLoader.bind({query: dotOptions});

function transpileDotFile(content) {
  const fnString = dotLoaderWithOptions(content).replace('export default ', '');

  return `module.exports = {
    __esModule: true,
    default: ${fnString} 
  };`;
}

async function transpileDot({pattern, target, cwd = process.cwd(), source}, {fs: fsService}) {
  const files = await fsService.read({pattern, cwd, source});

  return Promise.all(
    files.map(async ({filename, content, cwd: sourceCwd}) => {
      const absoluteTarget = path.isAbsolute(target) ? target : path.join(sourceCwd, target);

      return fsService.write({
        filename: filename + '.js',
        target: absoluteTarget,
        content: transpileDotFile(content)
      });
    }),
  );
}

module.exports = transpileDot;
