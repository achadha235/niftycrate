import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import Crate, { CrateProps } from 'src/components/Crate';
import mockTokens from '../../mocks/token';

export default {
  title: 'Crate',
  component: Crate,
} as Meta;

const Template: Story = (args: CrateProps) => <Crate tokens={mockTokens} />;

export const Default = Template.bind({});

Default.args = {};
