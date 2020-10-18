import AppHeaderContainer from './AppHeader';
import NextNprogress from 'nextjs-progressbar';
import tailwindConfig from '../../tailwind.config';
import { AnimateSharedLayout, AnimatePresence } from 'framer-motion';
import { useDrizzleState } from 'src/utils/drizzle';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

function AppLayoutContainer({ children }) {
  // const { drizzleStatus } = useDrizzleState((state) => ({
  //   drizzleStatus: state.drizzleStatus,
  // }));
  // const { initialized } = drizzleStatus;
  const router = useRouter();

  // useEffect(handlePageNavigationEffect(setShowPage, router), []);

  return (
    <>
      <AppHeaderContainer />

      <AnimateSharedLayout>
        <AnimatePresence exitBeforeEnter>
          <motion.div className='mt-16' key={router.asPath} {...pageAnimations}>
            {children}
          </motion.div>
        </AnimatePresence>
      </AnimateSharedLayout>
    </>
  );
}

const pageAnimations = {
  initial: { opacity: 0, y: -5 },
  animate: { opacity: 1, y: 0 },
  exit: {
    y: -5,
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  transition: { duration: 0.2, ease: 'easeInOut' },
};

const handlePageNavigationEffect = (setShowPage, router) => () => {
  const handleRouteChangeComplete = (url) => {
    setShowPage(true);
  };
  router.events.on('routeChangeComplete', handleRouteChangeComplete);
  window.onbeforeunload = function (e) {
    setShowPage(false);
    e.preventDefault();
  };
  return () => {
    router.events.off('routeChangeComplete', handleRouteChangeComplete);
    window.onbeforeunload = null;
  };
};

const Loader = () => <div> Loading...</div>;

export default AppLayoutContainer;
