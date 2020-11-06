import Web3 from 'web3';
import numeral from 'numeral';
import { isNil } from 'lodash';
import Skeleton from '@material-ui/lab/Skeleton';
import { Button, Chip, Paper, Typography } from '@material-ui/core';

export interface CrateCardProps {
  loading?: boolean;
  token?: {
    image: string;
    id: number;
    backgroundColor: string;
    collection: {
      name: string;
      image: string;
    };
    numberOfSales: number;
    lastPrice: string;
    maxPrice: string;
    ranking: number;
    hitRate: number;
  };
}

/**
 * CrateCard - Shows a basic card for a crate
 * @param props
 */

export default function CrateCard(props: CrateCardProps) {
  if (props.loading) {
    return <CrateCardSkeleton />;
  }

  return (
    <Paper className='max-w-lg h-48 flex p-1'>
      <div className='w-1/3'>
        <div
          className='h-full rounded-sm flex items-start justify-center'
          style={{
            backgroundColor: '#' + (props.token?.backgroundColor ?? 'white'),
          }}
        >
          <img className='w-full' src={props.token?.image} />
        </div>
      </div>
      <div className='flex-grow pl-2'>
        <div className='flex flex-row'>
          <img
            className='rounded-full w-10 h-10'
            src={props.token?.collection.image}
          />
          <div className='pl-1'>
            <Typography className='text-xs'>
              {props.token?.collection.name}
            </Typography>
            <Typography className='text-base font-bold'>
              #{props.token?.id}
            </Typography>
          </div>
        </div>
        <div className='pt-1'>
          <Typography className='text-xs'>Sales</Typography>
          <Typography className='text-base font-bold'>
            {props.token?.numberOfSales}
          </Typography>
        </div>
        <div>
          <Typography className='text-xs'>Last / Max</Typography>
          <Typography className='text-base font-bold'>
            Ξ {formatPrice(props.token?.lastPrice)} /{' '}
            {formatPrice(props.token?.maxPrice)}
          </Typography>
        </div>
        <div className='flex flex-row'>
          <div className='flex-1'>
            <Typography className='text-xs'>Ranking</Typography>
            <Typography className='text-base font-bold'>
              {numeral(props.token?.ranking).format('0,0')}
            </Typography>
          </div>
          <div className='flex-1'>
            <Typography className='text-xs'>Hit Rate</Typography>
            <Typography className='text-base font-bold'>
              {numeral(props.token?.hitRate).format('%')}
            </Typography>
          </div>
        </div>
      </div>
      <div className='flex-1 mr-1'>
        <Button color='primary' fullWidth size='small' variant='outlined'>
          Remove
        </Button>
        <Button
          color='secondary'
          className='mt-2'
          fullWidth
          size='small'
          variant='outlined'
        >
          Ranking
        </Button>
        <Chip label='Rare' className='mt-2 w-full' />
      </div>
    </Paper>
  );
}

function CrateCardSkeleton() {
  const TextBlock = () => (
    <>
      <Skeleton variant='rect' height={10} width={'80%'} />
      <Skeleton variant='rect' height={17} width={'80%'} className='mt-1' />
    </>
  );
  return (
    <Paper className='max-w-lg h-48 flex p-1'>
      <div className='w-1/3'>
        <Skeleton variant='rect' height='100%' />
      </div>
      <div className='flex-grow pl-2'>
        <div className='flex flex-row'>
          <Skeleton
            variant='circle'
            width={'2.6rem'}
            height={'2.6rem'}
            className='rounded-full w-10 h-10'
          />
          <div className='pl-1 w-4/5'>
            <Skeleton variant='rect' height={10} width={'74%'} />
            <Skeleton
              variant='rect'
              height={17}
              width={'74%'}
              className='mt-1'
            />
          </div>
        </div>
        <div className='pt-1'>
          <TextBlock />
        </div>
        <div>
          <TextBlock />
        </div>
        <div className='pt-1'>
          <TextBlock />
        </div>
        <div className='pt-1'>
          <Skeleton variant='rect' height={17} width={'80%'} className='mt-1' />
        </div>
      </div>
      <div className='flex-1 mr-1'>
        <Skeleton variant='rect' height={25} width={80} className='ml-auto' />
        <Skeleton
          variant='rect'
          height={25}
          width={80}
          className='mt-2 ml-auto'
        />
        <Skeleton
          variant='rect'
          height={30}
          width={80}
          style={{ borderRadius: 50 }}
          className='mt-2 ml-auto'
        />
      </div>
    </Paper>
  );
}

const formatPrice = (p) => {
  if (isNil(p)) {
    return '-';
  }
  const fmtPrice = Web3.utils.fromWei(p, 'ether');
  return fmtPrice.length < 7 ? fmtPrice : fmtPrice.slice(0, 7);
};
