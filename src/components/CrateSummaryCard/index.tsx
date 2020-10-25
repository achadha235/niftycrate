import Link from 'next/link';
import Web3 from 'web3';
import { isNil } from 'lodash';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { Button, Typography, Avatar, Paper, Badge } from '@material-ui/core';

import shortAddress from 'src/utils/shortAddress';
import getCrateDetails from 'src/pages/hooks/getCrateDetails';
import { fetchTokenData } from 'src/services/opensea';

function EmptyCrateThumbnail() {
  return (
    <div
      className='flex flex-col justify-center items-center'
      style={styles.imageWrapper}
    >
      <img src='/images/emptyCrate.svg' style={styles.emptyCrate} />
      <Typography style={styles.emptyText}>EMPTY</Typography>
    </div>
  );
}

function selectNItems(arr, n, startIndex) {
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    arr[i] && res.push(arr[(startIndex + i) % arr.length]);
  }

  return [...res];
}

function CrateThumbnailImages({ tokens }) {
  const numPerScreen = 4;
  const switchPageIntervalMs = 4000;
  const [startIdx, setStartIdx] = useState(0);
  useEffect(() => {
    const pageTransitionInterval = setInterval(() => {
      let nextIdx = startIdx + numPerScreen;
      if (nextIdx >= tokens.length) {
        nextIdx = 0;
      }
      setStartIdx(nextIdx);
    }, switchPageIntervalMs);
    return () => {
      clearInterval(pageTransitionInterval);
    };
  }, [tokens, startIdx, tokens.length]);

  useEffect(() => {
    for (var i = 0; i < tokens.length; i++) {
      const newImg = new Image(100, 100);
      newImg.src = tokens[i].image_preview_url;
    }
  }, [tokens, startIdx, tokens.length]);
  return (
    <AnimatePresence exitBeforeEnter={true}>
      {selectNItems(tokens, numPerScreen, startIdx).map((tokenData, i) => (
        <motion.img
          initial='hide'
          animate='show'
          exit='hide'
          key={`${tokenData.image_preview_url}::${startIdx}`}
          src={tokenData.image_preview_url}
          variants={{
            show: {
              opacity: 1,
              transition: { duration: 0.4, delay: i * 0.05 },
            },
            hide: {
              opacity: 0,
              transition: { duration: 0.4, delay: i * 0.05 },
            },
          }}
          style={{
            border: 'solid 1px #424242',
            width: 100,
            background: tokenData.background_color
              ? `#${tokenData.background_color}`
              : 'white',
          }}
        />
      ))}
    </AnimatePresence>
  );
}

function CrateSummaryCardImages({ loading, tokens, numberOfChildren }) {
  const [tokenData, setTokenData] = useState([]);

  const filterRank = (ts) =>
    ts.map(({ tokenId, address }) => ({ tokenId, address }));

  const fetchTokenImageData = () => {
    if (isNil(tokens) || tokens.length === 0) {
      return;
    }
    const fetchData = async () => {
      const tokenData = await fetchTokenData(filterRank(tokens));
      setTokenData(tokenData);
    };
    fetchData();
  };

  const imageLoading = loading && tokenData.length <= 0;

  useEffect(fetchTokenImageData, [tokens]);

  return (
    <motion.div
      className='crateThumbnail flex flex-wrap justify-center items-center mt-2 mx-auto'
      style={styles.thumbnailWrapper}
      variants={itemVariants}
      initial={'hidden'}
      animate={'show'}
    >
      {imageLoading ? (
        <Skeleton variant='rect' width={230} height={200} />
      ) : (
        <>
          {numberOfChildren === 0 && <EmptyCrateThumbnail />}
          {numberOfChildren !== 0 && (
            <CrateThumbnailImages tokens={tokenData} />
          )}
        </>
      )}
    </motion.div>
  );
}

function CrateSummaryLoading() {
  return (
    <div className='mx-3 px-1 flex flex-row mt-1'>
      <div className='flex-auto flex flex-col'>
        <div>
          <Skeleton variant='rect' height={12} width={106} />
        </div>
        <div className='flex flex-row'>
          <Skeleton variant='rect' height={36} width={106} className='mt-1' />
        </div>
        <div className='flex-auto flex mt-auto justify-start items-center'>
          <Skeleton variant='circle' height={26} width={26} />
          <Skeleton variant='rect' height={13} width={76} className='ml-1' />
        </div>
      </div>
      <div className='flex-auto flex flex-col justify-end items-end pl-1'>
        <div className='flex-1 flex flex-col w-full'>
          <Skeleton variant='rect' width={87} height={41} />
        </div>
        <div className='flex-1 flex flex-col w-full mt-1 ml-2'>
          <Skeleton variant='rect' width={87} height={41} />
        </div>
      </div>
    </div>
  );
}

