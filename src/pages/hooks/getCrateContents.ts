import { useDrizzle } from 'src/utils/drizzle';
import { isNil } from 'lodash';

function getCrateContents(crateId, numberOfTokens = 0) {
  // if (isNil(crateId) || isNil(numberOfTokens) || numberOfTokens === 0) {
  //   return [];
  // }
  const { useCacheCall } = useDrizzle();
  const NC = 'NiftyCrate';
  const result = useCacheCall([NC], (call) => {
    const data = {};
    for (let i = 0; i < numberOfTokens; i++) {
      data[i] = call(NC, 'childAtIndex', crateId, i);
    }
    return data;
  });
  return Object.values(result);
}

export default getCrateContents;
