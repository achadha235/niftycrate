import { Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { isNil } from 'lodash';

import Crate from 'src/components/Crate';
import getCrateDetails from 'src/pages/hooks/getCrateDetails';
import { fetchTokenData } from 'src/services/opensea';

function CrateView({ crateId }) {
  const crateDetails = getCrateDetails(crateId);
  const [tokenData, setTokenData] = useState(null);

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

  return (
    <div className='flex pt-3 justify-center'>
      <div className='max-w-3xl flex flex-col w-full'>
        <div>
          <Typography variant={'h4'}>Crate #{crateId}</Typography>
        </div>

        <div className='flex-1 flex flex-grow px-2'>
          <div className='flex-1'>
            <Crate tokens={tokenData} />
          </div>
          <div className='px-2 flex-1' style={{ minWidth: 400 }}></div>
        </div>
      </div>
    </div>
  );
}

export default CrateView;
