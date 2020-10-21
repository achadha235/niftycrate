import AppLayoutContainer from 'src/containers/AppLayout';
import CrateBrowserContainer from 'src/containers/CrateBrowser';

export function Home() {
  return (
    <AppLayoutContainer>
      <div className='w-full max-w-4xl mx-auto'>
        <CrateBrowserContainer />
      </div>
    </AppLayoutContainer>
  );
}

export default Home;
