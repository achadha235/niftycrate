import { Box, Typography, AppBar, Tab, Tabs } from '@material-ui/core';
import { useState } from 'react';
import { Token } from 'src/pages/nft';
import { useDrizzle, useDrizzleState, ContractForm } from 'src/utils/drizzle';
import range from 'src/utils/range';
function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TokenTransferBrowser({ crateId }) {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  return (
    <div className='w-full h-full'>
      <Tabs onChange={handleChange} value={value}>
        <Tab label='CryptoKitties' {...a11yProps(0)} />
        <Tab label='Axie Infinity' {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        {/* <TokenTransferList
          transferToCrate={crateId}
          contractName='Cryptokitties'
        /> */}
      </TabPanel>

      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
    </div>
  );
}

function TokenTransferList({ contractName, transferToCrate }) {
  const drizzleState = useDrizzleState((state) => state);
  const account = drizzleState.accounts[0];
  const { drizzle, useCacheCall } = useDrizzle();
  const { balanceOf } = useCacheCall([contractName], (call) => ({
    balanceOf: call(contractName, 'balanceOf', account),
  }));

  return (
    <div
      className='flex flex-row flex-wrap overflow-scroll gap-4 p-4 bg-black'
      style={{ height: '60vh', border: 'solid 1px black' }}
    >
      {[...range(0, Number(balanceOf || 0))].map((tokenIndex) => (
        <Token
          key={tokenIndex}
          index={tokenIndex}
          transferToCrate={transferToCrate}
        />
      ))}
    </div>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      className='pt-2'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={0}>{children}</Box>}
    </div>
  );
}

export default TokenTransferBrowser;
