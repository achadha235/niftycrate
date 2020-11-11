import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export interface HowItWorksProps {}

export default function HowItWorks() {
  return (
    <div className='max-w-3xl h-full w-full mb-64 mx-auto'>
      <div
        id='splash'
        className='h-64 w-full flex flex-col justify-center items-center'
      >
        <Typography variant='h1'>How It Works</Typography>
        <Typography variant='h5' className='mt-5 max-w-lg'>
          Programmable container for Ethereum tokens
        </Typography>
      </div>

      <div id='step2' className='h-64 mt-10 w-full flex flex-row items-center'>
        <img
          src='images/howitworks/step1.svg'
          className='h-full bg-white rounded-full'
        />
        <div className='h-full m-3 flex flex-col justify-center'>
          <Typography variant='h4'>Buy A Crate</Typography>
          <Typography variant='body2'>
            There are two main ways to get yourself a crate. You can always buy
            a brand empty crates from the store using ETH. Alternativly, can
            purchase a for-sale crate from another user in the Crate
            Marketplace.
          </Typography>
        </div>
      </div>

      <div id='step' className='h-64 mt-10 w-full flex flex-row items-center'>
        <div className='h-full m-3 flex flex-col justify-center'>
          <Typography variant='h4'>Set it up</Typography>
          <Typography variant='body2'>
            Use the token composer to add your NFTs into the crate. You can
            configure the ranking for each item within the crate to indicate
            it's rarity. You an also configure various crate settings such as
            the cost to open or buy the crate.
          </Typography>
        </div>
        <img
          src='images/howitworks/step2.svg'
          className='h-full bg-white rounded-full'
        />
      </div>

      <div id='step' className='mt-10 w-full flex flex-row items-center'>
        <div
          className='h-64 p-8 bg-white rounded-full overflow-hidden flex justify-center items-center'
          style={{ width: 800 }}
        >
          <img className='h-full' src='images/howitworks/step3.svg' />
        </div>
        <div className='h-full m-3 flex flex-col justify-center'>
          <Typography variant='h4'>Share with your fans</Typography>
          <Typography variant='body2'>
            List your crate in the marketplace and share it with your friends.
            Maximize your revenue from your NFT tokens by combining them into a
            lootbox. Buy and sell collections of tokens with a single
            transaction.
          </Typography>
        </div>
      </div>

      <Typography variant='h4' className='mt-10'>
        Frequently Asked Questions
      </Typography>
      <Accordion className='mt-3'>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='body1'>What is a NiftyCrate?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant='body2'>
            A NiftyCrate is an ERC-721 compliant token for the Ethereum
            blockchain. NiftyCrates can be used to contain other ERC-721 tokens.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='body1'>
            What can NiftyCrate be used for?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant='body2'>
            A niftycrate can be used as a composed collection for your non
            fungible tokens
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
