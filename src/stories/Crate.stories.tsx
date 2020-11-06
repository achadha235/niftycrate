import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import CrateCard, { CrateCardProps } from '../components/CrateCard';
import mockToken from '../../mocks/token';

export default {
  title: 'CrateCard',
  component: CrateCard,
} as Meta;

const Template: Story = (args: CrateCardProps) => <CrateCard {...args} />;

const token = mockToken[0];

export const Basic = Template.bind({});
const args: CrateCardProps = {
  token: {
    image: token.image_preview_url,
    backgroundColor: token.background_color,
    id: token.id,
    collection: {
      name: token.collection.name,
      image: token.collection.image_url,
    },
    numberOfSales: token.num_sales,
    lastPrice: token.last_sale.total_price,
    maxPrice: token.top_bid?.price,
    ranking: 3214234,
    hitRate: 0.54356,
  },
};
Basic.args = args;

export const Loading = Template.bind({});
const loadingArgs: CrateCardProps = {
  loading: true,
};
Loading.args = loadingArgs;
