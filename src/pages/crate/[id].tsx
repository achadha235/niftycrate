// import {
//   Avatar,
//   Button,
//   Card,
//   CardHeader,
//   Checkbox,
//   Fade,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Modal,
//   Paper,
//   TextField,
//   Typography,
// } from '@material-ui/core';
import { useRouter } from 'next/router';
// import { useState, useEffect } from 'react';
// import { isNil } from 'lodash';
// import Crate from 'src/components/Crate';

// import CrateSummaryCard from 'src/components/CrateSummaryCard';
import AppLayoutContainer from 'src/containers/AppLayout';
// import { useDrizzle, useDrizzleState, ContractForm } from 'src/utils/drizzle';
// import shortAddress from 'src/utils/shortAddress';
// import getCrateContents from '../../hooks/getCrateContents';
// import getCrateDetails from '../../hooks/getCrateDetails';
// import TokenTransferBrowser from 'src/__old__/Contract/TokenTransferBrowser';
// import { mockTokenAddressMapping, mockTokenMapping } from 'src/constants';
// import { fetchTokenData } from 'src/services/opensea';
// import { Token } from '../../__old__/nft';

import CrateView from 'src/containers/CrateView';

function CratePage() {
  const { query } = useRouter();
  return (
    <AppLayoutContainer>
      <div className='w-full max-w-5xl mx-auto'>
        <CrateView crateId={query.id} />
      </div>
    </AppLayoutContainer>
  );
}

export default CratePage;

// function CratePage() {
//   const [settingsOpen, setSettingsOpen] = useState(false);
//   const [addTokensOpen, setAddTokensOpen] = useState(false);
//   const { query } = useRouter();
//   const drizzleState = useDrizzleState((state) => state);
//   const [childTokenData, setChildTokenData] = useState([]);
//   // const { drizzle, useCacheEvents } = useDrizzle();
//   const account = drizzleState.accounts[0];
//   // const [settingsOpen, setSettingsOpen] = useState(false);

//   const crateDetails = getCrateDetails(query.id);
//   // if (isNil(crateDetails)) {
//   //   return null
//   // }

//   const {
//     owner,
//     numberOfChildren,
//     canOpen,
//     canBuy,
//     cost,
//     openCost,
//     openFee,
//     crateOpener,
//     customCrateOpener,
//     tokens,
//   } = crateDetails || {};

//   const isOwner =
//     account && owner && account.toLowerCase() === owner.toLowerCase();

//   useEffect(() => {
//     const cleanup = () => {};
//     if (isNil(tokens) || tokens.indexOf(undefined) > -1) {
//       return cleanup;
//     }
//     (async () => {
//       const tokenResults = await fetchTokenData(
//         mockTokenMapping.Cryptokitties,
//         tokens.map((child) => child && child[1])
//       );
//       setChildTokenData(tokenResults);
//     })();
//     return cleanup;
//   }, [tokens]);

//   // const [children, setChildren] = useState([]);
//   // const children = getCrateContents(query.id, numberOfChildren);
//   // setChildren();
//   // useEffect(() => {

//   // }, [numberOfChildren]);

//   return (
//     <AppLayoutContainer>
//       <div className='flex pt-3 justify-center'>
//         <div className='max-w-3xl flex flex-col w-full'>
//           <div>
//             <Typography variant={'h4'}>Crate #{query.id}</Typography>
//           </div>

//           <div className='flex-1 flex flex-grow px-2'>
//             <div className='flex-1'>
//               <Crate />
//             </div>

//             <div className='px-2 flex-1' style={{ minWidth: 400 }}>
//               <Paper className='p-4'>
//                 <Button
//                   color='primary'
//                   disabled={!canBuy}
//                   fullWidth
//                   size='large'
//                   variant='contained'
//                 >
//                   Buy Ξ{cost}
//                 </Button>
//                 <Button
//                   color='secondary'
//                   disabled={!canOpen}
//                   fullWidth
//                   size='large'
//                   className='mt-4'
//                   variant='contained'
//                 >
//                   Open Ξ{openCost}
//                 </Button>

//                 {isOwner && (
//                   <Button
//                     onClick={() => setSettingsOpen(true)}
//                     fullWidth
//                     size='large'
//                     className='mt-4'
//                     variant='outlined'
//                   >
//                     Configure
//                   </Button>
//                 )}
//               </Paper>

