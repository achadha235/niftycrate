module.exports = {
  contracts_directory: './src/contracts',
  contracts_build_directory: './src/artifacts',
  migrations_directory: './migrations',
  networks: {},
  plugins: ["solidity-coverage"],
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions : { currency: "USD", src: "src/contracts" }

  },
  compilers: {
    solc: {
      version: '0.6.12',
      optimizer: {
        enabled: true,
        runs: 200,
      }
    },
  },
};
