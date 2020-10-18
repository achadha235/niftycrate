import NiftyCrateArtifacts from 'src/artifacts/NiftyCrate.json';

import { Paper, Typography } from '@material-ui/core';
import {
  useDrizzle,
  useDrizzleState,
  AccountData,
  ContractData,
  ContractForm,
} from 'src/utils/drizzle';

function AdminContainer() {
  const drizzleState = useDrizzleState((state) => state);
  const { drizzle } = useDrizzle();

  return (
    <Paper className='w-screen h-screen p-4'>
      <AccountData
        drizzle={drizzle}
        drizzleState={drizzleState}
        accountIndex={0}
        units='ether'
        precision={3}
      />
      <Typography variant='h4'>NiftyCrates</Typography>
      <ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract={'NiftyCrate'}
        method='owner'
        render={(owner) => (
          <Typography variant='body2'>
            <b>Owner: </b>
            {owner}
          </Typography>
        )}
      />
      <ContractForm
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract={'NiftyCrate'}
        method='transferOwnership'
      />

      <br />
      <ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract={'NiftyCrate'}
        method='crateOpener'
        render={(owner) => (
          <Typography variant='body2'>
            <b>Crate Opener: </b>
            {owner}
          </Typography>
        )}
      />
      <ContractForm
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract={'NiftyCrate'}
        method='setCrateOpener'
      />

      <h3 className='mt-3'>Set fees</h3>
      <ContractForm
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract={'NiftyCrate'}
        method='setFees'
      />

      <h3 className='mt-3'> Set Token Ranking</h3>
      <ContractForm
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract={'NiftyCrate'}
        method='setTokenRanking'
      />

      <h3 className='mt-3'> Enable Token</h3>
      <ContractForm
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract={'NiftyCrate'}
        method='setTokenIsEnabled'
      />

      <h3 className='mt-3'>Balance</h3>
      <ContractForm
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract={'NiftyCrate'}
        method='balanceOf'
      />

      <h3 className='mt-3'>Mint</h3>
      <ContractForm
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract={'NiftyCrate'}
        method='mint'
      />
    </Paper>
  );
}

export default AdminContainer;
