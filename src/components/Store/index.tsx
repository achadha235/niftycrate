import { Button, Card, Typography } from '@material-ui/core';
import StorefrontIcon from '@material-ui/icons/StorefrontTwoTone';
import Crate from '../Crate';
import { Diamond } from '../Diamond';
import React from 'react';

export interface StoreProps {
  cratePrice: string;
  onBuyCrate: React.MouseEventHandler;
  onBuyGems: React.MouseEventHandler;
}

export function Store(props: StoreProps) {
  return (
    <>
      <Typography variant='h4'>
        <StorefrontIcon fontSize='large' /> Store
      </Typography>
      <div className='h-full flex flex-row mt-2'>
        <div className='flex-1 h-96 mr-5'>
          <Card
            onClick={props.onBuyCrate}
            variant='outlined'
            className='h-full w-full rounded-lg flex flex-col justify-between'
            style={{ background: '#202023' }}
          >
            <div className='flex justify-center items-center'>
              <Crate
                size={250}
                tokens={[
                  {
                    image_original_url: '/images/logo.svg',
                  },
                  {
                    image_original_url: '/images/logo.svg',
                  },
                  {
                    image_original_url: '/images/logo.svg',
                  },
                  {
                    image_original_url: '/images/logo.svg',
                  },
                  {
                    image_original_url: '/images/logo.svg',
                  },
                  {
                    image_original_url: '/images/logo.svg',
                  },
                ]}
              />
            </div>
            <div className='p-3 mt-auto'>
              <Typography variant='h5'>Empty NiftyCrate</Typography>
            </div>
            <Button
              size='large'
              fullWidth
              variant='contained'
              color='primary'
              className='mt-4'
              style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
            >
              Buy Ξ{props.cratePrice}
            </Button>
          </Card>
        </div>

        <div className='flex-1 h-96'>
          <Card
            onClick={props.onBuyGems}
            variant='outlined'
            className='w-full rounded-lg'
            style={{ background: '#202023' }}
          >
            <div className='relative h-64'>
              <Diamond />
            </div>

            <div className='p-3'>
              <Typography variant='h5'>Pack of 10 Diamonds</Typography>
            </div>
            <Button
              size='large'
              fullWidth
              variant='contained'
              color='secondary'
              className='mt-4'
              style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
            >
              Buy
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}
