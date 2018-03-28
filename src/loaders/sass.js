const GLOBAL_CSS_PATTERN = /\.global\.s?css$/;

const styleLoader = ({ debug }) => ({
  loader: 'style-loader',
  options: {
    singleton: true,
    sourceMap: debug,
  },
});

const cssLoader = ({ debug, modules }) => ({
  loader: 'css-loader',
  options: {
    camelCase: true,
    localIdentName: debug
      ? '[path][name]__[local]__[hash:base64:5]'
      : '[hash:base64:5]',
    modules: modules,
    sourceMap: debug,
    importLoaders: 2,
  },
});

const postCssLoader = ({ debug }) => ({
  loader: 'postcss-loader',
  options: {
    plugins: [require('autoprefixer')()],
    sourceMap: debug,
  },
});

const sassLoader = ({ debug }) => ({
  loader: 'sass-loader',
  options: {
    sourceMap: debug,
  },
});

const loaders = ({ modules, debug }) => [
  styleLoader({ debug }),
  cssLoader({
    debug,
    modules,
  }),
  postCssLoader({ debug }),
  sassLoader({ debug }),
];

module.exports = ({ debug }) => {
  return [
    {
      test: /\.s?css$/,
      include: GLOBAL_CSS_PATTERN,
      use: loaders({ modules: false, debug }),
    },
    {
      test: /\.s?css$/,
      exclude: GLOBAL_CSS_PATTERN,
      use: loaders({ modules: true, debug }),
    },
  ];
};
