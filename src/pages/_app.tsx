import '../styles/main.scss';
import pkg from '../../package.json';
import { createContext } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeProvider } from '@material-ui/core/styles';
import Head from 'next/head';
import withApollo from '../gql/withApollo';
import tailwindConfig from '../../tailwind.config';
import theme from '../styles/theme';
import getConfig from 'next/config';
import Web3 from 'web3';
import { API as OnboardAPI } from 'bnc-onboard/dist/src/interfaces';
import NiftyCrate from 'src/artifacts/NiftyCrate.json';
import NiftyCrateOpener from 'src/artifacts/NiftyCrateOpener.json';
// import Axie from 'src/artifacts/Axie.json';
// import Cryptokitties from 'src/artifacts/Cryptokitties.json';

import { Drizzle } from '@drizzle/store';
import useEthereum from '../hooks/useEthereum';
import { drizzleReactHooks as DrizzleHooks } from '@drizzle/react-plugin';
import { Store } from 'redux';
import LoadingScreen from 'src/components/LoadingScreen';

interface IAppContext {
  name?: string;
  theme: typeof tailwindConfig;
  onboard?: OnboardAPI;
  web3?: Web3;
  drizzle?: Drizzle;
  drizzleStore?: Store;
}

export const AppContext = createContext<IAppContext>({
  name: pkg.name,
  theme: tailwindConfig,
});

function App({ Component, pageProps, apollo, router, ...otherProps }) {
  const { publicRuntimeConfig } = getConfig();
  const { drizzle, drizzleStore, web3, onboard, initialized } = useEthereum({
    blockNativeKey: publicRuntimeConfig.BLOCK_NATIVE_API_KEY,
    networkId: publicRuntimeConfig.ETH_NETWORK_ID,
    drizzleOptions: {
      contracts: [
        NiftyCrate,
        NiftyCrateOpener,
        // Cryptokitties, Axie
      ],
      events: {
        // NiftyCrate: ['CrateOpened', 'CrateConfigured'],
      },
      polls: {
        blocks: 3000,
        accounts: 1000,
      },
    },
  });
  const appContext = {
    name: pkg.name,
    theme: tailwindConfig,
    onboard,
    web3,
    drizzle,
    drizzleStore,
  };

  return (
    <>
      <Head>
        <title>Niftycrates</title>
        <link rel='icon' type='image/svg+xml' href='/images/logo.svg' />
      </Head>
      <ThemeProvider theme={theme}>
        <ApolloProvider client={apollo}>
          {drizzle && drizzleStore && (
            <DrizzleHooks.DrizzleProvider drizzle={drizzle}>
              <DrizzleHooks.Initializer
                error='There was an error.'
                loadingContractsAndAccounts={<LoadingScreen />}
                loadingWeb3={<LoadingScreen />}
              >
                <AppContext.Provider value={appContext}>
                  <Component key={router.route} {...pageProps} />
                </AppContext.Provider>
              </DrizzleHooks.Initializer>
            </DrizzleHooks.DrizzleProvider>
          )}
        </ApolloProvider>
      </ThemeProvider>
    </>
  );
}

export default withApollo(App);
