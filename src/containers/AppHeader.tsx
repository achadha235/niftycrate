import { Button, Paper, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Link from 'next/link';
import { useDrizzle, useDrizzleState } from 'src/utils/drizzle';
import shortAddress from 'src/utils/shortAddress';
import NextNprogress from 'nextjs-progressbar';
import tailwindConfig from '../../tailwind.config';
import Web3 from 'web3';
import { spawn } from 'child_process';
import Header from 'src/components/Header';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { useState } from 'react';
import HowItWorks from 'src/components/HowItWorks';

import { useRouter } from 'next/router';
import { Store } from 'src/components/Store';
import formatEth from 'src/utils/formatEth';

function AppHeaderContainer() {
  const { account, balance } = useDrizzleState((drizzleState) => {
    return {
      account: drizzleState.accounts[0],
      balance: drizzleState.accountBalances[drizzleState.accounts[0]],
    };
  });

  const router = useRouter();

  const { useCacheSend, useCacheCall } = useDrizzle();
  const NC = 'NiftyCrate';
  const NCO = 'NiftyCrateOpener';
  const mint = useCacheSend(NC, 'mint');
  const generateNonces = useCacheSend(NCO, 'generateNonces');
  const { numTokens, numGems, mintCost } = useCacheCall([NC, NCO], (call) => ({
    numTokens: call(NC, 'balanceOf', account),
    mintCost: call(NC, 'mintingFee'),
    numGems: call(NCO, 'numberOfNonces', account),
  }));
  const onBuyCrate = () => mint.send(account, { value: mintCost });
  const onBuyGems = () => generateNonces.send(10);

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className='progressWrapper'>
        <NextNprogress
          color={tailwindConfig.theme.colors.indigo[500]}
          startPosition={0.5}
          stopDelayMs={200}
          height={3}
        />
      </div>

      <Header
        user={
          account
            ? {
                balance: formatEth(balance),
                address: account,
                numTokens,
                numGems,
              }
            : null
        }
        onAppNameClicked={() => router.push('/')}
        onStoreClicked={handleOpen}
        onAllCratesClicked={() => router.push('/')}
        onMyCratesClicked={() => {}}
        onHowItWorksClicked={() => router.push('/about')}
        onLoginClicked={() => {}}
        onLogoutClicked={() => {}}
      />

      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Paper className='p-4 px-5 my-10' style={{ width: 800 }}>
            <Store
              onBuyCrate={onBuyCrate}
              onBuyGems={onBuyGems}
              cratePrice={formatEth(mintCost)}
            />
          </Paper>
        </Fade>
      </Modal>

      {/* <AppBar className='appBar' style={{ marginTop: 3 }}>
        <Toolbar variant='dense'>
          <Link href='/'>
            <span className='uppercase text-sm font-medium tracking-widest cursor-pointer flex flex-row justify-center items-center'>
              <img className='mr-1 logo' src='/images/logo.svg' />
              <b>Nifty</b>Crates
            </span>
          </Link>
          <Link href={`/crates/${account}`}>
            <Button variant='text' className='ml-20' color='inherit'>
              📦 My Crates ({numTokens})
            </Button>
          </Link>
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
            <b className='pr-1'>Ξ</b>{' '}
            {Web3.utils.fromWei(balance, 'ether').slice(0, 5)}
          </Button>
          {account ? (
            <Button style={{ fontFamily: 'courier' }} color='inherit'>
              {shortAddress(account)}
            </Button>
          ) : (
            <Button color='inherit'>Login</Button>
          )}
        </Toolbar>
      </AppBar> */}
      <style jsx>{`
        .appBar {
          margintop: 1px;
        }
        .progressWrapper {
          height: 3px !important;
          width: 100vw;
          background: black;
        }
        .addressButton {
          font-family: 'Courier';
        }

        .logo {
          height: 25px;
          width: 25px;
        }
      `}</style>
    </>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);

export default AppHeaderContainer;
