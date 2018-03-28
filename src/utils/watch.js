const chokidar = require('chokidar');

function watch(
  { pattern, cwd = process.cwd(), ignoreInitial = true, ...options },
  callback,
) {
  return chokidar
    .watch(pattern, { cwd, ignoreInitial, ...options })
    .on('all', (event, path) => callback(path));
}

module.exports = watch;
