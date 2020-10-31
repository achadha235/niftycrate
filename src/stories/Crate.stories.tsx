import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import CrateCard from '../components/CrateCard';

export default {
  title: 'Crate',
  component: CrateCard,
} as Meta;

const Template: Story<{}> = (args) => <CrateCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
