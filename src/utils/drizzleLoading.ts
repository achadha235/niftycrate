import { AppContext } from 'src/pages/_app';
import { useContext } from 'react';
import { isNil } from 'lodash';
import { UserState } from 'bnc-onboard/dist/src/interfaces';

function drizzleLoading(drizzleState) {
  if (isNil(drizzleState)) {
    return true;
  }
  // const appCtx = useContext(AppContext);
  // const { onboard } = appCtx;
  const { drizzleStatus, contracts } = drizzleState;
  // const userState: UserState = onboard?.getState();
  const addressLoaded =
    isNil(drizzleStatus?.initialized) || drizzleStatus?.initialized === false;
  // isNil(userState?.address);
  return (
    addressLoaded ||
    contracts?.NiftyCrate.initialized === false ||
    contracts?.NiftyCrate.synced === false
  );
}

export default drizzleLoading;
