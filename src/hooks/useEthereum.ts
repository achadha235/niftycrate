import Web3 from 'web3';
import { useState, useEffect } from 'react';
import Onboard from 'bnc-onboard';
import { API as OnboardAPI } from 'bnc-onboard/dist/src/interfaces';
import { BNSelectedWallet } from 'src/constants';
import { Drizzle, generateStore } from '@drizzle/store';
import { Store } from 'redux';
import drizzleLoading from 'src/utils/drizzleLoading';
import { isNil } from 'lodash';

function useEthereum({ blockNativeKey, networkId, drizzleOptions }) {
  const [onboard, setOnboard] = useState<OnboardAPI>();
  const [web3, setWeb3] = useState<Web3>();
  const [drizzleStore, setDrizzleStore] = useState<Store>();
  const [drizzle, setDrizzle] = useState<Drizzle>();
  const [initialized, setInitialized] = useState<boolean>(false);

  const onWalletUpdated = (wallet) => {
    setWeb3(new Web3(wallet.provider));
    window.localStorage.setItem(BNSelectedWallet, wallet.name);
  };
  const onboardConfig = {
    dappId: blockNativeKey,
    networkId: networkId,
    subscriptions: {
      wallet: onWalletUpdated,
    },
  };

  useEffect(() => {
    if (onboard && web3) {
      let store = generateStore(drizzleOptions);
      setDrizzleStore(store);
      setDrizzle(new Drizzle(drizzleOptions, store));
    }
  }, [onboard, web3]);

  useEffect(() => {
    setOnboard(Onboard(onboardConfig));
  }, []);

  async function doLogin() {
    const previouslySelectedWallet = window.localStorage.getItem(
      BNSelectedWallet
    );
    try {
      if (previouslySelectedWallet) {
        await onboard.walletSelect(previouslySelectedWallet);
      } else {
        await onboard.walletSelect();
      }
      await onboard.walletCheck();
    } catch (err) {
      console.error('You must log in with a wallet');
    }
  }

  useEffect(() => {
    if (onboard) {
      doLogin();
    }
  }, [onboard]);

  useEffect(() => {
    setInitialized(
      !isNil(onboard) &&
        !isNil(web3) &&
        !isNil(drizzleStore) &&
        drizzleLoading(drizzleStore.getState())
    );
  }, [onboard, web3, drizzleStore, drizzleLoading(drizzleStore)]);

  return { onboard, web3, drizzle, drizzleStore, initialized };
}

export default useEthereum;
