import {
  Badge,
  Button,
  Chip,
  Container,
  Fade,
  Paper,
  Typography,
} from '@material-ui/core';

export interface CrateCardProps {
  image: string;
  id: number;
  collection: {
    name: string;
    image: string;
  };
  numberOfSales: number;
}

export default function CrateCard(props: CrateCardProps) {
  return (
    <Paper className='max-w-lg h-auto flex p-1'>
      <div className='w-1/3'>
        <img className='w-full rounded-sm' src={props.image} />
      </div>
      <div className='flex-grow pl-2'>
        <div className='flex flex-row'>
          <img
            className='rounded-full w-10 h-10'
            src={props.collection.image}
          />
          <div className='pl-1'>
            <Typography className='text-xs'>{props.collection.name}</Typography>
            <Typography className='text-base font-bold'>#{props.id}</Typography>
          </div>
        </div>
        <div className='pt-1'>
          <Typography className='text-xs'>Sales / Owners</Typography>
          <Typography className='text-base font-bold'>2 / 2</Typography>
        </div>
        <div>
          <Typography className='text-xs'>Last / Max</Typography>
          <Typography className='text-base font-bold'>Ξ 2 / 2</Typography>
        </div>
        <div className='flex flex-row'>
          <div className='flex-1'>
            <Typography className='text-xs'>Ranking</Typography>
            <Typography className='text-base font-bold'>422,427,123</Typography>
          </div>
          <div className='flex-1'>
            <Typography className='text-xs'>Hit Rate</Typography>
            <Typography className='text-base font-bold'>{'> '}0.34%</Typography>
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
