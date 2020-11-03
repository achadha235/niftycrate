import AppLayoutContainer from 'src/containers/AppLayout';
import CrateBrowserContainer from 'src/containers/CrateBrowser';

export function Home() {
  const tokensPerPage = 6;
  return (
    <AppLayoutContainer>
      <div className='w-full max-w-4xl mx-auto'>
        <CrateBrowserContainer tokensPerPage={tokensPerPage} />
      </div>
    </AppLayoutContainer>
  );
}

export default Home;
