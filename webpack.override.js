const path = require('path');
const webpack = require('webpack');
// const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

// const resolveFrom = require('resolve-from');
// const rootDir = process.cwd();
// const styleLoaderPath = resolveFrom.silent(rootDir, 'style-loader');
// const cssLoaderPath = resolveFrom.silent(rootDir, 'css-loader');
// const postcssLoaderPath = resolveFrom.silent(rootDir, 'postcss-loader');

module.exports = (config, { env }) => {
  // console.log(config.module.rules[1]);

  // console.log(config.module.rules[1].use[2]);

  // config.module.rules[1].use[2] = {
  //   loader: config.module.rules[1].use[2],
  //   options: {
  //     plugins: ['tailwindcss'],
  //   },
  // };

  // console.log(config.module.rules[1].use[2]);

  // config.module.rules[1].use[1] = {
  //   test: /\.css$/,
  //   use: [
  //     styleLoaderPath,
  //     { loader: cssLoaderPath, options: { importLoaders: 1 } },
  //     postcssLoaderPath,
  //   ],
  //   exclude: /node_modules/,
  // };

  // console.log(config.module.rules[1].use[1]);

  return {
    ...config,
    resolve: {
      ...(config.resolve || []),
      alias: {
        ...(config.resolve ? config.resolve.alias : {}),
        'tailwind.config': path.join(__dirname, './tailwind.config.js'),
      },
    },
    plugins: [
      ...(config.plugins || []),
      new webpack.ProvidePlugin({ React: 'react' }),
    ],
  };
};
