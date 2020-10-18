import * as _ from 'lodash';
import range from 'src/utils/range';
import CrateSummaryCard from 'src/components/CrateSummaryCard';
import { useDrizzle } from 'src/utils/drizzle';
import { Button, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';

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
      <div className='p-2 flex flex-wrap'>
        {displayTokenIds.map((tokenId) => {
          return (
            <CrateSummaryCard className='m-1' key={tokenId} crateId={tokenId} />
          );
        })}
      </div>
      <div
        className='flex flex-row w-full justify-center'
        style={{ position: 'absolute', bottom: 10, left: 0 }}
      >
        <Button
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
            <Button variant='outlined' style={{ fontWeight: 600 }}>
              {pageNum}
            </Button>
          ) : (
            <Button> {pageNum} </Button>
          )
        )}
        <Button
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
    </>
  );
}

export default CrateBrowserContainer;
