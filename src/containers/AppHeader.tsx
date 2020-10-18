import { Button, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Link from 'next/link';
import { useDrizzle, useDrizzleState } from 'src/utils/drizzle';
import shortAddress from 'src/utils/shortAddress';
import NextNprogress from 'nextjs-progressbar';
import tailwindConfig from '../../tailwind.config';
import Web3 from 'web3';

function AppHeaderContainer() {
  const { account, balance } = useDrizzleState((drizzleState) => {
    return {
      account: drizzleState.accounts[0],
      balance: drizzleState.accountBalances[drizzleState.accounts[0]],
    };
  });

  const { useCacheSend, useCacheCall } = useDrizzle();
  const NC = 'NiftyCrate';
  const NCO = 'NiftyCrateOpener';
  const mint = useCacheSend(NC, 'mint');
  const generateNonces = useCacheSend(NCO, 'generateNonces');
  const { numTokens, numGems, mintCost } = useCacheCall([NC, NCO], (call) => ({
    numTokens: call(NC, 'balanceOf', account),
    mintCost: call(NC, 'balanceOf', account),
    numGems: call(NCO, 'numberOfNonces', account),
  }));
  const onBuyCrate = () => mint.send(account);
  const onBuyGems = () => generateNonces.send(10);
  return (
    <>
      <div className='progressWrapper'>
        <NextNprogress
          color={tailwindConfig.theme.colors.blue[300]}
          startPosition={0.5}
          stopDelayMs={200}
          height={3}
        />
      </div>
      <AppBar style={{ marginTop: 3 }}>
        <Toolbar variant='dense'>
          <Link href='/'>
            <Typography variant='body2'>NiftyCrates</Typography>
          </Link>
          <Button variant='text' className='ml-20' color='inherit'>
            📦 My Crates ({numTokens})
          </Button>
          <Button
            onClick={onBuyCrate}
            className='ml-2'
            color='primary'
            size='small'
            variant='outlined'
          >
            Buy a Crate
          </Button>
          <Button variant='text' className='ml-10' color='inherit'>
            💎 Gems ({numGems})
          </Button>
          <Button
            color='secondary'
            size='small'
            variant='outlined'
            onClick={onBuyGems}
            className='ml-2'
          >
            Buy 10 Gems
          </Button>
          <Button variant='text' className='ml-auto' color='inherit'>
            <b>Ξ </b> ETH ({Web3.utils.fromWei(balance, 'ether').slice(0, 5)})
          </Button>
          {account ? (
            <Button color='inherit'>{shortAddress(account)}</Button>
          ) : (
            <Button color='inherit'>Login</Button>
          )}
        </Toolbar>
      </AppBar>
      <style jsx>{`
        .progressWrapper {
          height: 3px !important;
          width: 100vw;
          background: black;
        }
      `}</style>
    </>
  );
}

export default AppHeaderContainer;
