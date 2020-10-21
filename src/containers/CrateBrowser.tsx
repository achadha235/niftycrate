import * as _ from 'lodash';
import range from 'src/utils/range';
import CrateSummaryCard from 'src/components/CrateSummaryCard';
import { useDrizzle } from 'src/utils/drizzle';
import { Button, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import { AnimatePresence, motion, AnimateSharedLayout } from 'framer-motion';

function CrateBrowserContainer({ tokensPerPage = 6 }) {
  const { useCacheCall } = useDrizzle();
  const avaliableTokens = Number(useCacheCall('NiftyCrate', 'totalSupply'));
  const router = useRouter();
  const { query } = router;
  const pageNumber = Number(query.page) || 1;
  const startToken = (pageNumber - 1) * tokensPerPage;
  const numPages = Math.ceil(avaliableTokens / tokensPerPage);
  const displayTokenIds = [
    ...range(startToken, startToken + tokensPerPage),
  ].filter((i) => i < avaliableTokens);

  return (
    <>
      <div className='p-2 pt-0 flex flex-wrap justify-center'>
        <AnimateSharedLayout type='crossfade'>
          <AnimatePresence exitBeforeEnter={true}>
            {displayTokenIds.map((tokenId, i) => {
              return (
                <motion.div
                  key={tokenId}
                  variants={{
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
                  }}
                  initial={'hidden'}
                  animate={'show'}
                >
                  <CrateSummaryCard
                    className='m-1'
                    key={tokenId}
                    crateId={tokenId}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </AnimateSharedLayout>
      </div>

      {numPages > 1 && (
        <div
          className='flex flex-row w-full justify-center'
          style={{ position: 'absolute', bottom: 10, left: 0 }}
        >
          <Button
            disabled={pageNumber === 1}
            onClick={() =>
              router.push({
                pathname: router.pathname,
                query: { ...query, page: Math.max(1, pageNumber - 1) },
              })
            }
          >
            Previous
          </Button>
          {[...range(1, numPages + 1)].map((pageNum) =>
            pageNum === pageNumber ? (
              <Button
                key={pageNumber}
                variant='outlined'
                style={{ fontWeight: 600 }}
              >
                {pageNum}
              </Button>
            ) : (
              <Button
                onClick={() =>
                  router.push({
                    pathname: router.pathname,
                    query: { ...query, page: pageNum },
                  })
                }
              >
                {pageNum}
              </Button>
            )
          )}
          <Button
            disabled={pageNumber === numPages}
            onClick={() =>
              router.push({
                pathname: router.pathname,
                query: { ...query, page: Math.min(pageNumber + 1, numPages) },
              })
            }
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
}

export default CrateBrowserContainer;
