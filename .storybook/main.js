const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  stories: ['../stories/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-viewport',
    '@storybook/addon-actions',
    '@storybook/addon-links',
  ],
  webpackFinal: async (config) => {
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
            /* 
              Enable Source Maps
             */
            sourceMap: true,
            /*
              Set postcss.config.js config path && ctx 
             */
            config: {
              path: './.storybook/',
            },
          },
        },
      ],

      include: path.resolve(__dirname, '../'),
    });
    // config.plugins.push();
    config.resolve.alias['next/config'] = path.resolve(
      path.join(__dirname, '../mocks/next/config.js')
    );
    config.resolve.alias['next/router'] = path.resolve(
      path.join(__dirname, '../mocks/next/router.js')
    );
    config.output.publicPath = 'http://localhost:6006/';
    config.resolve.extensions.push('.ts', '.tsx');
    config.resolve.plugins = [
      new TsconfigPathsPlugin({ configFile: 'tsconfig.json' }),
    ];
    return config;
  },
};
