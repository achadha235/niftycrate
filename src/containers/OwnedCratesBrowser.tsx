import * as _ from 'lodash';
import range from 'src/utils/range';
import CrateSummaryCard from 'src/components/CrateSummaryCard';
import { useDrizzle, useDrizzleState } from 'src/utils/drizzle';
import { Button, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';

function OwnedCratesBrowserContainer({ tokensPerPage = 6 }) {
  const { useCacheCall } = useDrizzle();
  // const avaliableTokens = Number(useCacheCall('NiftyCrate', 'balanceOf'));
  const NC = 'NiftyCrate';

  const router = useRouter();
  const { query } = router;
  const { balanceOf, tokenIds } = useCacheCall([NC], (call) => {
    debugger;
    const balanceOf = Number(call(NC, 'balanceOf', query.address));
    if (!isNaN(balanceOf)) {
      const tokenIds = [...range(0, balanceOf)];
      return {
        balanceOf,
        tokenIds: tokenIds
          .map((i) => {
            return call(NC, 'tokenOfOwnerByIndex', query.address, i);
          })
          .filter((x) => x !== undefined),
      };
    } else {
      return {
        balanceOf: 0,
        tokenIds: [],
      };
    }
  });

  if (tokenIds) {
    debugger;
    console.log(tokenIds);
  }

  const pageNumber = Number(query.page) || 1;
  const startToken = (pageNumber - 1) * tokensPerPage;
  const numPages = Math.ceil(balanceOf / tokensPerPage);

  const startIndex = (pageNumber - 1) * tokensPerPage;
  const displayTokenIds = tokenIds;

  return (
    <>
      <div className='p-2 flex flex-wrap'>
        {displayTokenIds.map((tokenId) => {
          return (
            // <div> {tokenId} </div>
            <CrateSummaryCard className='m-1' key={tokenId} crateId={tokenId} />
          );
        })}
      </div>
      {numPages > 1 && (
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
      )}
    </>
  );
}

export default OwnedCratesBrowserContainer;
