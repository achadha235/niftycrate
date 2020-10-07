const path = require('path');
const dotenv = require('dotenv');
const { parsed, error } = dotenv.config({
  path: path.join(__dirname, `.env.${process.env.NODE_ENV || 'development'}`),
});

if (error) {
  throw error;
}

module.exports = {
  NODE_ENV: String(parsed.NODE_ENV),
  ETH_NETWORK_ID: Number(parsed.ETH_NETWORK_ID),
  MNEMONIC: String(parsed.MNEMONIC),
  ETH_RPC_HOST: String(parsed.ETH_RPC_HOST),
  ETH_RPC_PORT: Number(parsed.ETH_RPC_PORT),
  BLOCK_TIME_SECONDS: Number(parsed.BLOCK_TIME_SECONDS),
};
