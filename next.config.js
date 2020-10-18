const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
} = require('next/constants');

const config = require('./config');

let withPlugins;
let withTM;
let optimizedImages;

withPlugins = require('next-compose-plugins');
withTM = require('next-transpile-modules');
optimizedImages = require('next-optimized-images');

module.exports = withPlugins(
  [optimizedImages, [withTM, { transpileModules: [] }]],

  {
    target: 'server',
    pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
    distDir: '.next',
    serverRuntimeConfig: {
      // Will only be available on the server side
      ...config,
    },
    publicRuntimeConfig: {
      // Will be available on both server and client
      GQL_ENDPOINT: config.GQL_ENDPOINT,
      BLOCK_NATIVE_API_KEY: config.BLOCK_NATIVE_API_KEY,
      ETH_NETWORK_ID: config.ETH_NETWORK_ID,
      ETH_RPC_HOST: config.ETH_RPC_HOST,
      ETH_RPC_PORT: config.ETH_RPC_PORT,
    },
    experimental: {
      productionBrowserSourceMaps: true,
    },
    // webpack: (config, options) => {
    // config.node = {
    //   fs: "empty"
    // };

    // config.plugins.push(new DecoratorsPlugin({ legacy: true }))
    //   return config
    // },

    [PHASE_DEVELOPMENT_SERVER]: {
      distDir: '.next',
      assetPrefix: '',
      compress: false,
    },
    [PHASE_PRODUCTION_BUILD + PHASE_PRODUCTION_SERVER]: {
      distDir: './dist/build',
      assetPrefix: '', // TODO: add asset prefix for deployed production bundle
      compress: true,
    },
  }
);
