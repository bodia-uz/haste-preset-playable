function isEntryString(string) {
  return string.includes('=');
}

function parseEntry(entry) {
  if (typeof entry === 'string') {
    const [entryName, entryPath] = isEntryString(entry)
      ? entry.split('=')
      : ['playable', entry];

    return {
      [entryName]: entryPath,
    };
  }

  if (
    Array.isArray(entry) &&
    entry.length &&
    entry.every(e => e.includes('='))
  ) {
    return entry.reduce(
      (results, e) => Object.assign(results, parseEntry(e)),
      {},
    );
  }

  if (typeof entry !== 'object' || Array.isArray(entry)) {
    throw new Error(
      'bundle `entry` option should by object like `{ app: "./index.js" }`, ' +
        'string like "./index.js" or ' +
        'string(s) like `app="./index.js"`',
    );
  }

  return entry;
}

module.exports = parseEntry;
module.exports.isEntryString = isEntryString;
