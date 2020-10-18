import config from '../../../config';
import path from 'path';
import { isNil } from 'lodash';

export async function startBlockchainServer(runMigration: boolean) {
  if (!runMigration) return;
  const TruffleConfig = require('@truffle/config');
  const migrateTruffle = require('@truffle/core/lib/commands/migrate');
  return new Promise((reject, resolve) => {
    console.info('📜 Migrating smart contracts...');
    try {
      const truffleConfig = TruffleConfig.load(
        path.join(__dirname, '../../../truffle-config.js')
      ).with({ network: 'development' });
      migrateTruffle.run(truffleConfig, (res) => {
        console.info('✅ Migration complete');
        resolve();
      });
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}

export function needsMigration() {
  try {
    const crate = require('../../artifacts/NiftyCrate.json');
    const opener = require('../../artifacts/NiftyCrateOpener.json');
    return (
      isNil(crate.networks[config.ETH_NETWORK_ID].address) ||
      isNil(opener.networks[config.ETH_NETWORK_ID].address)
    );
  } catch {
    return true;
  }
}
