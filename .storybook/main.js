const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    // config.module.rules.push({
    //   test: /\.scss$/,
    //   use: ['style-loader', 'css-loader', 'sass-loader'],
    //   include: path.resolve(__dirname, '../'),
    // });

    config.module.rules[7].use[2].options = {
      sourceMap: true,
      plugins: [
        require('postcss-import'),
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    };

    // config.module.rules.push({
    //   test: /\.scss$/,
    //   use: ['style-loader', 'css-loader', 'sass-loader', ],
    //   include: path.resolve(__dirname, '../'),
    // });

    config.module.rules.push({
      test: /\.scss$/,
      use: [
        // Loader for webpack to process CSS with PostCSS
        'style-loader',
        'css-loader',
        'sass-loader',
        {
          loader: 'postcss-loader',
          options: {
            // sourceMap: true,c
            postcssOptions: {
              sourceMap: true,
              plugins: [
                require('postcss-import'),
                require('tailwindcss'),
                require('autoprefixer'),
              ],
            },
          },
        },
      ],

      include: path.resolve(__dirname, '../'),
    });

    config.resolve.alias['tailwind.config'] = path.resolve(
      path.join(__dirname, '../tailwind.config.js')
    );

    // config.plugins.push();
    config.resolve.alias['next/config'] = path.resolve(
      path.join(__dirname, '../mocks/next/config.js')
    );
    config.resolve.alias['next/router'] = path.resolve(
      path.join(__dirname, '../mocks/next/router.js')
    );

    // Return the altered config
    return config;
  },
};
