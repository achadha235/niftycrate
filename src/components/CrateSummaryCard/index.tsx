import { Button, Typography } from '@material-ui/core';
import Link from 'next/link';
import { useDrizzle, ContractForm, useDrizzleState } from 'src/utils/drizzle';
import Web3 from 'web3';
import Paper from '@material-ui/core/Paper';
import shortAddress from 'src/utils/shortAddress';

function CrateSummaryCard({ crateId, className }) {
  const { drizzle, useCacheCall, useCacheSend } = useDrizzle();

  const drizzleState = useDrizzleState((state) => state);
  const account = drizzleState.accounts[0];

  const NC = 'NiftyCrate';
  const {
    owner,
    numberOfChildren,
    canOpen,
    canBuy,
    cost,
    openCost,
    openFee,
    crateOpener,
    customCrateOpener,
  } = useCacheCall([NC], (call) => ({
    owner: call(NC, 'ownerOf', crateId),
    numberOfChildren: Number(call(NC, 'numberOfChildren', crateId)),
    canOpen: call(NC, 'canOpen', crateId),
    canBuy: call(NC, 'canBuy', crateId),
    cost: call(NC, 'cost', crateId),
    openCost: call(NC, 'openCost', crateId),
    openFee: call(NC, 'openFee'),
    customCrateOpener: call(NC, 'customCrateOpener', crateId),
    crateOpener: call(NC, 'crateOpener'),
  }));

  const openCrate = useCacheSend(NC, 'open');
  const totalOpenCost =
    openCost && openFee
      ? Web3.utils.toBN(openCost).add(Web3.utils.toBN(openFee)).toString()
      : '';

  return (
    <Paper elevation={3} className={className}>
      <Link href={`/crate/${crateId}`}>
        <div className={`crateSummaryCard shadow-sm overflow-hidden`}>
          <img src='http://placehold.it/300x200' className='crateThumbnail' />
          <div className='m-1'>
            <Typography>#{crateId}</Typography>
            <Typography>{numberOfChildren} tokens</Typography>
            <Typography variant='body1' style={{ fontFamily: 'Courier' }}>
              {shortAddress(owner)}{' '}
              {account && owner && account.toLowerCase() === owner.toLowerCase()
                ? '(You)'
                : ''}
            </Typography>

            {/*             
            Owner {} Size {numberOfChildren}
            BuyCost: {cost}
            CanBuy: {JSON.stringify(canBuy)}
            OpenCost:{openCost}
            CanOpen: {JSON.stringify(canOpen)}
            Opener: {crateOpener}
            Custom Opener: {customCrateOpener} */}
            <Button
              variant='contained'
              className='mr-1'
              disabled={!canBuy}
              onClick={() => {}}
            >
              Buy ({cost})
            </Button>
            <Button
              variant='contained'
              disabled={!canOpen}
              onClick={() =>
                openCrate.send(
                  crateId,
                  '0x0000000000000000000000000000000000000000',
                  { value: totalOpenCost }
                )
              }
            >
              Open ({totalOpenCost})
            </Button>
          </div>
        </div>
      </Link>

      <style jsx>{`
        .crateSummaryCard {
          width: 300px;
          height: 350px;
        }
        .crateThumbnail {
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
        }
      `}</style>
    </Paper>
  );
}

export default CrateSummaryCard;
