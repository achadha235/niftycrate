import { useRouter } from 'next/router';
import { AnimatePresence, motion, AnimateSharedLayout } from 'framer-motion';

import range from 'src/utils/range';
import CrateSummaryCard from 'src/components/CrateSummaryCard';
import { useDrizzle } from 'src/utils/drizzle';
import PageControls from 'src/components/PageControls';

function CrateBrowserContainer({ tokensPerPage = 6 }) {
  const { useCacheCall } = useDrizzle();
  const avaliableTokens = Number(useCacheCall('NiftyCrate', 'totalSupply'));
  const router = useRouter();
  const { query } = router;
  const pageNumber = getPageNumber(query);
  const startToken = getStartToken(pageNumber, tokensPerPage);
  const numPages = getNumPages(avaliableTokens, tokensPerPage);
  const displayTokenIds = getDisplayTokenIds(
    startToken,
    tokensPerPage,
    avaliableTokens
  );

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

function getPageNumber(query) {
  return Number(query.page) || 1;
}

function getStartToken(pageNumber, tokensPerPage) {
  return (pageNumber - 1) * tokensPerPage;
}

function getNumPages(avaliableTokens, tokensPerPage) {
  return Math.ceil(avaliableTokens / tokensPerPage);
}

function getDisplayTokenIds(startToken, tokensPerPage, avaliableTokens) {
  return [...range(startToken, startToken + tokensPerPage)].filter(
    (i) => i < avaliableTokens
  );
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

export default CrateBrowserContainer;
