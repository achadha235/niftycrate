import { useDrizzle, ContractForm, useDrizzleState } from 'src/utils/drizzle';
import range from 'src/utils/range';

function getCrateDetails(crateId) {
  const { useCacheCall } = useDrizzle();
  // const drizzleState = useDrizzleState((state) => state);
  // const account = drizzleState.accounts[0];

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
    children,
  } = useCacheCall([NC], (call) => {
    const numberOfChildren = Number(call(NC, 'numberOfChildren', crateId));
    return {
      owner: call(NC, 'ownerOf', crateId),
      numberOfChildren: Number(call(NC, 'numberOfChildren', crateId)),
      canOpen: call(NC, 'canOpen', crateId),
      canBuy: call(NC, 'canBuy', crateId),
      cost: call(NC, 'cost', crateId),
      openCost: call(NC, 'openCost', crateId),
      openFee: call(NC, 'openFee'),
      customCrateOpener: call(NC, 'customCrateOpener', crateId),
      crateOpener: call(NC, 'crateOpener'),
      children: [...range(0, numberOfChildren)].map((i) =>
        call(NC, 'childAtIndex', crateId, i)
      ),
    };
  });

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
    children,
  };
}

export default getCrateDetails;
