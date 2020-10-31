import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import CrateCard, { CrateCardProps } from '../components/CrateCard';

export default {
  title: 'CrateCard',
  component: CrateCard,
} as Meta;

const Template: Story = (args: CrateCardProps) => <CrateCard {...args} />;

export const Basic = Template.bind({});
const args: CrateCardProps = {
  image: 'https://placehold.it/400x400',
  id: 423432,
  collection: {
    name: 'CryptoKitties',
    image: 'https://placehold.it/40x40',
  },
  numberOfSales: 3,
};
Basic.args = args;
