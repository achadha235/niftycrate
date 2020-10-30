const path = require('path');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = (config, { env }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('babel-loader'),
    options: {
      presets: ['next', ['react-app', { flow: false, typescript: true }]],
      plugins: ['react-require'],
    },
  });

  config.module.rules.push({
    test: /\.scss$/,
    loaders: [
      // Loader for webpack to process CSS with PostCSS
      'style-loader',
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
        },
      },
    ],

    include: path.resolve(__dirname, '../'),
  });
  config.resolve.alias = {
    'tailwind.config': './tailwind.config.ts',
  };
  config.resolve.alias['next/config'] = path.resolve(
    path.join(__dirname, '../mocks/next/config.js')
  );
  config.resolve.alias['next/router'] = path.resolve(
    path.join(__dirname, '../mocks/next/router.js')
  );

  config.resolve.alias['tailwind.config'] = path.resolve(
    path.join(__dirname, './tailwind.config.js')
  );
  config.output = {};
  config.output.publicPath = 'http://localhost:6006/';
  config.resolve.extensions.push('.ts', '.tsx');
  config.resolve.plugins = [
    new TsconfigPathsPlugin({ configFile: 'tsconfig.json' }),
  ];

  return {
    ...config,
    plugins: [
      ...(config.plugins || []),
      new webpack.ProvidePlugin({ React: 'react' }),
    ],
  };
};