function CrateSummaryCardDetails({
  loading,
  owner,
  canOpen,
  canBuy,
  cost,
  openCost,
  openFee,
  dust,
  rare,
  ultra,
}) {
  const crateId = 1;
  const avatarUrl = `https://robohash.org/${owner}.png?set=set3`;
  const buyCost = Web3.utils.fromWei(cost || '0', 'ether');
  const totalOpenCost = Web3.utils.fromWei(
    Web3.utils.toBN(openCost || '0').add(Web3.utils.toBN(openFee || '0')),
    'ether'
  );

  if (loading) {
    return <CrateSummaryLoading />;
  }

  return (
    <motion.div
      className='mx-3 px-1 flex flex-row mt-1'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      <div className='flex-auto flex flex-col'>
        <div>
          <Typography className='text-xs' style={styles.crateId}>
            Crate #{crateId}
          </Typography>
        </div>

        <div className='flex flex-row'>
          <div className='flex-1 pr-1'>
            <Typography style={styles.label}>Ultra</Typography>
            <Typography className='text-md'>{ultra}</Typography>
          </div>
          <div className='flex-1'>
            <Typography style={styles.label}>Rare</Typography>
            <Typography className='text-md'>{rare}</Typography>
          </div>
          <div className='flex-1'>
            <Typography className='pl-1' style={styles.label}>
              Dust
            </Typography>
            <Typography className='text-md pl-1'>{dust}</Typography>
          </div>
        </div>

        <div className='flex-auto flex mt-auto justify-start items-center'>
          <Avatar style={styles.avatar} alt={owner} src={avatarUrl} />
          <Typography style={styles.ownerText} className='pl-1'>
            {shortAddress(owner)}
          </Typography>
        </div>
      </div>

      <div className='flex-auto flex flex-col justify-end items-end pl-1 pt-1'>
        <div className='flex-1 flex flex-col w-full'>
          <label style={styles.buttonLabel}>Open</label>
          <Button
            disabled={!canOpen}
            variant='outlined'
            color='secondary'
            fullWidth={true}
            size='small'
          >
            Ξ {totalOpenCost}
          </Button>
        </div>
        <div className='flex-1 flex flex-col w-full mt-2'>
          <label style={styles.buttonLabel}>Buy</label>
          <Button
            disabled={!canBuy}
            variant='outlined'
            color='primary'
            fullWidth={true}
            size='small'
          >
            Ξ {buyCost}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function CrateSummaryCard({ crateId, className }) {
  const crateDetails = getCrateDetails(crateId);
  const loading = isNil(crateDetails);
  const numberOfChildren = !loading ? crateDetails.numberOfChildren : 0;
  return (
    <Badge
      badgeContent={numberOfChildren}
      invisible={loading || numberOfChildren === 0}
      max={maxChildren}
      color='primary'
    >
      <Link href={`/crate/${crateId}`}>
        <Paper elevation={3} className={className}>
          <div className={`CrateSummaryCard shadow-sm overflow-hidden`}>
            <CrateSummaryCardImages loading={loading} {...crateDetails} />
            <CrateSummaryCardDetails loading={loading} {...crateDetails} />
          </div>
        </Paper>
      </Link>
      <style jsx>{`
        .CrateSummaryCard {
          cursor: pointer;
          width: 230px;
          height: 320px;
          border-radius: 6px;
        }
      `}</style>
    </Badge>
  );
}

function getTotalOpenCost(openCost, openFee) {
  if (openCost && openFee) {
    return Web3.utils.toBN(openCost).add(Web3.utils.toBN(openFee)).toString();
  }
  return null;
}

const maxChildren = 99;

const styles = {
  thumbnailWrapper: {
    borderRadius: 5,
    overflow: 'hidden',
    width: 200,
    height: 200,
  },
  avatar: { height: 26, width: 26, background: 'white' },
  ownerText: { fontFamily: 'courier', fontSize: 9 },
  buttonLabel: { fontSize: 8, marginBottom: 3 },
  crateId: { color: 'rgb(124 124 124 / 70%)' },
  imageWrapper: { height: 200, width: 230 },
  emptyText: { color: '#a7a7a7' },
  emptyCrate: { width: 60 },
  label: { fontSize: 8 },
};

const variants = {
  show: {
    opacity: 1,
    transition: { duration: 0.4, staggerChildren: 0.1 },
  },
  hidden: {
    opacity: 0,
    transition: { duration: 0.4, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  show: { opacity: 1 },
  hidden: {
    opacity: 0,
    transition: { duration: 0.4, staggerChildren: 0.1 },
  },
};

export default CrateSummaryCard;
