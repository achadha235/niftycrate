import { useRouter } from 'next/router';
import { AnimatePresence, motion, AnimateSharedLayout } from 'framer-motion';

import range from 'src/utils/range';
import CrateSummaryCard from 'src/components/CrateSummaryCard';
import { useDrizzle } from 'src/utils/drizzle';
import PageControls from 'src/components/PageControls';

function CrateBrowserContainer({ tokensPerPage = 8 }) {
  const router = useRouter();
  const { query } = router;
  const { useCacheCall } = useDrizzle();

  const avaliableTokens = Number(useCacheCall('NiftyCrate', 'totalSupply'));
  const pageNumber = getPageNumber(query);
  const startToken = getStartToken(pageNumber, tokensPerPage);
  const numPages = getNumPages(avaliableTokens, tokensPerPage);
  const tokenIds = getDisplayTokenIds(
    startToken,
    tokensPerPage,
    avaliableTokens
  );

  return (
    <AnimateSharedLayout type='crossfade'>
      <div className='p-2 pt-0 flex flex-wrap justify-center'>
        <AnimatePresence exitBeforeEnter={true}>
          {tokenIds.map((tokenId, i) => (
            <motion.div
              key={tokenId}
              variants={variant(i)}
              initial={'hidden'}
              animate={'show'}
            >
              <CrateSummaryCard
                className='m-1'
                crateId={tokenId}
                key={tokenId}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {numPages > 1 && (
        <PageControls pageNumber={pageNumber} numPages={numPages} />
      )}
    </AnimateSharedLayout>
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
