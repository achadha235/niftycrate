const apiBase = 'https://api.opensea.io/api/v1';

const cache = {};

export async function fetchTokenData(tokenAddress, tokenIds) {
  console.log(tokenAddress);
  const key = `${tokenAddress}-${tokenIds.join('-')}`;
  if (cache[key]) {
    return cache[key];
  }

  const resp = await fetch(
    `${apiBase}/assets?${tokenIds
      .map((s) => `token_ids=${s}`)
      .join('&')}&asset_contract_address=${tokenAddress}`
  );
  const result = (await resp.json()).assets;
  cache[key] = result;
  return result;
}
