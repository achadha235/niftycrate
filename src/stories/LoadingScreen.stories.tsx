import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import LoadingScreen, {
  LoadingScreenProps,
} from 'src/components/LoadingScreen';

export default {
  title: 'LoadingScreen',
  component: LoadingScreen,
} as Meta;

const Template: Story = (args: LoadingScreenProps) => (
  <LoadingScreen {...args} />
);

export const Loading = Template.bind({});

Loading.args = {};
