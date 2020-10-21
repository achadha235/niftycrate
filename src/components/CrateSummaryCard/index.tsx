import { Button, Typography, Avatar } from '@material-ui/core';
import Link from 'next/link';
import { useDrizzle, ContractForm, useDrizzleState } from 'src/utils/drizzle';
import Web3 from 'web3';
import Paper from '@material-ui/core/Paper';
import shortAddress from 'src/utils/shortAddress';
import { motion } from 'framer-motion';
import getCrateDetails from 'src/pages/hooks/getCrateDetails';
import { useEffect, useState } from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

import { mockTokenAddressMapping, mockTokenMapping } from 'src/constants';
import { fetchTokenData } from 'src/services/opensea';
import { isNil, shuffle } from 'lodash';

import Badge from '@material-ui/core/Badge';

function CrateSummaryCard({ crateId, className }) {
  const { drizzle, useCacheCall, useCacheSend } = useDrizzle();

  const drizzleState = useDrizzleState((state) => state);
  const account = drizzleState.accounts[0];

  const NC = 'NiftyCrate';
  const [childTokenData, setChildTokenData] = useState([]);

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
    children,
  } = getCrateDetails(crateId);

  if (children && children.length > 0) {
    debugger;
    console.log(children);
  }

  const openCrate = useCacheSend(NC, 'open');
  const totalOpenCost =
    openCost && openFee
      ? Web3.utils.toBN(openCost).add(Web3.utils.toBN(openFee)).toString()
      : '';

  useEffect(() => {
    const cleanup = () => {};
    if (isNil(children) || children.indexOf(undefined) > -1) {
      return cleanup;
    }
    (async () => {
      const tokenResults = await fetchTokenData(
        mockTokenMapping.Cryptokitties,
        children.map((child) => child && child[1])
      );
      setChildTokenData(tokenResults);
    })();
    return cleanup;
  }, [children]);

  // const tokenImages = childTokenData.slice(0, 4);
  const [tokenImages, setTokenImages] = useState([]);
  useEffect(() => {
    childTokenData &&
      childTokenData.length > 0 &&
      setTokenImages(childTokenData.slice(0, 4));
    const int = setInterval(() => {
      setTokenImages(shuffle(childTokenData).slice(0, 4));
    }, 10000);
    return () => {
      clearInterval(int);
    };
  }, [childTokenData]);

  return (
    <Badge badgeContent={numberOfChildren} color='primary'>
      <Paper elevation={3} className={className}>
        <Link href={`/crate/${crateId}`}>
          <div className={`crateSummaryCard shadow-sm overflow-hidden`}>
            <motion.div
              variants={{
                show: { opacity: 1 },
                hidden: {
                  opacity: 0,
                  transition: { duration: 0.4, staggerChildren: 0.1 },
                },
              }}
              initial={'hidden'}
              animate={'show'}
              className='crateThumbnail flex flex-wrap justify-center items-center mt-2 mx-auto'
              style={{ borderRadius: 5, overflow: 'hidden', width: 200 }}
            >
              {(isNil(tokenImages) || tokenImages.length === 0) &&
                numberOfChildren !== 0 && (
                  <Skeleton
                    animation='wave'
                    variant='rect'
                    width={230}
                    height={200}
                  />
                )}

              {numberOfChildren === 0 && (
                <div
                  className='flex flex-col justify-center items-center'
                  style={{ height: 200, width: 230 }}
                >
                  <img
                    src='/images/emptyCrate.svg'
                    style={{ height: 100, width: 100 }}
                  />
                  <Typography style={{ color: '#a7a7a7' }}>EMPTY</Typography>
                </div>
              )}

              {numberOfChildren !== 0 &&
                tokenImages &&
                tokenImages.length > 0 &&
                tokenImages.map((tokenData) => (
                  <motion.img
                    key={tokenData.image_preview_url}
                    variants={{
                      show: {
                        opacity: 1,
                        transition: { duration: 0.4, staggerChildren: 0.1 },
                      },
                      hidden: {
                        opacity: 0,
                        transition: { duration: 0.4, staggerChildren: 0.1 },
                      },
                    }}
                    style={{
                      border: 'solid 1px #424242',
                      width: 100,
                      background: tokenData.background_color
                        ? `#${tokenData.background_color}`
                        : 'white',
                    }}
                    src={tokenData.image_preview_url}
                  />
                ))}
            </motion.div>

            <div className='mx-3 px-1 flex flex-row mt-1'>
              <div className='flex-auto flex flex-col'>
                <div>
                  <Typography
                    className='text-xs'
                    style={{ color: 'rgb(124 124 124 / 70%)' }}
                    variant='body2'
                  >
                    Crate #{crateId}
                  </Typography>
                </div>
                <div className='flex flex-row'>
                  <div className='flex-1 pr-1'>
                    <Typography className='' style={{ fontSize: 8 }}>
                      Ultra
                    </Typography>
                    <Typography className='text-md'>1</Typography>
                  </div>

                  <div className='flex-1'>
                    <Typography className='' style={{ fontSize: 8 }}>
                      Rare
                    </Typography>
                    <Typography className='text-md'>1</Typography>
                  </div>
                  <div className='vLine' />
                  <div className='flex-1'>
                    <Typography
                      className='pl-1 '
                      style={{
                        fontSize: 8,
                      }}
                    >
                      Dust
                    </Typography>
                    <Typography className='text-md pl-1'>8</Typography>
                  </div>
                  <div className='vLine' />
                </div>
                <div className='flex-auto flex mt-auto justify-start items-center'>
                  <div>
                    {!isNil(owner) && (
                      <Avatar
                        style={{ height: 26, width: 26, background: 'white' }}
                        alt='Remy Sharp'
                        src={`https://robohash.org/${owner}.png?set=set3`}
                      />
                    )}

                    {isNil(owner) && (
                      <Skeleton variant='circle' width={26} height={26} />
                    )}
                  </div>
                  <div className='pl-1'>
                    <Typography
                      style={{
                        fontFamily: 'courier',
                        fontSize: 9,
                      }}
                    >
                      {shortAddress(owner)}{' '}
                    </Typography>
                    <Typography
                      style={{
                        fontFamily: 'courier',
                        fontSize: 9,
                      }}
                    >
                      {account &&
                      owner &&
                      account.toLowerCase() === owner.toLowerCase()
                        ? '(You)'
                        : ''}
                    </Typography>
                  </div>
                </div>
              </div>
              <div className='flex-auto flex flex-col justify-end items-end pl-1'>
                <div className='flex-1 flex flex-col w-full'>
                  <label style={{ fontSize: 8, marginBottom: 3 }}>Open</label>
                  <Button
                    disabled={!canOpen}
                    color='primary'
                    size='small'
                    variant='outlined'
                    fullWidth={true}
                  >
                    Ξ {Web3.utils.fromWei(totalOpenCost, 'ether')}
                  </Button>
                </div>
                <div className='flex-1 flex flex-col w-full'>
                  <label style={{ fontSize: 8, marginBottom: 3, marginTop: 3 }}>
                    Buy
                  </label>
                  <Button
                    disabled={!canBuy}
                    color='secondary'
                    size='small'
                    variant='outlined'
                    fullWidth={true}
                  >
                    Ξ {Web3.utils.fromWei(cost || '0', 'ether')}
                  </Button>
                </div>
              </div>
            </div>

            {/* <div className='m-1 mx-3 bg-red-500 h-20'>
            <Skeleton variant='text' animation='wave' />
            <Skeleton variant='text' animation='wave' />
            <Skeleton variant='text' animation='wave' />

            <div>
              <Typography
                className='text-xs'
                color='textSecondary'
                variant='body2'
              >
                Crate {crateId + 1}
              </Typography>
            </div>

            <Badge badgeContent={4} color='primary'>
              <Typography>🏆</Typography>
            </Badge>

            <Badge badgeContent={4} color='primary'>
              <Typography>🏆</Typography>
            </Badge>

            <Badge badgeContent={4} color='primary'>
              <Typography>🏆</Typography>
            </Badge>

            <Typography>#{crateId}</Typography>
            <Typography>{numberOfChildren} tokens</Typography>
            <Typography variant='body1' style={{ fontFamily: 'Courier' }}>
              {shortAddress(owner)}{' '}
              {account && owner && account.toLowerCase() === owner.toLowerCase()
                ? '(You)'
                : ''}
            </Typography>
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
          </div> */}
          </div>
        </Link>
      </Paper>
      <style jsx>{`
        .crateSummaryCard {
          cursor: pointer;
          width: 230px;
          height: 310px;
          border-radius: 6px;
        }
        .crateThumbnail {
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          height: 200px;
          width: 230px;
        }

        .vLine {
          width: 1px;
          height: 100%;
          color: white;
        }
      `}</style>

      <style jsx global>{`
        .MuiBadge-anchorOriginTopRightRectangle {
          top: 8px;
          right: 14px;
        }
      `}</style>
    </Badge>
  );
}

export default CrateSummaryCard;
