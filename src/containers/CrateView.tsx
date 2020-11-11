import {
  Button,
  Paper,
  Typography,
  Modal,
  Fade,
  Checkbox,
  TextField,
} from '@material-ui/core';
import { useEffect, useState, useRef } from 'react';
import { isNil } from 'lodash';
import confetti from 'canvas-confetti';

import Crate from 'src/components/Crate';
import getCrateDetails from 'src/hooks/getCrateDetails';
import { fetchTokenData } from 'src/services/opensea';
import { useDrizzle, useDrizzleState } from 'src/utils/drizzle';
import { NC } from 'src/constants';
import Web3 from 'web3';
import LoadingScreen from 'src/components/LoadingScreen';
import CrateCard from 'src/components/CrateCard';

function CrateView({ crateId }) {
  // return <div> Crate </div>;
  const { useCacheSend, useCacheCall } = useDrizzle();
  const crateDetails = getCrateDetails(crateId);
  const [tokenData, setTokenData] = useState(null);
  const { openFee, openCost } = crateDetails || {};
  const [winModalOpen, setWinModalOpen] = useState(false);
  const [winningToken, setWinningToken] = useState(null);
  // const [myConfetti, setMyConfetti] = useState(null);
  const totalOpenCost = Web3.utils
    .toBN(openCost || '0')
    .add(Web3.utils.toBN(openFee || '0'));

  const { send, TXObjects } = useCacheSend(NC, 'open');
  const onOpenCrate = async () => {
    const res = await send(crateId, 0, { value: totalOpenCost });
    console.log(res);
    console.log(TXObjects);
  };

  useEffect(() => {
    if (TXObjects && TXObjects.length > 0) {
      const tx = TXObjects[TXObjects.length - 1];
      if (tx && !isNil(tx) && !isNil(tx.receipt) && !isNil(tx.receipt.events)) {
        const tokenAddr = tx.receipt.events.CrateOpened.returnValues[3];
        const tokenId = tx.receipt.events.CrateOpened.returnValues[4];

        const tdata = tokenData.find(({ token_id }) => token_id === tokenId);
        setWinningToken({
          tokenData: tdata,
          tokenAddr,
          tokenId,
        });
        setWinModalOpen(true);
        // alert(`${tokenAddr} - ${tokenId}`);
        fireConfetti();

        // setTimeout(() => {
        // setWinModalOpen(false);
        // setWinningToken(null);
        // }, 5000);
      }
    }
  }, [TXObjects[TXObjects.length - 1]]);

  const canvasRef = useRef(null);

  const fireConfetti = () => {
    var duration = 5 * 1000;
    var end = Date.now() + duration;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    });

    function frame() {
      // launch a few confetti from the left edge
      myConfetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      // and launch a few from the right edge
      myConfetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      // keep going until we are out of time
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      } else {
        setWinModalOpen(false);
        setWinningToken(null);
      }
    }

    frame();
  };

  const fetchTokens = async (tokens) => {
    if (isNil(tokens) || tokens.length === 0) {
      return;
    }
    const result = await fetchTokenData(crateDetails.tokens);
    setTokenData(result);
  };

  useEffect(() => {
    crateDetails && fetchTokens(crateDetails.tokens);
  }, [crateDetails]);

  const openCrate = () => {};

  if (!crateDetails) {
    return <LoadingScreen />;
  }

  return (
    <div className='flex pt-3 justify-center'>
      <Modal
        hideBackdrop={true}
        open={winModalOpen}
        className='flex justify-center items-center'
        onClose={() => {
          setWinModalOpen(false);
          setWinningToken(null);
        }}
      >
        <Paper className='m-4 p-5'>
          <Typography variant='h2' className='text-center'>
            You Won!
          </Typography>
          <img
            style={{ height: 400 }}
            src={
              winningToken && winningToken.tokenData
                ? winningToken.tokenData.image_url
                : 'https://placehold.it/50x50'
            }
          />
        </Paper>
      </Modal>
      <canvas
        ref={canvasRef}
        style={{
          display: winModalOpen ? 'initial' : 'none',
          zIndex: 0,
          width: '100vw',
          height: '100vh',
          position: 'fixed',
        }}
      />
      <div className=' flex flex-col w-full'>
        <div className='flex flex-row justify-between mb-2'>
          <Typography variant={'h4'}>Crate #{crateId}</Typography>
          <div className='flex flex-row justify-between' style={{ width: 500 }}>
            <Typography variant='h6'>Contents</Typography>
            <Button variant='outlined'>Add / Remove Items</Button>
          </div>
        </div>

        <div className='flex-1 flex flex-grow px-2'>
          <div className='flex-1'>
            <Crate tokens={tokenData} />
            <div className='px-3 flex-col'>
              <Button
                className='flex-1'
                disabled={isNil(crateDetails) || !crateDetails.canOpen}
                size='large'
                variant='contained'
                color='secondary'
                onClick={onOpenCrate}
              >
                Open Crate <br /> 💎 + Ξ{' '}
                {Web3.utils.fromWei(totalOpenCost, 'ether')}
              </Button>

              <Button
                className='flex-1 ml-2'
                size='large'
                variant='contained'
                color='primary'
              >
                Buy Crate <br /> Ξ{' '}
                {Web3.utils.fromWei(crateDetails.openCost || '0', 'ether')}
              </Button>

              <Button
                className='flex-1 ml-2 py-5'
                size='large'
                variant='outlined'
              >
                Settings
              </Button>
            </div>
          </div>
          <div
            className='p-2 flex-1 overflow-scroll'
            style={{
              maxHeight: '80vh',
              border: 'solid 1px #4c4c4c',
            }}
          >
            {tokenData &&
              tokenData.map(
                ({
                  image_url,
                  image_preview_url,
                  image_thumbnail_url,
                  background_color,
                  collection,
                  id,
                  last_sale,
                }) => {
                  return (
                    <CrateCard
                      className='mb-2'
                      loading={false}
                      token={{
                        backgroundColor: `${background_color}`,
                        image: image_preview_url,
                        id: id,
                        collection: {
                          name: collection.name,
                          image: collection.featured_image_url,
                        },
                        numberOfSales: 3,
                        lastPrice: '0',
                        maxPrice: '0',
                        ranking: 23432423,
                        hitRate: 123,
                      }}
                    />

                    // <Paper className='p-2 mb-2 '>
                    //   <div className='flex flex-row'>
                    //     <img
                    //       className='flex-1/3'
                    //       src={image_preview_url}
                    //       style={{
                    //         height: 80,
                    //         width: 80,
                    //         borderRadius: 5,
                    //         background: background_color
                    //           ? `#${background_color}`
                    //           : 'white',
                    //       }}
                    //     />
                    //     <div className='flex-2/3 pl-3'>
                    //       <Typography className='text-xs'>
                    //         {collection.name}
                    //       </Typography>
                    //       <Typography variant='body1'>#{id}</Typography>
                    //     </div>
                    //   </div>
                    // </Paper>
                  );
                }
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrateView;
