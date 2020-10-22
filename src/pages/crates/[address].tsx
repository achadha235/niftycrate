import AppLayoutContainer from 'src/containers/AppLayout';
import OwnedCratesBrowser from 'src/containers/OwnedCratesBrowser';

export function Home() {
  return (
    <AppLayoutContainer>
      <div className='w-full max-w-4xl mx-auto'>
        <OwnedCratesBrowser />
      </div>
    </AppLayoutContainer>
  );
}

export default Home;
