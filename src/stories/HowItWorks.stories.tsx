import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import HowItWorks, { HowItWorksProps } from 'src/components/HowItWorks';

export default {
  title: 'HowItWorks',
  component: HowItWorks,
} as Meta;

const Template: Story = (args: HowItWorksProps) => (
  <div className='w-full h-full flex justify-center'>
    <HowItWorks {...args} />
  </div>
);

export const Main = Template.bind({});

Main.args = {};
