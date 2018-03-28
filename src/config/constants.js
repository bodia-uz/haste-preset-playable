const SRC_DIR = 'src';
const DIST_DIR = 'dist';
const BUNDLE_DIR = `${DIST_DIR}/statics`;
const SPEC_PATTERN = `${SRC_DIR}/**/*.+(spec|it).+(js|ts){,x}`;

const DOTJS_OPTIONS = {
  varname: 'props',
  interpolate: /\$\{([\s\S]+?)\}/g,
  selfcontained: true,
};

module.exports = {
  SRC_DIR,
  DIST_DIR,
  BUNDLE_DIR,
  SPEC_PATTERN,
  DOTJS_OPTIONS,
};
