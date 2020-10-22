import { Button } from '@material-ui/core';
import { useRouter } from 'next/router';
import range from 'src/utils/range';

function PageControls({ pageNumber, numPages }) {
  const router = useRouter();
  const { query } = router;
  return (
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
            className='mx-1'
            key={pageNum}
            variant='outlined'
            style={{
              fontWeight: 600,
              height: 40,
              minWidth: 40,
              borderRadius: 20,
            }}
          >
            {pageNum}
          </Button>
        ) : (
          <Button
            key={pageNum}
            className='mx-1'
            style={{ height: 40, minWidth: 40, borderRadius: 20 }}
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
  );
}

export default PageControls;