//               <Paper className='p-4 mt-2'>
//                 <Typography variant='h6'>Owner</Typography>
//                 <div className='flex flex-row items-center'>
//                   <Avatar alt='Abhi Chadha' />
//                   <Typography
//                     className='ml-2'
//                     style={{ fontFamily: 'Courier' }}
//                     variant='body1'
//                   >
//                     {shortAddress(owner)}
//                   </Typography>
//                 </div>
//               </Paper>
//               <Paper className='p-4 mt-2'>
//                 <Typography variant='h6'>
//                   Contents
//                   {tokens && tokens.length > 0 && (
//                     <Button
//                       onClick={() => setAddTokensOpen(true)}
//                       color='primary'
//                     >
//                       Add / Remove
//                     </Button>
//                   )}
//                 </Typography>
//                 {tokens && tokens.length === 0 && (
//                   <div className='w-full flex justify-center items-center flex-col h-32'>
//                     <Typography>This Crate is Empty</Typography>
//                     <Button
//                       onClick={() => setAddTokensOpen(true)}
//                       color='primary'
//                     >
//                       Add Tokens
//                     </Button>
//                   </div>
//                 )}

//                 {tokens && tokens.length > 0 && (
//                   <List className='full'>
//                     {tokens.map((child, i) => {
//                       if (isNil(child)) {
//                         return null;
//                       }
//                       return (
//                         <ListItem>
//                           <ListItemAvatar>
//                             <Avatar
//                               src={
//                                 childTokenData
//                                   ? childTokenData[i]?.image_thumbnail_url
//                                   : ''
//                               }
//                             />
//                           </ListItemAvatar>
//                           <ListItemText
//                             primary={mockTokenAddressMapping[child[0]]}
//                             secondary={child[1]}
//                           />
//                         </ListItem>
//                       );
//                     })}
//                   </List>
//                 )}
//               </Paper>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Modal
//         onClose={() => setSettingsOpen(false)}
//         open={settingsOpen}
//         className='flex justify-center items-center'
//       >
//         <Fade in={settingsOpen}>
//           <Paper className='w-2/5 p-5'>
//             <Typography className='mb-6' variant='h4'>
//               ⚙️ Configure Crate
//             </Typography>
//             <Typography variant='body2' className='mb-6'>
//               Configure how users can buy and open your crate.
//             </Typography>
//             <TextField
//               helperText={'The cost to buy the entire crate'}
//               label='Buy Price'
//               InputProps={{
//                 startAdornment: (
//                   <Typography variant='h5' className='mr-1'>
//                     Ξ{' '}
//                   </Typography>
//                 ),
//               }}
//               placeholder='Buy Price'
//               variant='outlined'
//               type='numeric'
//               fullWidth
//               size='medium'
//             />
//             <Typography variant='body2'>
//               Allow user to buy the crate <Checkbox checked={true} />
//             </Typography>

//             <TextField
//               helperText={'The cost to open the crate and draw a token'}
//               className='mt-6'
//               label='Open Price'
//               InputProps={{
//                 startAdornment: (
//                   <Typography variant='h5' className='mr-1'>
//                     Ξ
//                   </Typography>
//                 ),
//               }}
//               placeholder='Open Price'
//               variant='outlined'
//               type='numeric'
//               fullWidth
//               size='medium'
//             />
//             <Typography variant='body2'>
//               Allow user to open the crate <Checkbox checked={true} />
//             </Typography>

//             <Button
//               onClick={() => setAddTokensOpen(true)}
//               className='mt-3'
//               color='primary'
//               fullWidth
//               size='large'
//               variant='contained'
//             >
//               Update Configuration
//             </Button>
//           </Paper>
//         </Fade>
//       </Modal>

//       <Modal
//         onClose={() => setAddTokensOpen(false)}
//         open={addTokensOpen}
//         className='flex justify-center items-center'
//       >
//         <Fade in={addTokensOpen}>
//           <Paper className='w-4/5 p-5'>
//             <Typography variant='h3'>Add Tokens</Typography>
//             <div className='flex w-full h-full' style={{ minHeight: 500 }}>
//               <div className='flex-1 pr-5'>
//                 <TokenTransferBrowser crateId={query.id} />
//               </div>
//               <div className='flex-1 bg-green-700'>
//                 {tokens &&
//                   tokens.map((child, i) => {
//                     return (
//                       <Card
//                         className='w-2/5'
//                         style={{
//                           backgroundColor: childTokenData[i]?.background_color
//                             ? `#${childTokenData[i].background_color}`
//                             : 'none',
//                         }}
//                       >
//                         {child && <CardHeader title={child[1]} />}
//                         <img src={childTokenData[i]?.image_thumbnail_url} />
//                       </Card>
//                     );
//                     // return <TokenFoo address={child[0]} tokenId={child[1]} />;
//                   })}
//               </div>
//             </div>
//           </Paper>
//         </Fade>
//       </Modal>
//     </AppLayoutContainer>
//   );
// }

// function TokenFoo({ address, tokenId }) {
//   return (
//     <div>
//       {address}
//       {tokenId}
//     </div>
//   );
// }

// export default CratePage;
