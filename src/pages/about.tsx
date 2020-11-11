import HowItWorks from 'src/components/HowItWorks';
import AppLayoutContainer from 'src/containers/AppLayout';

export function About() {
  return (
    <AppLayoutContainer>
      <div className='w-full max-w-4xl mx-auto'>
        <HowItWorks />
      </div>
    </AppLayoutContainer>
  );
}

export default About;
