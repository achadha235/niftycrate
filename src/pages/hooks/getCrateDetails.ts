import { useDrizzle, ContractForm, useDrizzleState } from 'src/utils/drizzle';
import range from 'src/utils/range';
import { isNil } from 'lodash';
function getCrateDetails(crateId) {
  if (isNil(crateId)) {
    return null;
  }
  const { useCacheCall } = useDrizzle();
  const NC = 'NiftyCrate';
  const {
    owner,
    numberOfChildren,
    canOpen,
    canBuy,
    cost,
    openCost,
    openFee,
    crateOpener,
    customCrateOpener,
    tokens,
  } = useCacheCall([NC], (call) => {
    const numberOfChildren = Number(call(NC, 'numberOfChildren', crateId));
    const children = [...range(0, numberOfChildren)].map((i) =>
      call(NC, 'childAtIndex', crateId, i)
    );
    const rankings = children
      ? children.map((child) =>
          child ? call(NC, 'tokenRanking', child[0], child[1]) : null
        )
      : [];

    const tokens = children.map((_, i) => ({
      address: children && children[i] ? children[i][0] : null,
      tokenId: children && children[i] ? children[i][1] : null,
      rank: rankings && rankings[i] ? Number(rankings[i]) : null,
    }));

    return {
      owner: call(NC, 'ownerOf', crateId),
      numberOfChildren: numberOfChildren,
      tokens,
      canOpen: call(NC, 'canOpen', crateId),
      canBuy: call(NC, 'canBuy', crateId),
      cost: call(NC, 'cost', crateId),
      openCost: call(NC, 'openCost', crateId),
      openFee: call(NC, 'openFee'),
      customCrateOpener: call(NC, 'customCrateOpener', crateId),
      crateOpener: call(NC, 'crateOpener'),
    };
  });

  const isLoading = [
    owner,
    numberOfChildren,
    tokens,
    canOpen,
    canBuy,
    cost,
    openCost,
    openFee,
    crateOpener,
    customCrateOpener,
  ].reduce((prev, current) => {
    return (
      prev || isNil(current) || (typeof current !== 'object' && isNaN(current))
    );
  }, false);

  if (isLoading) {
    return null;
  }

  const { dust, rare, ultra } = tokens.reduce(
    ({ dust, rare, ultra }, { rank }) => {
      if (rank === 0) return { dust: dust + 1, rare, ultra };
      return { dust, rare, ultra };
    },
    { dust: 0, rare: 0, ultra: 0 }
  );

  return {
    owner,
    numberOfChildren,
    canOpen,
    canBuy,
    cost,
    openCost,
    openFee,
    crateOpener,
    customCrateOpener,
    tokens,
    dust,
    rare,
    ultra,
  };
}

export default getCrateDetails;
