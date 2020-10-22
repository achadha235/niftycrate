import { isNil } from 'lodash';
import range from 'src/utils/range';
import CrateSummaryCard from 'src/components/CrateSummaryCard';
import { useDrizzle, useDrizzleState } from 'src/utils/drizzle';
import { Button, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import { NC } from 'src/constants';
import PageControls from 'src/components/PageControls';

import { AnimatePresence, motion, AnimateSharedLayout } from 'framer-motion';

function OwnedCratesBrowserContainer({ tokensPerPage = 6 }) {
  const { useCacheCall } = useDrizzle();
  const router = useRouter();
  const { query } = router;
  const { balanceOf, tokenIds } = useCacheCall(
    [NC],
    ownedTokenIds(query.address)
  );

  const pageNumber = getPageNumber(query);
  const startToken = getStartToken(pageNumber, tokensPerPage);
  const numPages = getNumPages(balanceOf, tokensPerPage);

  const displayTokenIds = getDisplayTokenIds(
    startToken,
    tokensPerPage,
    balanceOf,
    tokenIds
  ).filter((v) => !isNil(v));

  return (
    <>
      <div className='p-2 pt-0 flex flex-wrap justify-center'>
        <AnimateSharedLayout type='crossfade'>
          <AnimatePresence exitBeforeEnter={true}>
            {displayTokenIds.map((tokenId, i) => {
              return (
                <motion.div
                  key={tokenId}
                  variants={variant(i)}
                  initial={'hidden'}
                  animate={'show'}
                >
                  <CrateSummaryCard
                    key={tokenId}
                    className='m-1'
                    crateId={tokenId}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </AnimateSharedLayout>
      </div>

      {numPages > 1 && (
        <PageControls pageNumber={pageNumber} numPages={numPages} />
      )}
    </>
  );
}

const ownedTokenIds = (address) => (call) => {
  const balanceOf = Number(call(NC, 'balanceOf', address));
  const initialValue = {
    balanceOf: 0,
    tokenIds: [],
  };

  if (isNaN(balanceOf)) {
    return initialValue;
  }

  const tokenOfOwner = (i) => {
    return call(NC, 'tokenOfOwnerByIndex', address, i);
  };

  return {
    balanceOf,
    tokenIds: [...range(0, balanceOf)]
      .map(tokenOfOwner)
      .filter((x) => !isNil(x)),
  };
};

function getPageNumber(query) {
  return Number(query.page) || 1;
}

function getNumPages(avaliableTokens, tokensPerPage) {
  return Math.ceil(avaliableTokens / tokensPerPage);
}

function getStartToken(pageNumber, tokensPerPage) {
  return (pageNumber - 1) * tokensPerPage;
}

function getDisplayTokenIds(
  startToken,
  tokensPerPage,
  avaliableTokens,
  tokenIds
) {
  return [...range(startToken, startToken + tokensPerPage)]
    .filter((i) => i < avaliableTokens)
    .map((i) => tokenIds[i]);
}

const variant = (i) => ({
  show: {
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.083 },
  },
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.1,
    },
  },
});

export default OwnedCratesBrowserContainer;
