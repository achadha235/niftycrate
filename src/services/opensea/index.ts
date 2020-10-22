import getConfig from 'next/config';
import { groupBy, isNil, flatten, memoize } from 'lodash';

const apiBase = 'https://api.opensea.io/api/v1';

const devTokenAddressMap = {
  '0xC97B08Ab25356b94f211ad28A1E312B6C935482f':
    '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d',
};

async function fetchTokens(tokens) {
  const { publicRuntimeConfig } = getConfig();
  const grouped = groupBy(tokens, 'address');
  const useDev = publicRuntimeConfig.ETH_NETWORK_ID === 5777;
  const requests = [];
  for (const contractAddr in grouped) {
    if (
      isNil(contractAddr) ||
      contractAddr === 'null' ||
      grouped[contractAddr].indexOf(null) >= 0
    ) {
      continue;
    }

    const tokenIds = grouped[contractAddr].map(({ tokenId }) => tokenId);
    const tokenAddress = useDev
      ? devTokenAddressMap[contractAddr]
      : contractAddr;

    if (tokenIds && tokenAddress) {
      const reqUrl = `${apiBase}/assets?${tokenIds
        .map((s) => `token_ids=${s}`)
        .join('&')}&asset_contract_address=${tokenAddress}`;
      requests.push(fetch(reqUrl));
    }
  }
  let results = await Promise.all(requests);
  results = await Promise.all(results.map((result) => result.json()));
  results = flatten(results.map((obj) => obj.assets));
  return results;
}

export const fetchTokenData = memoize(fetchTokens, (tokens) => {
  return JSON.stringify(tokens);
});
