const config = require('./config');

const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  contracts_directory: './src/contracts',
  contracts_build_directory: './src/artifacts',
  migrations_directory: './migrations',
  networks: {
    development: {
      network_id: '*',
      provider: function () {
        return new HDWalletProvider(config.MNEMONIC, 'http://127.0.0.1:8545');
      },
    },
    rinkeby: {
      network_id: '4',
      provider: function () {
        return new HDWalletProvider(
          config.MNEMONIC,
          'https://rinkeby.infura.io/v3/1713b2b4d6e041e0b2ff25a5e7be6371'
        );
      },
    },
    matic: {
      network_id: '80001',
      provider: function () {
        return new HDWalletProvider(
          config.MNEMONIC,
          'https://rpc-mumbai.matic.today'
        );
      },
    },
  },
  plugins: ['solidity-coverage', 'truffle-contract-size'],
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: { currency: 'USD', src: 'src/contracts' },
  },
  compilers: {
    solc: {
      version: '0.6.12',
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
