// import AdminContainer from 'src/containers/Admin';

import Crate from 'src/components/Crate';
import { useContext } from 'react';
import { drizzleConnect } from '@drizzle/react-plugin';
import { isNil } from 'lodash';

// import { AppContext } from './_app';
import { UserState } from 'bnc-onboard/dist/src/interfaces';
import { DrizzleContext } from '@drizzle/react-plugin';
import drizzleLoading from 'src/utils/drizzleLoading';
import AppLayoutContainer from 'src/containers/AppLayout';

function AdminPage() {
  // return ;

  return (
    <div></div>
    // <AppLayoutContainer>
    //   <AdminContainer />
    // </AppLayoutContainer>
  );
}

export default AdminPage;
