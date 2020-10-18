import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Paper,
  Typography,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import AppLayoutContainer from 'src/containers/AppLayout';
import { useDrizzle, useDrizzleState, ContractForm } from 'src/utils/drizzle';
import range from 'src/utils/range';
import Web3 from 'web3';
import { fetchTokenData } from 'src/services/opensea';
import { isNil } from 'lodash';
import tailwindConfig from 'tailwind.config';

function NFTFactory() {
  const drizzleState = useDrizzleState((state) => state);
  const account = drizzleState.accounts[0];
  const { drizzle, useCacheCall } = useDrizzle();
  const { balanceOf } = useCacheCall(['Cryptokitties'], (call) => ({
    balanceOf: call('Cryptokitties', 'balanceOf', account),
  }));

  return (
    <AppLayoutContainer>
      <ContractForm
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract={'Cryptokitties'}
        method='mint'
      />
      <ContractForm
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract={'Cryptokitties'}
        method='safeTransferFrom'
      />
      <div className='flex flex-row flex-wrap w-screen bg-green-400 h-screen'>
        {[...range(0, Number(balanceOf || 0))].map((tokenIndex) => (
          <Token key={tokenIndex} index={tokenIndex} transferToCrate={0} />
        ))}
      </div>
    </AppLayoutContainer>
  );
}

export function Token({ index, transferToCrate }) {
  const drizzleState = useDrizzleState((state) => state);
  const account = drizzleState.accounts[0];
  const { drizzle, useCacheCall, useCacheSend } = useDrizzle();
  const crateAddr = drizzle.contracts.NiftyCrate.address;
  const safeTransfer = useCacheSend('Cryptokitties', 'safeTransferFrom');
  const [targetCrate, setTargetCrate] = useState(0);
  const [tokenData, setTokenData] = useState<any>({});
  const { tokenOfOwnerByIndex } = useCacheCall(['Cryptokitties'], (call) => ({
    tokenOfOwnerByIndex: call(
      'Cryptokitties',
      'tokenOfOwnerByIndex',
      account,
      index
    ),
  }));

  useEffect(() => {
    (async () => {
      if (isNil(tokenOfOwnerByIndex)) {
        return;
      }
      const result = await fetchTokenData(
        '0x06012c8cf97bead5deae237070f9587f8e7a266d',
        [tokenOfOwnerByIndex]
      );
      setTokenData(result[0]);
    })();
  }, [tokenOfOwnerByIndex]);

  const {
    image_thumbnail_url,
    image_preview_url,
    image_original_url,
  } = tokenData;
  return (
    <Card
      className='w-2/5 flex-grow'
      elevation={3}
      variant='outlined'
      style={{
        backgroundColor: tokenData.background_color
          ? `#${tokenData.background_color}`
          : 'none',
      }}
    >
      <CardHeader title={tokenOfOwnerByIndex} />
      <CardContent>
        {image_original_url && (
          <img className='w-full' src={image_original_url} />
        )}
      </CardContent>
      {/* <input
        value={targetCrate}
        onChange={(e) => setTargetCrate(Number(e.target.value))}
        type='number'
        placeholder='To Crate Id'
      /> */}
      <CardActions>
        <Button
          fullWidth
          color='primary'
          variant='contained'
          onClick={() => {
            debugger;
            safeTransfer.send(
              account,
              crateAddr,
              tokenOfOwnerByIndex,
              Web3.utils.padLeft(Web3.utils.toHex(transferToCrate), 40)
            );
          }}
        >
          Transfer
        </Button>
      </CardActions>
    </Card>
  );
}

export default NFTFactory;
